"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { WorkoutPlanSkeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";

const goals = [
  { value: "muscle-gain", label: "Muscle Gain", icon: "💪", desc: "Build size and strength" },
  { value: "fat-loss",    label: "Fat Loss",    icon: "🔥", desc: "Burn fat, stay lean" },
  { value: "endurance",   label: "Endurance",   icon: "🏃", desc: "Stamina and cardio fitness" },
];

const levels = [
  { value: "beginner",     label: "Beginner",     desc: "0–6 months experience" },
  { value: "intermediate", label: "Intermediate", desc: "6 months – 2 years" },
  { value: "advanced",     label: "Advanced",     desc: "2+ years training" },
];

type DayPlan = { day: string; focus: string; exercises: string[] };

const focusColor: Record<string, string> = {
  "Rest":            "text-gray-500",
  "Rest / Walk":     "text-gray-500",
  "Optional Cardio": "text-blue-400",
  "Cardio":          "text-blue-400",
  "HIIT Cardio":     "text-blue-400",
  "Easy Run":        "text-blue-400",
  "Long Run":        "text-blue-400",
  "Cross-train":     "text-blue-400",
};

export default function WorkoutPage() {
  const [goal, setGoal]     = useState("");
  const [level, setLevel]   = useState("");
  const [plan, setPlan]     = useState<DayPlan[] | null>(null);
  const [loading, setLoading] = useState(false);
  const { showToast, ToastComponent } = useToast();

  async function generatePlan() {
    if (!goal || !level) return;
    setLoading(true);
    setPlan(null);

    try {
      const res = await fetch("/api/workout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal, level }),
      });
      if (!res.ok) throw new Error("Failed to fetch plan");
      const data = await res.json();
      setPlan(data.plan);
    } catch {
      showToast("Could not generate your plan. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setGoal("");
    setLevel("");
    setPlan(null);
  }

  const selectedGoal = goals.find((g) => g.value === goal);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      {ToastComponent}

      <div className="mx-auto max-w-4xl px-6 pt-28 pb-24">
        <div className="mb-10">
          <h1 className="text-4xl font-black tracking-tight md:text-5xl">
            Workout <span className="text-green-400">Generator</span>
          </h1>
          <p className="mt-2 text-gray-400">
            Tell us your goal and experience level. Get a full weekly plan instantly.
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
                    onClick={() => setGoal(g.value)}
                    className={`flex flex-col items-start rounded-2xl border p-5 text-left transition-all ${
                      goal === g.value
                        ? "border-green-400 bg-green-400/10"
                        : "border-white/10 bg-white/5 hover:border-white/20"
                    }`}
                  >
                    <span className="mb-3 text-3xl">{g.icon}</span>
                    <span className="font-bold">{g.label}</span>
                    <span className="mt-1 text-xs text-gray-500">{g.desc}</span>
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
                    onClick={() => setLevel(l.value)}
                    className={`flex flex-col items-start rounded-2xl border p-5 text-left transition-all ${
                      level === l.value
                        ? "border-green-400 bg-green-400/10"
                        : "border-white/10 bg-white/5 hover:border-white/20"
                    }`}
                  >
                    <span className="mb-1 font-bold">{l.label}</span>
                    <span className="text-xs text-gray-500">{l.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={generatePlan}
              disabled={!goal || !level}
              className="w-full rounded-full bg-green-400 py-4 text-base font-bold text-gray-950 transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30 sm:w-auto sm:px-12"
            >
              Generate My Plan →
            </button>
          </div>
        )}

        {/* ── Skeleton while loading ── */}
        {loading && (
          <div>
            <div className="mb-8 flex items-center gap-3 text-sm text-gray-400">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-green-400 border-t-transparent" />
              Building your weekly plan…
            </div>
            <WorkoutPlanSkeleton />
          </div>
        )}

        {/* ── Plan output ── */}
        {plan && !loading && (
          <div>
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-2xl">{selectedGoal?.icon}</span>
                  <h2 className="text-2xl font-black">
                    {selectedGoal?.label} —{" "}
                    <span className="capitalize text-green-400">{level}</span>
                  </h2>
                </div>
                <p className="text-sm text-gray-500">7-day weekly training plan</p>
              </div>
              <button
                onClick={resetForm}
                className="self-start rounded-full border border-white/10 px-5 py-2 text-sm font-semibold text-gray-400 transition-colors hover:border-green-400/40 hover:text-green-400 sm:self-auto"
              >
                ← New Plan
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {plan.map((day) => {
                const isRest = day.focus.toLowerCase().includes("rest");
                return (
                  <div
                    key={day.day}
                    className={`rounded-2xl border p-5 ${
                      isRest
                        ? "border-white/5 bg-white/[0.02]"
                        : "border-white/10 bg-white/5"
                    }`}
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
                        {day.day}
                      </span>
                      <span className={`text-xs font-semibold ${focusColor[day.focus] ?? "text-green-400"}`}>
                        {day.focus}
                      </span>
                    </div>
                    <ul className="space-y-1.5">
                      {day.exercises.map((ex, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-green-400/60" />
                          {ex}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 rounded-2xl border border-green-400/20 bg-green-400/5 p-5">
              <p className="text-sm font-semibold text-green-400">💡 Coach tip</p>
              <p className="mt-1 text-sm text-gray-400">
                Stick to this plan for at least 4 weeks before changing it. Progressive
                overload — adding small weight or reps each week — is the key to results.{" "}
                <a href="/coach" className="font-semibold text-green-400 underline underline-offset-2">
                  Ask the AI Coach →
                </a>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}