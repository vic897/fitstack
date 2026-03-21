"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";

// ── Types ──────────────────────────────────────────────────────
type Meal = {
  name: string;
  items: string[];
};

type Plan = {
  label: string;
  tip: string;
  meals: Meal[];
};

type Goal = {
  value: string;
  label: string;
  icon: string;
  desc: string;
  borderActive: string;
  bgActive: string;
  textActive: string;
  tipBorder: string;
  tipBg: string;
};

// ── Config ─────────────────────────────────────────────────────
const goals: Goal[] = [
  {
    value: "muscle-gain",
    label: "Muscle Gain",
    icon: "💪",
    desc: "Eat more to grow more",
    borderActive: "border-green-400",
    bgActive: "bg-green-400/10",
    textActive: "text-green-400",
    tipBorder: "border-green-400/30",
    tipBg: "bg-green-400/8",
  },
  {
    value: "fat-loss",
    label: "Fat Loss",
    icon: "🔥",
    desc: "Eat smart, stay lean",
    borderActive: "border-orange-400",
    bgActive: "bg-orange-400/10",
    textActive: "text-orange-400",
    tipBorder: "border-orange-400/30",
    tipBg: "bg-orange-400/8",
  },
];

const mealIcons: Record<string, string> = {
  Breakfast: "🌅",
  Lunch: "☀️",
  Dinner: "🌙",
  Snack: "🍎",
};

const principles = [
  {
    icon: "🥩",
    title: "Prioritise protein",
    desc: "Aim for protein in every meal. It keeps you full and preserves muscle.",
  },
  {
    icon: "💧",
    title: "Stay hydrated",
    desc: "Drink at least 2–3 litres of water daily. More on training days.",
  },
  {
    icon: "🚫",
    title: "Limit processed food",
    desc: "Cut out ultra-processed snacks. Whole foods give better energy.",
  },
  {
    icon: "😴",
    title: "Sleep to recover",
    desc: "Nutrition works best with 7–9 hours of sleep. Don't skip recovery.",
  },
];

// ── Page ───────────────────────────────────────────────────────
export default function DietPage() {
  const [goal, setGoal] = useState<string | null>(null);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedGoal = goals.find((g) => g.value === goal);

  async function fetchPlan(selectedGoal: string) {
    setGoal(selectedGoal);
    setLoading(true);
    setError(null);
    setPlan(null);

    try {
      const res = await fetch("/api/diet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal: selectedGoal }),
      });

      if (!res.ok) throw new Error("Failed to fetch plan");

      const data = await res.json();
      setPlan(data.plan);
    } catch (err) {
      console.error(err);
      setError("Could not load the plan. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      <div className="mx-auto max-w-4xl px-6 pt-28 pb-24">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-black tracking-tight md:text-5xl">
            Diet <span className="text-green-400">Guide</span>
          </h1>
          <p className="mt-2 text-gray-400">
            Simple meal plans matched to your fitness goal. No calorie
            counting — just clarity.
          </p>
        </div>

        {/* Goal toggle */}
        <div className="mb-10 grid gap-4 sm:grid-cols-2">
          {goals.map((g) => {
            const isActive = goal === g.value;
            return (
              <button
                key={g.value}
                onClick={() => fetchPlan(g.value)}
                className={`flex items-center gap-4 rounded-2xl border p-6 text-left transition-all ${
                  isActive
                    ? `${g.borderActive} ${g.bgActive}`
                    : "border-white/10 bg-white/5 hover:border-white/20"
                }`}
              >
                <span className="text-4xl">{g.icon}</span>
                <div>
                  <div className="font-bold">{g.label}</div>
                  <div className="mt-0.5 text-sm text-gray-500">{g.desc}</div>
                </div>
                {isActive && (
                  <span className={`ml-auto text-xs font-bold ${g.textActive}`}>
                    Selected ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Loading spinner */}
        {loading && (
          <div className="mb-8 flex items-center gap-3 text-sm text-gray-400">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-green-400 border-t-transparent" />
            Loading your meal plan…
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="mb-8 rounded-2xl border border-red-400/20 bg-red-400/5 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Plan output */}
        {plan && selectedGoal && !loading && (
          <div>
            {/* Tip banner */}
            <div
              className={`mb-8 rounded-2xl border p-5 ${selectedGoal.tipBorder} ${selectedGoal.tipBg}`}
            >
              <p className={`text-sm font-bold ${selectedGoal.textActive}`}>
                {selectedGoal.icon} {plan.label} tip
              </p>
              <p className="mt-1 text-sm text-gray-300">{plan.tip}</p>
            </div>

            {/* Meal cards */}
            <div className="mb-6 grid gap-4 sm:grid-cols-2">
              {plan.meals.map((meal) => (
                <div
                  key={meal.name}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6"
                >
                  {/* Meal header */}
                  <div className="mb-4 flex items-center gap-3">
                    <span className="text-2xl">
                      {mealIcons[meal.name] ?? "🍽️"}
                    </span>
                    <h3 className="font-bold">{meal.name}</h3>
                  </div>

                  {/* Items */}
                  <ul className="space-y-2">
                    {meal.items.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-gray-300"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-400/60" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Disclaimer */}
            <p className="mb-10 text-xs text-gray-600">
              * These are sample meal ideas, not a personalised nutrition plan.
              Adjust portions to your body size and hunger levels. Consult a
              nutritionist for tailored advice.
            </p>
          </div>
        )}

        {/* Empty state — no goal selected yet */}
        {!goal && !loading && (
          <div className="mb-10 flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 py-16 text-center">
            <span className="mb-4 text-5xl">🥗</span>
            <h3 className="mb-1 font-bold">Choose your goal above</h3>
            <p className="text-sm text-gray-500">
              Your meal plan will appear here.
            </p>
          </div>
        )}

        {/* Principles — always visible */}
        <div>
          <h2 className="mb-6 text-xl font-black">
            Core nutrition{" "}
            <span className="text-green-400">principles</span>
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {principles.map((p) => (
              <div
                key={p.title}
                className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                <span className="mt-0.5 text-2xl">{p.icon}</span>
                <div>
                  <h4 className="mb-1 text-sm font-bold">{p.title}</h4>
                  <p className="text-xs leading-relaxed text-gray-500">
                    {p.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Coach CTA */}
        <div className="mt-12 rounded-2xl border border-green-400/20 bg-green-400/5 p-6 text-center">
          <p className="font-bold">Have diet questions?</p>
          <p className="mt-1 text-sm text-gray-400">
            Your AI coach can answer anything about nutrition, meal timing,
            supplements, and more.
          </p>
           <a
            href="/coach"
            className="mt-5 inline-block rounded-full bg-green-400 px-8 py-3 text-sm font-bold text-gray-950 transition-opacity hover:opacity-90"
          >
            Ask the AI Coach →
          </a>
        </div>
      </div>
    </div>
  );
}