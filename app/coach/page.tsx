"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { getUserContext, type UserContext } from "@/lib/db/userContext";

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
};

const suggestions = [
  "How much protein do I need daily?",
  "What's the best workout for my goal?",
  "How do I lose fat without losing muscle?",
  "Is cardio necessary for muscle gain?",
  "What should I eat before a workout?",
  "How important is sleep for fitness?",
];

const goalLabel: Record<string, string> = {
  "muscle-gain": "Muscle Gain",
  "fat-loss":    "Fat Loss",
  "endurance":   "Endurance",
};

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm ${
          isUser
            ? "bg-green-400 font-bold text-gray-950"
            : "border border-white/10 bg-white/5"
        }`}
      >
        {isUser ? "U" : "🤖"}
      </div>
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

export default function CoachPage() {
  const [messages, setMessages]     = useState<Message[]>([]);
  const [input, setInput]           = useState("");
  const [loading, setLoading]       = useState(false);
  const [context, setContext]       = useState<UserContext | null>(null);
  const [ctxLoading, setCtxLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLTextAreaElement>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    getUserContext().then((ctx) => {
      setContext(ctx);
      setCtxLoading(false);

      const name     = ctx.name ? `, ${ctx.name}` : "";
      const goalPart = ctx.latestGoal
        ? ` I can see your goal is **${goalLabel[ctx.latestGoal]}** at **${ctx.latestLevel}** level.`
        : "";

      const welcome: Message = {
        id:      0,
        role:    "assistant",
        content: `Hey${name}! I'm your AI gym coach 👋${goalPart} Ask me anything about workouts, diet, recovery, or supplements — I'll give you straight, practical answers.`,
      };
      setMessages([welcome]);

      // ── BMI auto-send ────────────────────────────────────────
      const bmi      = searchParams.get("bmi");
      const category = searchParams.get("category");
      const height   = searchParams.get("height");
      const weight   = searchParams.get("weight");
      const unit     = searchParams.get("unit");

      if (bmi && category) {
        const weightUnit  = unit === "imperial" ? "lbs" : "kg";
        const heightLabel = unit === "imperial" ? height : `${height} cm`;
        const autoQuery   = `My BMI is ${bmi} (${category}). My height is ${heightLabel} and my weight is ${weight} ${weightUnit}. Based on this, what should my fitness and diet focus be? Give me specific advice.`;
        setTimeout(() => sendMessageWithContext(autoQuery, ctx), 600);
        return;
      }

      // ── Workout plan auto-send ───────────────────────────────
      const source  = searchParams.get("source");
      const wGoal   = searchParams.get("goal");
      const wLevel  = searchParams.get("level");
      const summary = searchParams.get("summary");

      if (source === "workout" && wGoal && wLevel && summary) {
        const autoQuery = `I just generated a ${goalLabel[wGoal] ?? wGoal} workout plan at ${wLevel} level. Here's a summary of my training days: ${summary}. Can you give me specific tips for this plan? Include advice on rest periods, progressive overload, and anything I should watch out for as a ${wLevel}.`;
        setTimeout(() => sendMessageWithContext(autoQuery, ctx), 600);
      }
    });
  }, []);

  async function sendMessageWithContext(content: string, ctx: UserContext) {
    const userMsg: Message = { id: Date.now(), role: "user", content };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          messages: [{ role: "user", content }],
          context:  ctx,
        }),
      });

      if (!res.ok) throw new Error("API error");
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "assistant", content: data.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id:      Date.now() + 1,
          role:    "assistant",
          content: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  async function sendMessage(text?: string) {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    const userMsg: Message = { id: Date.now(), role: "user", content };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const history = messages
      .filter((m) => m.id !== 0)
      .map((m) => ({ role: m.role, content: m.content }));

    try {
      const res = await fetch("/api/chat", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          messages: [...history, { role: "user", content }],
          context:  context ?? {},
        }),
      });

      if (!res.ok) throw new Error("API error");
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "assistant", content: data.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id:      Date.now() + 1,
          role:    "assistant",
          content: "Sorry, something went wrong. Check your connection and try again.",
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function clearChat() {
    const name     = context?.name ? `, ${context.name}` : "";
    const goalPart = context?.latestGoal
      ? ` I can see your goal is **${goalLabel[context.latestGoal]}** at **${context.latestLevel}** level.`
      : "";
    setMessages([
      {
        id:      0,
        role:    "assistant",
        content: `Hey${name}! I'm your AI gym coach 👋${goalPart} Ask me anything about workouts, diet, recovery, or supplements.`,
      },
    ]);
    setInput("");
  }

  const showSuggestions = messages.length <= 1 && !loading;

  return (
    <div className="flex h-screen flex-col bg-gray-950 text-white">
      <Navbar />

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
                {ctxLoading
                  ? "Loading your profile…"
                  : context?.latestGoal
                  ? `Goal: ${goalLabel[context.latestGoal]} · ${context.latestLevel}`
                  : "Powered by Groq AI"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {context?.latestWeight && (
              <span className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-400 sm:block">
                ⚖️ {context.latestWeight} kg
              </span>
            )}
            {context && context.totalWorkouts > 0 && (
              <span className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-400 sm:block">
                📋 {context.totalWorkouts} plan{context.totalWorkouts > 1 ? "s" : ""}
              </span>
            )}
            <button
              onClick={clearChat}
              className="rounded-full border border-white/10 px-3 py-1.5 text-xs font-semibold text-gray-400 transition-colors hover:border-white/20 hover:text-white"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="mx-auto flex max-w-2xl flex-col gap-5">
            {context?.latestGoal && messages.length <= 1 && (
              <div className="rounded-xl border border-green-400/20 bg-green-400/5 px-4 py-3 text-xs text-green-400">
                ✓ I have your profile — goal, level
                {context.latestWeight ? ", and latest weight" : ""}. My advice will be tailored to you.
              </div>
            )}

            {messages.map((m) => (
              <MessageBubble key={m.id} message={m} />
            ))}

            {loading && <TypingIndicator />}

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
              placeholder={
                context?.name
                  ? `Ask your coach anything, ${context.name}…`
                  : "Ask about workouts, diet, recovery…"
              }
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
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
              </svg>
            </button>
          </div>
          <p className="mx-auto mt-2 max-w-2xl text-center text-xs text-gray-600">
            Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}