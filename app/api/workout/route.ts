import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  extractCompletionText,
  formatGroqError,
  getGroqClient,
  GROQ_CONFIG,
  GROQ_MODEL,
} from "@/lib/groq";

// ── In-memory cache — persists across requests in the same instance ─
type CacheEntry = {
  data: Exercise[];
  cachedAt: number;
};

const exerciseCache = new Map<string, CacheEntry>();
const CACHE_TTL = 1000 * 60 * 30; // 30 minutes

function getCached(key: string): Exercise[] | null {
  const entry = exerciseCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.cachedAt > CACHE_TTL) {
    exerciseCache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key: string, data: Exercise[]): void {
  exerciseCache.set(key, { data, cachedAt: Date.now() });
}

type Exercise = {
  name: string;
  muscle_group: string;
  equipment: string;
  difficulty: string;
};

type DayPlan = {
  day: string;
  focus: string;
  exercises: string[];
};

// ── Fetch exercises from Supabase ───────────────────────────────
async function fetchExercisesForPlan(
  goal: string,
  level: string
): Promise<Exercise[]> {
  const cacheKey = `${goal}-${level}`;

  // Return cached if available
  const cached = getCached(cacheKey);
  if (cached) {
    console.log(`Cache hit: ${cacheKey} (${cached.length} exercises)`);
    return cached;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY) are not configured."
    );
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const muscleGroups =
    goal === "endurance"
      ? ["Cardio", "Legs", "Core"]
      : ["Chest", "Back", "Legs", "Shoulders", "Arms", "Core"];

  const difficultyMap: Record<string, string[]> = {
    beginner:     ["beginner"],
    intermediate: ["beginner", "intermediate"],
    advanced:     ["beginner", "intermediate", "advanced"],
  };
  const difficulties = difficultyMap[level] ?? ["beginner"];

  const { data, error } = await supabase
    .from("exercises")
    .select("name, muscle_group, equipment, difficulty")
    .in("muscle_group", muscleGroups)
    .in("difficulty", difficulties)
    .order("muscle_group", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch exercises from Supabase: ${error.message}`);
  }

  const exercises = data ?? [];

  // Only cache non-empty results so transient empty responses aren't sticky
  if (exercises.length > 0) {
    setCache(cacheKey, exercises);
  }
  console.log(`Cache miss: ${cacheKey} — fetched ${exercises.length} exercises`);

  return exercises;
}

// ── Build a strict, structured prompt ──────────────────────────
function buildPrompt(
  goal: string,
  level: string,
  exercises: Exercise[]
): string {
  const goalDescriptions: Record<string, string> = {
    "muscle-gain": "building muscle mass and strength (hypertrophy focus)",
    "fat-loss":    "burning fat while preserving muscle (higher reps, shorter rest)",
    "endurance":   "improving cardiovascular endurance and stamina",
  };

  const daysMap: Record<string, number> = {
    beginner:     3,
    intermediate: 5,
    advanced:     6,
  };

  const repScheme: Record<string, string> = {
    "muscle-gain": "3-5 sets of 6-12 reps for compound lifts, 3 sets of 10-15 for isolation",
    "fat-loss":    "3-4 sets of 12-20 reps with 45-60s rest",
    "endurance":   "2-4 sets of 15-20 reps or timed sets (30-60s)",
  };

  const trainingDays = daysMap[level] ?? 3;
  const restDays     = 7 - trainingDays;
  const goalDesc     = goalDescriptions[goal] ?? goal;
  const reps         = repScheme[goal] ?? "3 sets of 10-12 reps";

  // Group exercises by muscle and build a numbered list
  const grouped = exercises.reduce<Record<string, string[]>>((acc, ex) => {
    if (!acc[ex.muscle_group]) acc[ex.muscle_group] = [];
    acc[ex.muscle_group].push(ex.name);
    return acc;
  }, {});

  const exerciseList = Object.entries(grouped)
    .map(([muscle, exs]) => `[${muscle}]\n${exs.map((e, i) => `  ${i + 1}. ${e}`).join("\n")}`)
    .join("\n\n");

  // Build an exact output example so the AI knows the format
  const exampleOutput =
    goal === "endurance"
      ? `Day 1 - Cardio + Core
- Treadmill Run: 3x20min
- Plank: 3x60s
- Mountain Climber: 3x20

Day 2 - Rest

Day 3 - Legs + Cardio
- Barbell Squat: 3x15
- Jump Rope: 3x3min
- Box Jump: 3x12`
      : `Day 1 - Chest + Triceps
- Barbell Bench Press: 4x8
- Incline Dumbbell Press: 3x10
- Tricep Pushdown: 3x12
- Diamond Push-Up: 3x15

Day 2 - Rest

Day 3 - Back + Biceps
- Lat Pulldown: 4x10
- Seated Cable Row: 3x12
- Dumbbell Curl: 3x12`;

  return `You are a certified personal trainer. Create a ${trainingDays}-day workout plan.

GOAL: ${goalDesc}
LEVEL: ${level}
TRAINING DAYS: ${trainingDays} days, ${restDays} rest day(s)
REP SCHEME: ${reps}

════════════════════════════════════════
AVAILABLE EXERCISES — USE ONLY THESE:
════════════════════════════════════════
${exerciseList}

════════════════════════════════════════
OUTPUT FORMAT — FOLLOW EXACTLY:
════════════════════════════════════════
${exampleOutput}

════════════════════════════════════════
STRICT RULES:
════════════════════════════════════════
1. ONLY use exercise names from the list above — word for word, no variations
2. Every training day MUST have 4-6 exercises
3. Rest days format: "Day X - Rest" with no exercises listed
4. Every exercise line MUST include sets x reps (e.g. 3x10, 4x8, 3x60s)
5. Spread muscle groups across days — no same muscle group two days in a row
6. Do NOT add any text before Day 1 or after the last day
7. Do NOT add tips, explanations, or notes of any kind
8. Do NOT number the days differently — use exactly: Day 1, Day 2, Day 3...`;
}

// ── Validate that exercises in plan exist in DB ─────────────────
function validateAndCleanPlan(
  plan: DayPlan[],
  availableExercises: Exercise[]
): DayPlan[] {
  const validNames = new Set(
    availableExercises.map((e) => e.name.toLowerCase())
  );

  return plan.map((day) => {
    if (day.focus.toLowerCase().includes("rest")) {
      return { ...day, exercises: ["Full rest day"] };
    }

    // Keep only exercises that exist in DB (strip sets/reps for matching)
    const cleanedExercises = day.exercises.filter((ex) => {
      // Extract just the exercise name before the colon
      const namePart = ex
        .split(":")[0]
        .replace(/^[-•*]\s*/, "")
        .replace(/\*\*/g, "")
        .trim()
        .toLowerCase();
      return validNames.has(namePart);
    });

    // If validation removed too many — keep original (AI might have formatted differently)
    return {
      ...day,
      exercises: cleanedExercises.length >= 2 ? cleanedExercises : day.exercises,
    };
  });
}

// ── Parse AI text response into structured objects ──────────────
function parseAIResponse(text: string): DayPlan[] {
  const lines = text
    .trim()
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l !== "" && !l.startsWith("```"));

  const plan: DayPlan[] = [];
  let current: DayPlan | null = null;

  for (const line of lines) {
    // Strip optional markdown heading/bold decorators on day headers
    const normalizedLine = line
      .replace(/^#{1,6}\s*/, "")
      .replace(/^\*\*(.+)\*\*$/, "$1")
      .trim();

    // Match "Day 1 - Focus Area", "Day 1 – Focus Area", "Day 1 — Focus Area", or "Day 1: Focus Area"
    const dayMatch = normalizedLine.match(/^Day\s+(\d+)\s*[-–—:]\s*(.+)$/i);
    if (dayMatch) {
      if (current) plan.push(current);
      current = {
        day:       `Day ${dayMatch[1]}`,
        focus:     dayMatch[2].replace(/\*\*/g, "").trim(),
        exercises: [],
      };
      continue;
    }

    // Match exercise lines starting with -, •, *, or numbered list item
    if (current && !current.focus.toLowerCase().includes("rest")) {
      if (
        line.startsWith("-") ||
        line.startsWith("•") ||
        line.startsWith("*") ||
        /^\d+\.\s+/.test(line)
      ) {
        const exercise = line
          .replace(/^(?:[-•*]|\d+\.)\s*/, "")
          .replace(/\*\*/g, "")
          .trim();
        if (exercise.length > 2) current.exercises.push(exercise);
      }
    }
  }

  // Push last day
  if (current) plan.push(current);

  // Ensure we always have 7 days
  const existingDays = new Set(plan.map((d) => d.day));
  for (let i = 1; i <= 7; i++) {
    if (!existingDays.has(`Day ${i}`)) {
      plan.push({
        day:       `Day ${i}`,
        focus:     "Rest",
        exercises: ["Full rest day"],
      });
    }
  }

  // Sort by day number
  return plan.sort((a, b) => {
    const numA = parseInt(a.day.replace(/\D/g, ""));
    const numB = parseInt(b.day.replace(/\D/g, ""));
    return numA - numB;
  });
}

// ── Route handler ───────────────────────────────────────────────
export async function POST(req: NextRequest) {
  let body: { goal?: unknown; level?: unknown };
  try {
    body = (await req.json()) as { goal?: unknown; level?: unknown };
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON request body.", code: "invalid_json" },
      { status: 400 }
    );
  }

  const goal = typeof body?.goal === "string" ? body.goal.trim() : "";
  const level = typeof body?.level === "string" ? body.level.trim() : "";

  if (!goal || !level) {
    return NextResponse.json(
      { error: "goal and level are required", code: "invalid_parameters" },
      { status: 400 }
    );
  }

  try {
    // 1 — Validate Groq API key & client before expensive work
    const groq = getGroqClient();

    // 2 — Fetch exercises
    const exercises = await fetchExercisesForPlan(goal, level);
    if (exercises.length === 0) {
      return NextResponse.json(
        {
          error: "No exercises found for this combination",
          code: "no_exercises_found",
        },
        { status: 404 }
      );
    }

    // 3 — Build prompt
    const prompt = buildPrompt(goal, level, exercises);

    // 4 — Call Groq with centralized GPT-OSS 120B config
    const completion = await groq.chat.completions.create({
      ...GROQ_CONFIG.workout,
      messages: [
        {
          role:    "system",
          content: "You are a certified personal trainer. You output ONLY structured workout plans in the exact format requested. No explanations. No preamble. No notes. Just the plan.",
        },
        {
          role:    "user",
          content: prompt,
        },
      ],
    });

    const { text: raw, finishReason } = extractCompletionText(completion);

    if (!raw) {
      console.error("Workout Generator empty completion:", {
        model: completion.model ?? GROQ_MODEL,
        finishReason,
        usage: completion.usage,
      });

      return NextResponse.json(
        {
          error:
            finishReason === "length"
              ? "Workout plan generation was truncated before completion (finish_reason: length). Please try again."
              : "AI returned empty response",
          code: finishReason === "length" ? "token_limit_reached" : "empty_completion",
          model: GROQ_MODEL,
        },
        { status: 502 }
      );
    }

    // 5 — Parse and validate
    const parsed    = parseAIResponse(raw);
    const validated = validateAndCleanPlan(parsed, exercises);

    // 6 — Sanity check — at least 2 training days
    const trainingDays = validated.filter(
      (d) => !d.focus.toLowerCase().includes("rest")
    );

    if (trainingDays.length < 2) {
      console.error("Plan parsing failed.", {
        model: completion.model ?? GROQ_MODEL,
        finishReason,
        rawPreview: raw.slice(0, 500),
      });
      return NextResponse.json(
        {
          error: "Plan generation failed — AI output could not be parsed into a valid weekly schedule. Please try again.",
          code: "plan_parse_failed",
          model: GROQ_MODEL,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ plan: validated });

  } catch (err: unknown) {
    const formatted = formatGroqError(err, "Workout Generator");
    console.error("Workout API error:", {
      status: formatted.status,
      code: formatted.code,
      model: formatted.model,
      upstreamStatus: formatted.upstreamStatus,
      message: formatted.error,
    });
    return NextResponse.json(
      {
        error: formatted.error,
        code: formatted.code,
        model: formatted.model,
        ...(formatted.upstreamStatus !== undefined
          ? { upstreamStatus: formatted.upstreamStatus }
          : {}),
      },
      { status: formatted.status }
    );
  }
}
