"use client";

import type { Goal, Level } from "@/lib/supabase/types";
import {
  WORKOUT_GOALS,
  WORKOUT_LEVELS,
  getGoalOption,
  getLevelOption,
} from "./workoutConfig";

interface ConfigurationViewProps {
  goal: Goal | "";
  level: Level | "";
  onSelectGoal: (goal: Goal) => void;
  onSelectLevel: (level: Level) => void;
  onGenerate: () => void;
}

const PLATFORM_SPECS = [
  {
    label: "AI Model",
    value: "GPT-OSS 120B",
    sub: "Groq Inference",
    icon: "smart_toy",
    accent: "text-primary",
  },
  {
    label: "Weekly Split",
    value: "7-Day Plan",
    sub: "Work + Rest",
    icon: "calendar_month",
    accent: "text-secondary",
  },
  {
    label: "Exercise Library",
    value: "149 Moves",
    sub: "Verified DB",
    icon: "fitness_center",
    accent: "text-tertiary",
  },
  {
    label: "Cloud Sync",
    value: "My Workouts",
    sub: "Signed-In Sync",
    icon: "bookmark_added",
    accent: "text-primary",
  },
];

export default function ConfigurationView({
  goal,
  level,
  onSelectGoal,
  onSelectLevel,
  onGenerate,
}: ConfigurationViewProps) {
  const selectedGoal = getGoalOption(goal);
  const selectedLevel = getLevelOption(level);
  const isReady = Boolean(selectedGoal && selectedLevel);

  return (
    <div className="flex w-full flex-col gap-space-xl">
      <form
        id="workout-generator-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (isReady) onGenerate();
        }}
        className="flex w-full flex-col gap-space-xl"
      >
        {/* STEP 1: GOAL SELECTION */}
        <div className="flex flex-col gap-space-md">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary-container/20 font-label-sm text-label-sm font-bold text-primary">
                01
              </span>
              <h2 className="font-title-lg text-title-lg font-bold uppercase tracking-wide text-on-surface">
                Step 1 — What&apos;s your goal?
              </h2>
            </div>
            <span className="hidden font-label-sm text-label-sm uppercase tracking-wider text-outline sm:inline-block">
              Primary Training Focus
            </span>
          </div>

          <div
            role="radiogroup"
            aria-label="Workout goal"
            className="grid grid-cols-1 gap-gutter md:grid-cols-3"
          >
            {WORKOUT_GOALS.map((g) => {
              const selected = goal === g.value;
              return (
                <button
                  key={g.value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  data-goal={g.value}
                  onClick={() => onSelectGoal(g.value)}
                  className={`group relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-xl border p-space-lg text-left backdrop-blur-xl transition-all duration-300 ${
                    selected
                      ? "border-primary/50 bg-surface-container/80 shadow-xl ring-1 ring-primary/25"
                      : "border-outline-variant/25 bg-surface-container-low/60 shadow-md hover:border-outline-variant/55 hover:bg-surface-container/70"
                  }`}
                >
                  {/* Radiant Border Ambient Halo */}
                  <div
                    className={`pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/12 via-transparent to-transparent transition-opacity duration-300 ${
                      selected ? "opacity-100" : "opacity-0 group-hover:opacity-40"
                    }`}
                  />

                  <div className="relative z-10 flex flex-col gap-space-md">
                    <div className="flex items-center justify-between">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-lg transition-all duration-300 ${
                          selected
                            ? "bg-surface-container-highest text-primary shadow-[0_0_20px_rgba(78,222,163,0.25)] group-hover:scale-105"
                            : "bg-surface-container text-outline group-hover:text-primary"
                        }`}
                      >
                        <span className="material-symbols-outlined text-[26px]">
                          {g.materialIcon}
                        </span>
                      </div>

                      <div
                        className={`flex h-6 w-6 items-center justify-center rounded-full transition-all ${
                          selected
                            ? "bg-primary-container text-on-primary-container shadow-[0_0_12px_rgba(16,185,129,0.4)]"
                            : "border border-outline-variant/40 bg-surface-container-highest"
                        }`}
                      >
                        <span
                          className={`material-symbols-outlined text-[16px] font-bold transition-opacity ${
                            selected ? "opacity-100" : "opacity-0"
                          }`}
                        >
                          check
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="font-headline-md text-headline-md font-bold tracking-tight text-on-surface">
                        {g.label}
                      </span>
                      <p className="font-body-md text-body-md leading-relaxed text-on-surface-variant">
                        {g.desc}
                      </p>
                      {selected && (
                        <p className="mt-1.5 font-label-md text-label-md text-primary/90">
                          {g.tip}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Footer Strip */}
                  <div className="relative z-10 -mx-space-lg -mb-space-lg mt-space-md flex items-center justify-between border-t border-outline-variant/15 bg-surface-container-lowest/45 px-space-lg py-2.5">
                    <span
                      className={`font-label-sm text-label-sm font-semibold uppercase ${
                        selected ? "text-primary" : "text-outline"
                      }`}
                    >
                      {g.schemeLabel}
                    </span>
                    <span
                      className={`font-label-md text-label-md font-medium ${
                        selected ? "text-on-surface" : "text-on-surface-variant"
                      }`}
                    >
                      {g.schemeValue}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* STEP 2: EXPERIENCE LEVEL */}
        <div className="flex flex-col gap-space-md">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary-container/20 font-label-sm text-label-sm font-bold text-primary">
                02
              </span>
              <h2 className="font-title-lg text-title-lg font-bold uppercase tracking-wide text-on-surface">
                Step 2 — What&apos;s your level?
              </h2>
            </div>
            <span className="hidden font-label-sm text-label-sm uppercase tracking-wider text-outline sm:inline-block">
              Experience &amp; Weekly Frequency
            </span>
          </div>

          <div
            role="radiogroup"
            aria-label="Experience level"
            className="grid grid-cols-1 gap-gutter md:grid-cols-3"
          >
            {WORKOUT_LEVELS.map((l) => {
              const selected = level === l.value;
              return (
                <button
                  key={l.value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  data-level={l.value}
                  onClick={() => onSelectLevel(l.value)}
                  className={`group relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-xl border p-space-lg text-left backdrop-blur-xl transition-all duration-300 ${
                    selected
                      ? "border-primary/50 bg-surface-container/80 shadow-xl ring-1 ring-primary/25"
                      : "border-outline-variant/25 bg-surface-container-low/60 shadow-md hover:border-outline-variant/55 hover:bg-surface-container/70"
                  }`}
                >
                  <div
                    className={`pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/12 via-transparent to-transparent transition-opacity duration-300 ${
                      selected ? "opacity-100" : "opacity-0 group-hover:opacity-40"
                    }`}
                  />

                  <div className="relative z-10 flex flex-col gap-space-md">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-headline-md text-headline-md font-bold tracking-tight text-on-surface">
                            {l.label}
                          </span>
                          {l.badge && (
                            <span className="rounded-full bg-primary/20 px-2 py-0.5 font-label-sm text-[10px] font-bold uppercase text-primary">
                              {l.badge}
                            </span>
                          )}
                        </div>
                        <span
                          className={`mt-1 inline-block font-label-sm text-label-sm font-semibold uppercase ${
                            selected ? "text-primary" : "text-primary/80"
                          }`}
                        >
                          {l.span}
                        </span>
                      </div>

                      <div
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-all ${
                          selected
                            ? "bg-primary-container text-on-primary-container shadow-[0_0_12px_rgba(16,185,129,0.4)]"
                            : "border border-outline-variant/40 bg-surface-container-highest"
                        }`}
                      >
                        <span
                          className={`material-symbols-outlined text-[16px] font-bold transition-opacity ${
                            selected ? "opacity-100" : "opacity-0"
                          }`}
                        >
                          check
                        </span>
                      </div>
                    </div>

                    <p className="font-body-md text-body-md leading-relaxed text-on-surface-variant">
                      {l.desc}
                    </p>
                  </div>

                  {/* Frequency Bar */}
                  <div className="relative z-10 mt-space-md flex items-center gap-3 pt-space-md">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container-highest">
                      <div
                        className={`h-full rounded-full transition-colors ${l.barWidthClass} ${
                          selected ? "bg-primary" : "bg-primary/50"
                        }`}
                      />
                    </div>
                    <span
                      className={`whitespace-nowrap font-label-sm text-label-sm ${
                        selected
                          ? "font-bold text-primary"
                          : "font-medium text-outline"
                      }`}
                    >
                      {l.shortDays}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Panel & Generation Trigger */}
        <div className="mt-space-sm flex flex-col items-center justify-between gap-space-lg rounded-2xl border border-outline-variant/30 bg-surface-container-lowest/85 p-space-lg shadow-2xl backdrop-blur-2xl md:flex-row">
          <div className="flex w-full items-center gap-space-md md:w-auto">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors ${
                isReady
                  ? "bg-primary/15 text-primary ring-1 ring-primary/30"
                  : "bg-surface-container-high text-outline"
              }`}
            >
              <span className="material-symbols-outlined text-[24px]">
                tune
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm font-semibold uppercase tracking-wider text-outline">
                Active Configuration
              </span>
              <div className="mt-0.5 flex flex-wrap items-center gap-2">
                {selectedGoal || selectedLevel ? (
                  <span
                    id="active-summary-text"
                    className="font-title-lg text-title-lg font-bold tracking-tight text-on-surface"
                  >
                    {selectedGoal ? selectedGoal.label : "Select goal"} ·{" "}
                    {selectedLevel
                      ? `${selectedLevel.label} (${selectedLevel.days})`
                      : "Select level"}
                  </span>
                ) : (
                  <span
                    id="active-summary-text"
                    className="font-body-lg text-body-lg font-medium text-on-surface-variant"
                  >
                    Choose a goal and experience level above
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col items-center gap-2 md:w-auto md:items-end">
            <button
              id="generate-btn"
              type="submit"
              disabled={!isReady}
              className="group flex w-full items-center justify-center gap-3 rounded-full bg-primary px-8 py-3.5 font-title-lg text-title-lg font-bold text-on-primary shadow-[0_0_28px_rgba(78,222,163,0.35)] transition-all hover:scale-[1.02] hover:bg-primary-fixed hover:shadow-[0_0_36px_rgba(78,222,163,0.55)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-35 disabled:shadow-none disabled:hover:scale-100 md:w-auto"
            >
              <span>Generate My Plan</span>
              <span className="material-symbols-outlined text-[22px] transition-transform group-hover:translate-x-1">
                arrow_forward
              </span>
            </button>
            <div className="flex items-center gap-1.5 text-center font-label-md text-label-md text-on-surface-variant">
              <span className="material-symbols-outlined text-[14px] text-primary">
                bolt
              </span>
              <span>
                Powered by Groq AI · Exercises from Supabase · Free to use
              </span>
            </div>
          </div>
        </div>
      </form>

      {/* Factual Engine Spec Strip */}
      <div className="grid grid-cols-2 gap-gutter pt-space-xs sm:grid-cols-4">
        {PLATFORM_SPECS.map((spec) => (
          <div
            key={spec.label}
            className="flex flex-col gap-1 rounded-xl border border-outline-variant/20 bg-surface-container-low/45 p-space-md"
          >
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">
              {spec.label}
            </span>
            <span className="font-title-lg font-extrabold text-on-surface sm:text-headline-md">
              {spec.value}
            </span>
            <span
              className={`flex items-center gap-1 font-label-md text-label-md ${spec.accent}`}
            >
              <span className="material-symbols-outlined text-[14px]">
                {spec.icon}
              </span>
              {spec.sub}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
