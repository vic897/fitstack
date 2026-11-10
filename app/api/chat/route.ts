import { NextRequest, NextResponse } from "next/server";
import {
  extractCompletionText,
  formatGroqError,
  getGroqClient,
  GROQ_CONFIG,
  GROQ_MODEL,
} from "@/lib/groq";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type UserContext = {
  name?: string | null;
  latestGoal?: string | null;
  latestLevel?: string | null;
  latestWeight?: number | null;
  totalWorkouts?: number;
};

function buildSystemPrompt(ctx: UserContext): string {
  const goalMap: Record<string, string> = {
    "muscle-gain": "muscle gain",
    "fat-loss": "fat loss",
    "endurance": "endurance",
  };

  // Build a personal context block
  const lines: string[] = [];

  if (ctx.name) {
    lines.push(`The user's name is ${ctx.name}.`);
  }
  if (ctx.latestGoal) {
    lines.push(`Their current fitness goal is ${goalMap[ctx.latestGoal] ?? ctx.latestGoal}.`);
  }
  if (ctx.latestLevel) {
    lines.push(`Their training level is ${ctx.latestLevel}.`);
  }
  if (ctx.latestWeight) {
    lines.push(`Their most recently logged weight is ${ctx.latestWeight} kg.`);
  }
  if (ctx.totalWorkouts && ctx.totalWorkouts > 0) {
    lines.push(`They have generated ${ctx.totalWorkouts} workout plan${ctx.totalWorkouts > 1 ? "s" : ""} so far.`);
  }

  const userBlock = lines.length > 0
    ? `\n\nUser profile:\n${lines.join("\n")}`
    : "";

  return `You are FitStack's professional AI gym coach. Give clear, practical, motivating fitness and nutrition advice.

Guidelines:
- Address the user by name if you know it
- Tailor advice to their specific goal and level when relevant
- Keep answers concise — 3 to 6 sentences unless a detailed plan is requested
- Only answer fitness, workout, diet, nutrition, recovery, and health questions
- If asked something unrelated to fitness, politely redirect
- Use simple, jargon-free language
- Be encouraging without being over the top
- Include sets and reps when recommending exercises
- For diet advice, keep it practical — no complex macro math unless asked
- If you know their weight, you can use it to give more specific advice (e.g. protein targets)${userBlock}`;
}

function sanitizeMessages(input: unknown): ChatMessage[] | null {
  if (!Array.isArray(input) || input.length === 0) {
    return null;
  }

  const sanitized: ChatMessage[] = [];
  for (const item of input) {
    if (!item || typeof item !== "object") return null;
    const candidate = item as { role?: unknown; content?: unknown };
    if (
      (candidate.role !== "user" && candidate.role !== "assistant") ||
      typeof candidate.content !== "string" ||
      candidate.content.trim().length === 0
    ) {
      return null;
    }
    // Strip any extra properties (e.g. reasoning fields) for strict GPT-OSS compatibility
    sanitized.push({
      role: candidate.role,
      content: candidate.content.trim(),
    });
  }

  return sanitized;
}

export async function POST(req: NextRequest) {
  let body: { messages?: unknown; context?: UserContext };
  try {
    body = (await req.json()) as { messages?: unknown; context?: UserContext };
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON request body.", code: "invalid_json" },
      { status: 400 }
    );
  }

  const messages = sanitizeMessages(body?.messages);
  if (!messages) {
    return NextResponse.json(
      {
        error: "messages array is required and must contain valid user/assistant messages.",
        code: "invalid_messages",
      },
      { status: 400 }
    );
  }

  try {
    const groq = getGroqClient();
    const safeContext =
      body.context && typeof body.context === "object" ? body.context : {};
    const systemPrompt = buildSystemPrompt(safeContext);

    const completion = await groq.chat.completions.create({
      ...GROQ_CONFIG.chat,
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
    });

    const { text, finishReason } = extractCompletionText(completion);

    if (!text) {
      console.error("AI Coach empty completion:", {
        model: completion.model ?? GROQ_MODEL,
        finishReason,
        usage: completion.usage,
      });

      return NextResponse.json(
        {
          error:
            finishReason === "length"
              ? "AI Coach response was truncated before completion (finish_reason: length). Please try again."
              : "AI Coach returned an empty response. Please try again.",
          code: finishReason === "length" ? "token_limit_reached" : "empty_completion",
          model: GROQ_MODEL,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ reply: text });
  } catch (err: unknown) {
    const formatted = formatGroqError(err, "AI Coach");
    console.error("AI Coach Groq API error:", {
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
