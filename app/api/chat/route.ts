import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

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

export async function POST(req: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "GROQ_API_KEY is not configured." },
      { status: 500 }
    );
  }

  const groq = new Groq({ apiKey });

  try {
    const { messages, context } = (await req.json()) as {
      messages: ChatMessage[];
      context?: UserContext;
    };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "messages array is required" },
        { status: 400 }
      );
    }

    const systemPrompt = buildSystemPrompt(context ?? {});

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 512,
    });

    const reply =
      completion.choices[0]?.message?.content ??
      "Sorry, I couldn't generate a response. Please try again.";

    return NextResponse.json({ reply });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Groq API error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}