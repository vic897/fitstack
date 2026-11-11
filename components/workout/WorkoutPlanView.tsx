"use client";

import Link from "next/link";
import type { DayPlan, Goal, Level } from "@/lib/supabase/types";
import { getGoalOption } from "./workoutConfig";

interface WorkoutPlanViewProps {
  plan: DayPlan[];
  goal: Goal | "";
  level: Level | "";
  saved: boolean;
  coachQuery: string;
  onRegenerate: () => void;
  onReset: () => void;
}

interface FocusAccent {
  dotClass: string;
  badgeClass: string;
  setPillClass: string;
  arrowClass: string;
}

function getFocusAccent(focus: string): FocusAccent {
  const f = focus.toLowerCase();
  if (f.includes("cardio") || f.includes("run") || f.includes("endurance")) {
    return {
      dotClass: "bg-sky-400",
      badgeClass: "bg-sky-400/15 text-sky-300",
      setPillClass: "bg-surface-container-lowest text-sky-300",
      arrowClass: "text-sky-300",
    };
  }
  if (f.includes("legs")) {
    return {
      dotClass: "bg-tertiary",
      badgeClass: "bg-surface-bright text-tertiary-fixed",
      setPillClass: "bg-surface-container-lowest text-tertiary",
      arrowClass: "text-tertiary",
    };
  }
  if (f.includes("chest")) {
    return {
      dotClass: "bg-primary",
      badgeClass: "bg-tertiary-container/20 text-tertiary-fixed",
      setPillClass: "bg-surface-container-lowest text-primary",
      arrowClass: "text-primary",
    };
  }
  if (f.includes("back")) {
    return {
      dotClass: "bg-secondary",
      badgeClass: "bg-secondary-container/20 text-secondary",
      setPillClass: "bg-surface-container-lowest text-secondary",
      arrowClass: "text-secondary",
    };
  }
  if (f.includes("shoulder")) {
    return {
      dotClass: "bg-teal-300",
      badgeClass: "bg-teal-400/15 text-teal-200",
      setPillClass: "bg-surface-container-lowest text-teal-300",
      arrowClass: "text-teal-300",
    };
  }
  if (f.includes("arm") || f.includes("bicep") || f.includes("tricep")) {
    return {
      dotClass: "bg-primary-fixed",
      badgeClass: "bg-surface-container-high text-primary-fixed",
      setPillClass: "bg-surface-container-lowest text-primary-fixed",
      arrowClass: "text-primary-fixed",
    };
  }
  if (f.includes("core") || f.includes("abs")) {
    return {
      dotClass: "bg-emerald-300",
      badgeClass: "bg-emerald-400/15 text-emerald-300",
      setPillClass: "bg-surface-container-lowest text-emerald-300",
      arrowClass: "text-emerald-300",
    };
  }
  return {
    dotClass: "bg-primary",
    badgeClass: "bg-primary-container/20 text-primary",
    setPillClass: "bg-surface-container-lowest text-primary",
    arrowClass: "text-primary",
  };
}

function DayCard({
  day,
  index,
  spanFull,
}: {
  day: DayPlan;
  index: number;
  spanFull: boolean;
}) {
  const isRest = day.focus.toLowerCase().includes("rest");

  if (isRest) {
    return (
      <div
        data-day-type="rest"
        className={`flex flex-col justify-between rounded-2xl border border-dashed border-outline-variant/35 bg-surface-container-lowest/85 p-6 shadow-md ${
          spanFull ? "md:col-span-2" : ""
        }`}
      >
        <div className="flex items-center justify-between pb-4">
          <div className="flex items-center gap-2">
            <span className="font-title-lg text-title-lg font-bold tracking-wider text-on-surface-variant uppercase">
              {day.day}
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-outline" />
          </div>
          <span className="rounded-full bg-surface-container-high px-2.5 py-0.5 font-label-sm text-label-sm font-medium uppercase text-on-surface-variant">
            {day.focus}
          </span>
        </div>

        <div className="flex flex-col items-center justify-center gap-3 py-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-container-high text-primary-fixed">
            <span className="material-symbols-outlined text-[26px]">
              {index % 2 === 0 ? "self_improvement" : "bedtime"}
            </span>
          </div>
          <div className="flex max-w-sm flex-col gap-1">
            <span className="font-title-lg text-title-lg font-semibold text-on-surface">
              Rest &amp; Recovery
            </span>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Recovery day — no training scheduled. Allow muscles and nervous
              system to adapt before your next session.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 font-label-sm text-label-sm text-outline">
          <span>Active recovery &amp; sleep</span>
          <span className="material-symbols-outlined text-[16px] text-outline">
            spa
          </span>
        </div>
      </div>
    );
  }

  const accent = getFocusAccent(day.focus);
  const exerciseCount = day.exercises.length;

  return (
    <div
      data-day-type="training"
      className={`group flex flex-col justify-between rounded-2xl border border-outline-variant/25 bg-surface-container/65 p-5 shadow-lg backdrop-blur-md transition-all duration-300 hover:border-primary/35 hover:bg-surface-container/85 ${
        spanFull ? "md:col-span-2" : ""
      }`}
    >
      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-2 pb-4">
          <div className="flex items-center gap-2">
            <span className="font-title-lg text-title-lg font-bold tracking-wider text-on-surface uppercase">
              {day.day}
            </span>
            <span className={`h-1.5 w-1.5 rounded-full ${accent.dotClass}`} />
          </div>
          <span
            className={`rounded-full px-2.5 py-0.5 font-label-sm text-label-sm font-semibold uppercase ${accent.badgeClass}`}
          >
            {day.focus}
          </span>
        </div>

        {/* Exercises List */}
        <ul
          className={
            spanFull
              ? "grid grid-cols-1 gap-2 sm:grid-cols-2"
              : "flex flex-col gap-1.5"
          }
        >
          {day.exercises.map((ex, i) => {
            const colonIdx = ex.lastIndexOf(":");
            const name = colonIdx > 0 ? ex.slice(0, colonIdx).trim() : ex;
            const sets = colonIdx > 0 ? ex.slice(colonIdx + 1).trim() : null;

            return (
              <li
                key={`${day.day}-${i}`}
                className="flex items-center justify-between gap-2 rounded-lg px-2.5 py-2 transition-colors hover:bg-surface-container-high/60"
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <span
                    className={`h-2 w-2 shrink-0 rounded-full ${accent.dotClass}`}
                  />
                  <span className="font-body-md text-body-md text-on-surface">
                    {name}
                  </span>
                </div>
                {sets && (
                  <span
                    className={`shrink-0 rounded-md px-2 py-0.5 font-label-sm text-label-sm font-semibold ${accent.setPillClass}`}
                  >
                    {sets}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Grounded Footer */}
      <div className="flex items-center justify-between pt-4 font-label-sm text-label-sm text-outline">
        <span>
          {exerciseCount} {exerciseCount === 1 ? "exercise" : "exercises"}
        </span>
        <span
          className={`material-symbols-outlined text-[16px] opacity-0 transition-opacity group-hover:opacity-100 ${accent.arrowClass}`}
        >
          fitness_center
        </span>
      </div>
    </div>
  );
}

export default function WorkoutPlanView({
  plan,
  goal,
  level,
  saved,
  coachQuery,
  onRegenerate,
  onReset,
}: WorkoutPlanViewProps) {
  const goalOption = getGoalOption(goal);
  const trainingDays = plan.filter(
    (d) => !d.focus.toLowerCase().includes("rest")
  ).length;
  const restDays = plan.length - trainingDays;
  const totalExercises = plan.reduce(
    (acc, d) =>
      acc + (d.focus.toLowerCase().includes("rest") ? 0 : d.exercises.length),
    0
  );

  return (
    <div className="flex w-full flex-col gap-space-lg">
      {/* Plan Summary & Action Hero Card */}
      <div className="relative flex flex-col justify-between gap-6 overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container/70 p-5 shadow-xl backdrop-blur-xl sm:p-6 lg:flex-row lg:items-center">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/5 blur-2xl" />

        {/* Left Meta Details */}
        <div className="z-10 flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <span className="material-symbols-outlined text-[20px]">
                {goalOption?.materialIcon ?? "fitness_center"}
              </span>
            </div>
            <h2 className="font-headline-md text-headline-md font-bold tracking-tight text-on-surface">
              {goalOption?.label ?? goal} <span className="mx-1 text-outline">—</span>{" "}
              <span className="capitalize text-primary">{level}</span>
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2 font-label-md text-label-md">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-container/20 px-2.5 py-1 font-medium text-primary">
              <span className="material-symbols-outlined text-[14px]">
                auto_awesome
              </span>
              AI Generated
            </span>

            <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-container-high px-2.5 py-1 text-on-surface-variant">
              <span className="material-symbols-outlined text-[14px]">
                calendar_today
              </span>
              {trainingDays} training {trainingDays === 1 ? "day" : "days"} ·{" "}
              {restDays} recovery {restDays === 1 ? "day" : "days"}
            </span>

            <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-container-high px-2.5 py-1 text-on-surface-variant">
              <span className="material-symbols-outlined text-[14px]">
                fitness_center
              </span>
              {totalExercises} exercises total
            </span>

            {saved && (
              <Link
                href="/my-workouts"
                className="inline-flex items-center gap-1 rounded-full bg-primary-container px-2.5 py-1 font-semibold text-on-primary-container shadow-sm transition-colors hover:bg-primary"
              >
                <span className="material-symbols-outlined text-[14px]">
                  check_circle
                </span>
                Saved to My Workouts
              </Link>
            )}
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="z-10 flex flex-wrap items-center gap-2.5 sm:flex-nowrap">
          <button
            id="btn-regenerate"
            type="button"
            onClick={onRegenerate}
            className="group inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-outline-variant/30 bg-surface-container-high px-4 py-2.5 font-label-md text-label-md font-semibold text-on-surface shadow-sm transition-all hover:border-primary/40 hover:bg-surface-variant hover:text-primary active:scale-95 sm:flex-none"
          >
            <span className="material-symbols-outlined text-[18px] transition-transform duration-500 group-hover:rotate-180">
              sync
            </span>
            Regenerate
          </button>

          <button
            id="btn-new-plan"
            type="button"
            onClick={onReset}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-outline-variant/30 bg-surface-container-high px-4 py-2.5 font-label-md text-label-md font-semibold text-on-surface shadow-sm transition-all hover:border-outline/50 hover:bg-surface-variant active:scale-95 sm:flex-none"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            New Plan
          </button>
        </div>
      </div>

      {/* 7-Day Workout Grid */}
      <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2">
        {plan.map((day, idx) => (
          <DayCard
            key={`${day.day}-${idx}`}
            day={day}
            index={idx}
            spanFull={plan.length % 2 === 1 && idx === plan.length - 1}
          />
        ))}
      </div>

      {/* Coach Tip Banner */}
      <div className="relative flex flex-col items-start gap-4 overflow-hidden rounded-2xl border border-primary/25 bg-surface-container/70 p-5 shadow-lg sm:flex-row sm:items-center">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-container/20 text-primary">
          <span className="material-symbols-outlined text-[22px]">
            lightbulb
          </span>
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-title-lg text-title-lg font-bold text-primary">
              Coach Tip
            </span>
            <span className="rounded bg-surface-container-highest px-1.5 py-0.5 font-label-sm text-label-sm font-medium uppercase text-on-surface-variant">
              Guidance
            </span>
          </div>
          <p className="font-body-md text-body-md leading-relaxed text-on-surface-variant">
            This plan was generated specifically for your goal and level. Follow
            it for at least 4 weeks before switching. Progressive overload —
            adding small weight or reps each week — is what drives results.
          </p>
        </div>
        <Link
          href={coachQuery}
          className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap font-label-md text-label-md font-bold text-primary transition-colors hover:text-primary-fixed"
        >
          Ask the AI Coach about any exercise
          <span className="material-symbols-outlined text-[16px]">
            arrow_forward
          </span>
        </Link>
      </div>

      {/* Bottom Regeneration Callout Card */}
      <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-outline-variant/25 bg-surface-container-low p-6 shadow-md sm:flex-row">
        <div className="flex flex-col gap-1 text-center sm:text-left">
          <span className="font-title-lg text-title-lg font-semibold text-on-surface">
            Not happy with this plan?
          </span>
          <span className="font-body-md text-body-md text-on-surface-variant">
            Every generation is unique — the AI picks different exercises each
            time from our database of 149 exercises.
          </span>
        </div>
        <button
          id="btn-generate-different"
          type="button"
          onClick={onRegenerate}
          className="inline-flex w-full shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-outline-variant/30 bg-surface-container-high px-5 py-2.5 font-label-md text-label-md font-semibold text-on-surface shadow-sm transition-all hover:border-primary/40 hover:bg-surface-container-highest hover:text-primary active:scale-95 sm:w-auto"
        >
          <span className="material-symbols-outlined text-[18px]">cached</span>
          Generate a different plan
        </button>
      </div>
    </div>
  );
}
