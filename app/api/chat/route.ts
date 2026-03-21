import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const SYSTEM_PROMPT = `You are FitStack's professional AI gym coach. Your role is to give clear, practical, and motivating fitness and nutrition advice.

Guidelines:
- Keep answers concise and actionable (3–6 sentences max unless a detailed plan is requested)
- Focus only on fitness, workouts, diet, nutrition, recovery, and health
- If asked about something unrelated to fitness, politely redirect to fitness topics
- Use simple language — avoid overly technical jargon
- Always be encouraging and supportive
- When recommending exercises, include sets and reps where relevant
- For diet advice, keep it simple — no complex macro calculations unless asked`;

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function POST(req: NextRequest) {
  // ── Key check ──────────────────────────────────────────────
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    console.error("❌ GROQ_API_KEY is not set in .env.local");
    return NextResponse.json(
      { error: "GROQ_API_KEY is missing. Add it to .env.local and restart the server." },
      { status: 500 }
    );
  }

  // ── Init client inside handler (picks up env var reliably) ─
  const groq = new Groq({ apiKey });

  try {
    const { messages } = (await req.json()) as { messages: ChatMessage[] };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "messages array is required" },
        { status: 400 }
      );
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
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
    // Print the full error in the terminal
    if (err instanceof Error) {
      console.error("❌ Groq API error:", err.message);
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    console.error("❌ Groq API unknown error:", err);
    return NextResponse.json({ error: "Failed to get AI response" }, { status: 500 });
  }
}