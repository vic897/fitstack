"use client";

import { useState, useRef, useEffect, type KeyboardEvent } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getUserContext, type UserContext } from "@/lib/db/userContext";
import {
  buildWelcomeMessage,
  GOAL_LABELS,
  type ChatMessage,
} from "@/components/coach/coachConfig";
import CoachHeader from "@/components/coach/CoachHeader";
import {
  MessageBubble,
  SuggestionGrid,
  TypingIndicator,
} from "@/components/coach/CoachMessages";
import CoachComposer from "@/components/coach/CoachComposer";

const DEFAULT_CONTEXT: UserContext = {
  name: null,
  latestGoal: null,
  latestLevel: null,
  latestWeight: null,
  totalWorkouts: 0,
};

export default function CoachPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useState<UserContext | null>(null);
  const [ctxLoading, setCtxLoading] = useState(true);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const hasInitializedRef = useRef(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (messages.length > 1 || loading) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  async function sendMessageWithContext(content: string, ctx: UserContext) {
    const userMsg: ChatMessage = {
      id: Date.now(),
      role: "user",
      content,
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content }],
          context: ctx,
        }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok || typeof data?.reply !== "string") {
        throw new Error(data?.error ?? `API error (${res.status})`);
      }

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "assistant", content: data.reply },
      ]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Please try again.";
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: `Sorry, something went wrong: ${msg}`,
          isError: true,
          retryContent: content,
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  useEffect(() => {
    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;

    let cancelled = false;
    let autoSendTimer: ReturnType<typeof setTimeout> | null = null;

    async function initCoach() {
      let resolvedCtx = DEFAULT_CONTEXT;
      try {
        resolvedCtx = await getUserContext();
      } catch {
        resolvedCtx = DEFAULT_CONTEXT;
      }

      if (cancelled) return;

      setContext(resolvedCtx);
      setCtxLoading(false);
      setMessages([buildWelcomeMessage(resolvedCtx, false)]);

      // BMI auto-send
      const bmi = searchParams.get("bmi");
      const category = searchParams.get("category");
      const height = searchParams.get("height");
      const weight = searchParams.get("weight");
      const unit = searchParams.get("unit");

      if (bmi && category) {
        const weightUnit = unit === "imperial" ? "lbs" : "kg";
        const heightLabel = unit === "imperial" ? height : `${height} cm`;
        const autoQuery = `My BMI is ${bmi} (${category}). My height is ${heightLabel} and my weight is ${weight} ${weightUnit}. Based on this, what should my fitness and diet focus be? Give me specific advice.`;
        autoSendTimer = setTimeout(() => {
          void sendMessageWithContext(autoQuery, resolvedCtx);
        }, 600);
        return;
      }

      // Workout plan auto-send
      const source = searchParams.get("source");
      const wGoal = searchParams.get("goal");
      const wLevel = searchParams.get("level");
      const summary = searchParams.get("summary");

      if (source === "workout" && wGoal && wLevel && summary) {
        const autoQuery = `I just generated a ${
          GOAL_LABELS[wGoal] ?? wGoal
        } workout plan at ${wLevel} level. Here's a summary of my training days: ${summary}. Can you give me specific tips for this plan? Include advice on rest periods, progressive overload, and anything I should watch out for as a ${wLevel}.`;
        autoSendTimer = setTimeout(() => {
          void sendMessageWithContext(autoQuery, resolvedCtx);
        }, 600);
      }
    }

    void initCoach();
    return () => {
      cancelled = true;
      if (autoSendTimer) clearTimeout(autoSendTimer);
    };
  }, [searchParams]);

  async function sendMessage(text?: string) {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now(),
      role: "user",
      content,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }
    setLoading(true);

    const history = messages
      .filter((m) => m.id !== 0 && !m.isError)
      .map((m) => ({ role: m.role, content: m.content }));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...history, { role: "user", content }],
          context: context ?? {},
        }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok || typeof data?.reply !== "string") {
        throw new Error(data?.error ?? `API error (${res.status})`);
      }

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "assistant", content: data.reply },
      ]);
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Check your connection and try again.";
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: `Sorry, something went wrong: ${msg}`,
          isError: true,
          retryContent: content,
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  async function handleRetry(retryContent: string) {
    if (loading || !retryContent.trim()) return;
    setLoading(true);

    const cleanHistory = messages
      .filter((m) => m.id !== 0 && !m.isError)
      .map((m) => ({ role: m.role, content: m.content }));

    const alreadyEndsWithPrompt =
      cleanHistory.length > 0 &&
      cleanHistory[cleanHistory.length - 1].role === "user" &&
      cleanHistory[cleanHistory.length - 1].content === retryContent;

    const payloadMessages = alreadyEndsWithPrompt
      ? cleanHistory
      : [...cleanHistory, { role: "user" as const, content: retryContent }];

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: payloadMessages,
          context: context ?? {},
        }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok || typeof data?.reply !== "string") {
        throw new Error(data?.error ?? `API error (${res.status})`);
      }

      // Replace trailing error bubble with clean assistant response
      setMessages((prev) => [
        ...prev.filter((m) => !m.isError),
        { id: Date.now() + 1, role: "assistant", content: data.reply },
      ]);
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Check your connection and try again.";
      setMessages((prev) => [
        ...prev.filter((m) => !m.isError),
        {
          id: Date.now() + 1,
          role: "assistant",
          content: `Sorry, something went wrong: ${msg}`,
          isError: true,
          retryContent,
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage();
    }
  }

  function clearChat() {
    setMessages([buildWelcomeMessage(context, true)]);
    setInput("");
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.focus();
    }
  }

  const showSuggestions = messages.length <= 1 && !loading;

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-clip bg-surface-container-lowest text-on-surface">
      <Navbar />

      {/* Ambient Atmospheric Backlight Glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        <div className="absolute left-1/2 top-12 h-[320px] w-[850px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute right-10 top-[520px] h-[420px] w-[420px] rounded-full bg-primary-container/6 blur-[140px]" />
      </div>

      <main className="relative z-10 flex w-full flex-1 flex-col pt-16">
        <CoachHeader
          context={context}
          ctxLoading={ctxLoading}
          onClear={clearChat}
        />

        {/* Conversation Stage */}
        <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-space-lg px-margin-mobile py-space-lg sm:px-margin">
          {/* Profile Sync Confirmation Pill when profile data is available */}
          {context?.latestGoal && messages.length <= 1 && (
            <div className="flex w-full justify-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-2 font-label-md text-label-md font-medium text-primary shadow-sm backdrop-blur-md">
                <span className="material-symbols-outlined text-[18px]">
                  verified_user
                </span>
                <span>
                  Profile Loaded — Goal:{" "}
                  {GOAL_LABELS[context.latestGoal] ?? context.latestGoal}
                  {context.latestLevel ? `, Level: ${context.latestLevel}` : ""}
                  {context.latestWeight
                    ? `, Weight: ${context.latestWeight} kg`
                    : ""}
                  . Advice will be tailored to you.
                </span>
              </div>
            </div>
          )}

          {/* Conversational Stream */}
          <div id="coach-messages" className="flex w-full flex-col gap-space-lg">
            {messages.map((m) => (
              <MessageBubble
                key={m.id}
                message={m}
                userName={context?.name ?? null}
                onRetry={handleRetry}
              />
            ))}

            {loading && <TypingIndicator />}
          </div>

          {/* Empty-state Quick Focus Topics */}
          {showSuggestions && (
            <SuggestionGrid onSelect={(question) => void sendMessage(question)} />
          )}

          <div ref={bottomRef} />
        </div>

        <CoachComposer
          input={input}
          loading={loading}
          userName={context?.name ?? null}
          inputRef={inputRef}
          onChange={setInput}
          onSend={() => void sendMessage()}
          onKeyDown={handleKeyDown}
        />
      </main>

      <Footer />
    </div>
  );
}
