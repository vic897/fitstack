"use client";

import type { UserContext } from "@/lib/db/userContext";
import { GOAL_LABELS } from "./coachConfig";

interface CoachHeaderProps {
  context: UserContext | null;
  ctxLoading: boolean;
  onClear: () => void;
}

export default function CoachHeader({
  context,
  ctxLoading,
  onClear,
}: CoachHeaderProps) {
  return (
    <section className="w-full border-b border-outline-variant/25 bg-surface-container-low/75 px-margin-mobile py-space-md backdrop-blur-xl sm:px-margin">
      <div className="mx-auto flex max-w-5xl flex-col justify-between gap-space-md md:flex-row md:items-center">
        {/* Left: Identity & Model Indicator */}
        <div className="flex items-center gap-space-md">
          <div className="relative shrink-0">
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-primary/30 bg-surface-container-highest shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              <span className="material-symbols-outlined text-[26px] text-primary">
                psychology
              </span>
            </div>
            <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-surface-container-lowest bg-primary" />
          </div>

          <div className="flex min-w-0 flex-col">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-headline-md text-headline-md font-bold tracking-tight text-on-surface">
                AI Gym Coach
              </h1>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 font-label-sm text-label-sm font-semibold text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Groq · GPT-OSS 120B
              </span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant">
              {ctxLoading
                ? "Loading your training profile…"
                : "Personalized guidance for workouts, nutrition, and recovery."}
            </p>
          </div>
        </div>

        {/* Right: User Profile Context Chips + Clear Chat */}
        <div className="flex flex-wrap items-center gap-2">
          {context?.latestGoal && (
            <div className="flex items-center gap-1.5 rounded-lg border border-outline-variant/35 bg-surface-container-high px-3 py-1.5 font-label-md text-label-md text-on-surface">
              <span className="material-symbols-outlined text-[16px] text-primary">
                check_circle
              </span>
              <span className="text-on-surface-variant">Goal:</span>
              <span className="font-semibold capitalize text-primary">
                {GOAL_LABELS[context.latestGoal] ?? context.latestGoal}
                {context.latestLevel ? ` · ${context.latestLevel}` : ""}
              </span>
            </div>
          )}

          {context?.latestWeight && (
            <div className="hidden items-center gap-1.5 rounded-lg border border-outline-variant/35 bg-surface-container-high px-3 py-1.5 font-label-md text-label-md text-on-surface sm:flex">
              <span className="material-symbols-outlined text-[16px] text-secondary">
                monitor_weight
              </span>
              <span className="font-medium text-on-surface">
                {context.latestWeight} kg
              </span>
            </div>
          )}

          {context && context.totalWorkouts > 0 && (
            <div className="hidden items-center gap-1.5 rounded-lg border border-outline-variant/30 bg-surface-container px-2.5 py-1.5 font-label-sm text-label-sm text-on-surface-variant sm:flex">
              <span className="material-symbols-outlined text-[14px] text-primary">
                fact_check
              </span>
              <span>
                {context.totalWorkouts} plan
                {context.totalWorkouts > 1 ? "s" : ""} saved
              </span>
            </div>
          )}

          <button
            id="clear-chat-btn"
            type="button"
            onClick={onClear}
            className="flex items-center gap-1.5 rounded-lg border border-outline-variant/40 bg-surface-container-highest px-3 py-1.5 font-label-md text-label-md font-medium text-on-surface-variant transition-colors hover:border-outline/60 hover:bg-surface-bright hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[16px]">
              refresh
            </span>
            <span>Clear Chat</span>
          </button>
        </div>
      </div>
    </section>
  );
}
