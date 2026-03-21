"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { WorkoutPlanSkeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";
import { saveWorkout } from "@/lib/db/workouts";
import type { DayPlan, Goal, Level } from "@/lib/supabase/types";

const goals = [
  {
    value: "muscle-gain",
    label: "Muscle Gain",
    icon: "💪",
    desc: "Build size and strength",
    tip: "AI will select compound and isolation lifts suited to your level.",
  },
  {
    value: "fat-loss",
    label: "Fat Loss",
    icon: "🔥",
    desc: "Burn fat, stay lean",
    tip: "AI will combine resistance training with higher rep cardio work.",
  },
  {
    value: "endurance",
    label: "Endurance",
    icon: "🏃",
    desc: "Stamina and cardio fitness",
    tip: "AI will build a cardio-first plan with supporting strength work.",
  },
];

const levels = [
  { value: "beginner",     label: "Beginner",     desc: "0–6 months",        days: "3 days/week" },
  { value: "intermediate", label: "Intermediate", desc: "6 months – 2 years", days: "5 days/week" },
  { value: "advanced",     label: "Advanced",     desc: "2+ years",           days: "6 days/week" },
];

function getFocusColor(focus: string): string {
  const f = focus.toLowerCase();
  if (f.includes("rest"))                                          return "text-gray-600";
  if (f.includes("cardio") || f.includes("run") || f.includes("endurance")) return "text-blue-400";
  if (f.includes("legs"))                                          return "text-yellow-400";
  if (f.includes("chest"))                                         return "text-orange-400";
  if (f.includes("back"))                                          return "text-purple-400";
  if (f.includes("shoulder"))                                      return "text-pink-400";
  if (f.includes("arm") || f.includes("bicep") || f.includes("tricep")) return "text-cyan-400";
  if (f.includes("core") || f.includes("abs"))                     return "text-red-400";
  return "text-green-400";
}

function getLoadingStep(elapsed: number): string {
  if (elapsed < 2000) return "Fetching exercises from database…";
  if (elapsed < 4000) return "AI is selecting exercises for your goal…";
  if (elapsed < 6000) return "Building your weekly schedule…";
  return "Almost done — finalising your plan…";
}

function DayCard({ day }: { day: DayPlan }) {
  const isRest = day.focus.toLowerCase().includes("rest");

  return (
    <div
      className={`rounded-2xl border p-5 transition-all ${
        isRest
          ? "border-white/5 bg-white/[0.02]"
          : "border-white/10 bg-white/5 hover:border-white/20"
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
          {day.day}
        </span>
        <span className={`text-xs font-semibold ${getFocusColor(day.focus)}`}>
          {day.focus}
        </span>
      </div>

      {isRest ? (
        <p className="text-sm text-gray-600">Recovery day — no training</p>
      ) : (
        <ul className="space-y-2">
          {day.exercises.map((ex, i) => {
            const colonIdx = ex.lastIndexOf(":");
            const name = colonIdx > 0 ? ex.slice(0, colonIdx).trim() : ex;
            const sets = colonIdx > 0 ? ex.slice(colonIdx + 1).trim() : null;
            return (
              <li key={i} className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-400/60" />
                  <span className="text-sm text-gray-300">{name}</span>
                </div>
                {sets && (
                  <span className="shrink-0 rounded-md bg-white/5 px-2 py-0.5 text-xs font-semibold text-green-400">
                    {sets}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function LoadingState({ elapsed }: { elapsed: number }) {
  const step = getLoadingStep(elapsed);
  const steps = [
    "Fetching exercises from database…",
    "AI is selecting exercises for your goal…",
    "Building your weekly schedule…",
    "Almost done — finalising your plan…",
  ];
  const currentIdx = steps.indexOf(step);

  return (
    <div>
      <div className="mb-6 rounded-2xl border border-green-400/20 bg-green-400/5 p-5">
        <div className="mb-3 flex items-center gap-3">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-green-400 border-t-transparent" />
          <span className="text-sm font-semibold text-green-400">{step}</span>
        </div>
        <div className="space-y-2">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`h-1.5 w-1.5 rounded-full transition-all ${
                i < currentIdx
                  ? "bg-green-400"
                  : i === currentIdx
                  ? "animate-pulse bg-green-400"
                  : "bg-white/10"
              }`} />
              <span className={`text-xs transition-all ${
                i < currentIdx
                  ? "text-green-400"
                  : i === currentIdx
                  ? "text-white"
                  : "text-gray-600"
              }`}>
                {s}
              </span>
            </div>
          ))}
        </div>
      </div>
      <WorkoutPlanSkeleton />
    </div>
  );
}

export default function WorkoutPage() {
  const [goal, setGoal]     = useState<Goal | "">("");
  const [level, setLevel]   = useState<Level | "">("");
  const [plan, setPlan]     = useState<DayPlan[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved]   = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const { showToast, ToastComponent } = useToast();

  function buildCoachQuery(): string {
    if (!plan || !goal || !level) return "/coach";

    const trainingDays = plan
      .filter((d) => !d.focus.toLowerCase().includes("rest"))
      .map((d) =>
        `${d.day} (${d.focus}): ${d.exercises
          .slice(0, 3)
          .map((e) => e.split(":")[0].trim())
          .join(", ")}`
      )
      .join(" | ");

    const params = new URLSearchParams({
      source:  "workout",
      goal:    goal,
      level:   level,
      summary: trainingDays,
    });

    return `/coach?${params.toString()}`;
  }

  async function generatePlan() {
    if (!goal || !level) return;
    setLoading(true);
    setSaved(false);
    setPlan(null);
    setElapsed(0);

    const startTime = Date.now();
    const ticker = setInterval(() => {
      setElapsed(Date.now() - startTime);
    }, 500);

    try {
      const res = await fetch("/api/workout", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ goal, level }),
      });

      clearInterval(ticker);

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to generate plan");
      }

      const data = await res.json();
      setPlan(data.plan);

      const { error: saveError } = await saveWorkout(
        goal as Goal,
        level as Level,
        data.plan
      );
      if (!saveError) setSaved(true);
    } catch (err) {
      clearInterval(ticker);
      const msg = err instanceof Error ? err.message : "Something went wrong";
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setGoal("");
    setLevel("");
    setPlan(null);
    setSaved(false);
    setElapsed(0);
  }

  const selectedGoal   = goals.find((g) => g.value === goal);
  const selectedLevel  = levels.find((l) => l.value === level);
  const trainingDays   = plan?.filter((d) => !d.focus.toLowerCase().includes("rest")).length ?? 0;
  const totalExercises = plan?.reduce(
    (acc, d) => acc + (d.focus.toLowerCase().includes("rest") ? 0 : d.exercises.length),
    0
  ) ?? 0;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      {ToastComponent}

      <div className="mx-auto max-w-4xl px-6 pt-28 pb-24">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-black tracking-tight md:text-5xl">
            Workout <span className="text-green-400">Generator</span>
          </h1>
          <p className="mt-2 text-gray-400">
            AI builds a personalised weekly plan using real exercises from our database.
          </p>
        </div>

        {/* ── Form ── */}
        {!plan && !loading && (
          <div className="space-y-10">
            <div>
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-gray-500">
                Step 1 — What's your goal?
              </h2>
              <div className="grid gap-3 sm:grid-cols-3">
                {goals.map((g) => (
                  <button
                    key={g.value}
                    onClick={() => setGoal(g.value as Goal)}
                    className={`flex flex-col items-start rounded-2xl border p-5 text-left transition-all ${
                      goal === g.value
                        ? "border-green-400 bg-green-400/10"
                        : "border-white/10 bg-white/5 hover:border-white/20"
                    }`}
                  >
                    <span className="mb-3 text-3xl">{g.icon}</span>
                    <span className="font-bold">{g.label}</span>
                    <span className="mt-1 text-xs text-gray-500">{g.desc}</span>
                    {goal === g.value && (
                      <span className="mt-3 text-xs text-green-400/80">{g.tip}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-gray-500">
                Step 2 — What's your level?
              </h2>
              <div className="grid gap-3 sm:grid-cols-3">
                {levels.map((l) => (
                  <button
                    key={l.value}
                    onClick={() => setLevel(l.value as Level)}
                    className={`flex flex-col items-start rounded-2xl border p-5 text-left transition-all ${
                      level === l.value
                        ? "border-green-400 bg-green-400/10"
                        : "border-white/10 bg-white/5 hover:border-white/20"
                    }`}
                  >
                    <span className="mb-1 font-bold">{l.label}</span>
                    <span className="text-xs text-gray-500">{l.desc}</span>
                    {level === l.value && (
                      <span className="mt-2 rounded-full border border-green-400/20 bg-green-400/5 px-2 py-0.5 text-xs text-green-400">
                        {l.days}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={generatePlan}
                disabled={!goal || !level}
                className="rounded-full bg-green-400 px-10 py-4 text-base font-bold text-gray-950 transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
              >
                Generate My Plan →
              </button>
              {goal && level && (
                <p className="text-sm text-gray-500">
                  {selectedGoal?.icon} {selectedGoal?.label} · {selectedLevel?.label} · {selectedLevel?.days}
                </p>
              )}
            </div>
          </div>
        )}

        {/* ── Loading ── */}
        {loading && <LoadingState elapsed={elapsed} />}

        {/* ── Plan output ── */}
        {plan && !loading && (
          <div>
            {/* Plan header */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-2xl">{selectedGoal?.icon}</span>
                  <h2 className="text-2xl font-black">
                    {selectedGoal?.label} —{" "}
                    <span className="capitalize text-green-400">{level}</span>
                  </h2>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full border border-green-400/20 bg-green-400/5 px-2.5 py-1 text-xs font-semibold text-green-400">
                    ✨ AI Generated
                  </span>
                  <span className="text-xs text-gray-500">{trainingDays} training days</span>
                  <span className="text-xs text-gray-600">·</span>
                  <span className="text-xs text-gray-500">{totalExercises} exercises total</span>
                  {saved && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-green-400/30 bg-green-400/10 px-2.5 py-1 text-xs font-semibold text-green-400">
                      ✓ Saved to My Workouts
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={generatePlan}
                  className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-gray-400 transition-colors hover:border-green-400/40 hover:text-green-400"
                >
                  ↺ Regenerate
                </button>
                <button
                  onClick={resetForm}
                  className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-gray-400 transition-colors hover:border-white/20 hover:text-white"
                >
                  ← New Plan
                </button>
              </div>
            </div>

            {/* Day cards */}
            <div className="grid gap-4 sm:grid-cols-2">
              {plan.map((day) => (
                <DayCard key={day.day} day={day} />
              ))}
            </div>

            {/* Coach tip */}
            <div className="mt-8 rounded-2xl border border-green-400/20 bg-green-400/5 p-5">
              <p className="text-sm font-semibold text-green-400">💡 Coach tip</p>
              <p className="mt-1 text-sm leading-relaxed text-gray-400">
                This plan was generated specifically for your goal and level.
                Follow it for at least 4 weeks before switching. Progressive
                overload — adding small weight or reps each week — is what
                drives results.{" "}
                <a
                  href={buildCoachQuery()}
                  className="font-semibold text-green-400 underline underline-offset-2"
                >
                  Ask the AI Coach about any exercise →
                </a>
              </p>
            </div>

            {/* Regenerate CTA */}
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="mb-3 text-sm font-semibold text-gray-300">
                Not happy with this plan?
              </p>
              <p className="mb-4 text-xs text-gray-500">
                Every generation is unique — the AI picks different exercises
                each time from our database of 149 exercises.
              </p>
              <button
                onClick={generatePlan}
                className="rounded-full border border-white/10 px-5 py-2 text-sm font-semibold text-gray-300 transition-colors hover:border-green-400/40 hover:text-green-400"
              >
                ↺ Generate a different plan
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}