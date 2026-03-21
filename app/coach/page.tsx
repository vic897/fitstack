"use client";

import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";

// ── Types ──────────────────────────────────────────────────────
type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
};

// ── Mock responses (replaced by Groq in Step 5) ───────────────
const mockResponses: Record<string, string> = {
  default:
    "Great question! As your AI fitness coach, I'd suggest focusing on consistency above all else. Whether your goal is muscle gain, fat loss, or endurance — showing up regularly beats any perfect plan you don't follow. What specific aspect of your training or diet can I help you with?",
  protein:
    "For muscle gain, aim for 1.6–2.2g of protein per kg of bodyweight daily. Good sources include chicken breast, eggs, Greek yoghurt, tuna, and whey protein. Spread your intake across 3–4 meals for best results.",
  workout:
    "A solid beginner workout plan hits each muscle group 2× per week with compound lifts — squat, deadlift, bench press, and row. Start with 3 sets of 8–10 reps, rest 90 seconds between sets, and add a little weight each week.",
  diet:
    "Keep your diet simple: high protein, mostly whole foods, and a calorie intake matched to your goal. For fat loss, a 300–500 calorie deficit works well. For muscle gain, a 200–300 calorie surplus is enough to build without excess fat.",
  sleep:
    "Sleep is when your body actually builds muscle and burns fat. Aim for 7–9 hours. Poor sleep raises cortisol, kills recovery, and increases cravings — it undermines almost every fitness effort. Treat sleep as part of your training.",
  cardio:
    "Cardio is great for heart health and fat loss, but don't overdo it if muscle gain is your goal. 2–3 sessions of 20–30 minutes per week is plenty. HIIT burns more calories in less time, but steady-state cardio is easier to recover from.",
  beginner:
    "As a beginner, your biggest advantage is that almost everything works. Focus on: (1) learning the main compound lifts with good form, (2) hitting the gym 3× per week consistently, (3) eating enough protein, and (4) sleeping well. Don't overthink it — just start.",
};

function getMockResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("protein")) return mockResponses.protein;
  if (lower.includes("workout") || lower.includes("training") || lower.includes("exercise"))
    return mockResponses.workout;
  if (lower.includes("diet") || lower.includes("eat") || lower.includes("food") || lower.includes("meal"))
    return mockResponses.diet;
  if (lower.includes("sleep") || lower.includes("recovery") || lower.includes("rest"))
    return mockResponses.sleep;
  if (lower.includes("cardio") || lower.includes("run") || lower.includes("hiit"))
    return mockResponses.cardio;
  if (lower.includes("beginner") || lower.includes("start") || lower.includes("new"))
    return mockResponses.beginner;
  return mockResponses.default;
}

// ── Suggested prompts ─────────────────────────────────────────
const suggestions = [
  "How much protein do I need daily?",
  "What's the best workout for beginners?",
  "How do I lose fat without losing muscle?",
  "Is cardio necessary for muscle gain?",
  "What should I eat before a workout?",
  "How important is sleep for fitness?",
];

// ── Components ────────────────────────────────────────────────
function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar */}
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm ${
          isUser
            ? "bg-green-400 font-bold text-gray-950"
            : "border border-white/10 bg-white/5"
        }`}
      >
        {isUser ? "U" : "🤖"}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? "rounded-tr-sm bg-green-400 text-gray-950"
            : "rounded-tl-sm border border-white/10 bg-white/5 text-gray-200"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sm">
        🤖
      </div>
      <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm border border-white/10 bg-white/5 px-4 py-3">
        <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:0ms]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:150ms]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:300ms]" />
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────
const WELCOME: Message = {
  id: 0,
  role: "assistant",
  content:
    "Hey! I'm your AI gym coach 👋 I can help with workout plans, exercise form, diet advice, recovery, and anything else fitness-related. What's on your mind?",
};

export default function CoachPage() {
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(text?: string) {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    const userMsg: Message = {
      // eslint-disable-next-line react-hooks/purity
      id: Date.now(),
      role: "user",
      content,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    // Simulate network delay (replaced by real API in Step 5)
    await new Promise((r) => setTimeout(r, 1000 + Math.random() * 800));

    const reply: Message = {
      // eslint-disable-next-line react-hooks/purity
      id: Date.now() + 1,
      role: "assistant",
      content: getMockResponse(content),
    };

    setMessages((prev) => [...prev, reply]);
    setLoading(false);
    inputRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function clearChat() {
    setMessages([WELCOME]);
    setInput("");
  }

  const showSuggestions = messages.length === 1;

  return (
    <div className="flex h-screen flex-col bg-gray-950 text-white">
      <Navbar />

      {/* Chat window */}
      <div className="flex flex-1 flex-col overflow-hidden pt-16">
        {/* Chat header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-green-400/30 bg-green-400/10 text-lg">
              🤖
            </div>
            <div>
              <p className="text-sm font-bold">AI Gym Coach</p>
              <p className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                Online — powered by Groq AI
              </p>
            </div>
          </div>
          <button
            onClick={clearChat}
            className="rounded-full border border-white/10 px-3 py-1.5 text-xs font-semibold text-gray-400 transition-colors hover:border-white/20 hover:text-white"
          >
            Clear chat
          </button>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="mx-auto flex max-w-2xl flex-col gap-5">
            {messages.map((m) => (
              <MessageBubble key={m.id} message={m} />
            ))}

            {loading && <TypingIndicator />}

            {/* Suggested questions — only before first user message */}
            {showSuggestions && (
              <div className="mt-2">
                <p className="mb-3 text-xs font-semibold text-gray-500">
                  Suggested questions
                </p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-gray-300 transition-all hover:border-green-400/40 hover:text-green-400"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        </div>

        {/* Input bar */}
        <div className="border-t border-white/10 bg-gray-950 px-6 py-4">
          <div className="mx-auto flex max-w-2xl items-end gap-3">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about workouts, diet, recovery…"
              rows={1}
              className="flex-1 resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition focus:border-green-400/50 focus:ring-1 focus:ring-green-400/20"
              style={{ maxHeight: "120px" }}
              onInput={(e) => {
                const t = e.currentTarget;
                t.style.height = "auto";
                t.style.height = t.scrollHeight + "px";
              }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-400 text-gray-950 transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
              aria-label="Send"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
              </svg>
            </button>
          </div>
          <p className="mx-auto mt-2 max-w-2xl text-center text-xs text-gray-600">
            Enter to send · Shift+Enter for new line · Currently using mock responses
          </p>
        </div>
      </div>
    </div>
  );
}