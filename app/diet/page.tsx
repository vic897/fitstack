"use client";

import Link from "next/link";
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import DietGoalSelector from "@/components/diet/DietGoalSelector";
import MealPlanSection, {
  type DietPlan,
} from "@/components/diet/MealPlanSection";
import { NUTRITION_PRINCIPLES } from "@/components/diet/dietConfig";

export default function DietPage() {
  const [goal, setGoal] = useState<string | null>(null);
  const [plan, setPlan] = useState<DietPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.plan) {
        throw new Error(data?.error ?? "Failed to fetch plan");
      }

      setPlan(data.plan);
    } catch (err) {
      console.error(err);
      setError("Could not load the plan. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-clip bg-surface text-on-surface">
      <Navbar />

      {/* Atmospheric Background Lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        <div className="absolute -top-40 left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-b from-primary/10 via-primary-container/5 to-transparent blur-3xl" />
        <div className="absolute -right-60 top-1/3 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <main className="relative z-10 w-full flex-1 pt-16">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-space-xl px-margin-mobile py-space-xl sm:px-margin">
          {/* Hero Header Section */}
          <section className="flex flex-col items-center space-y-space-md pt-space-xs text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-outline-variant/25 bg-surface-container-high/80 px-3.5 py-1.5 shadow-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-80" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              <span className="font-label-sm text-label-sm font-bold uppercase tracking-widest text-primary">
                Nutrition Guidance — FitStack 2.0
              </span>
            </div>

            <div className="max-w-3xl space-y-3">
              <h1 className="font-headline-xl text-headline-xl-mobile tracking-tight text-on-surface sm:text-headline-xl">
                Fuel Your{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Progress.
                </span>
              </h1>
              <p className="mx-auto max-w-2xl font-body-lg text-body-lg leading-relaxed text-on-surface-variant">
                Simple meal plans matched to your fitness goal. No calorie
                counting — just clarity.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              <div className="flex items-center gap-1.5 rounded-full border border-outline-variant/20 bg-surface-container-low px-3 py-1 font-label-md text-label-md text-on-surface-variant">
                <span className="material-symbols-outlined text-[15px] text-primary">
                  verified
                </span>
                <span>Goal-Matched Meal Templates</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full border border-outline-variant/20 bg-surface-container-low px-3 py-1 font-label-md text-label-md text-on-surface-variant">
                <span className="material-symbols-outlined text-[15px] text-primary">
                  restaurant
                </span>
                <span>Whole-Food Focused</span>
              </div>
            </div>
          </section>

          {/* Goal Selection & Active Strategy Tip */}
          <DietGoalSelector
            activeGoal={goal}
            loading={loading}
            tip={plan?.tip}
            planLabel={plan?.label}
            onSelectGoal={fetchPlan}
          />

          {/* Meal Plan Output / Loading / Error / Initial Empty State */}
          <MealPlanSection
            goal={goal}
            plan={plan}
            loading={loading}
            error={error}
            onRetry={() => {
              if (goal) void fetchPlan(goal);
            }}
          />

          {/* Core Nutrition Principles — Always Visible */}
          <section className="flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary" />
                <h2 className="font-headline-md text-headline-md font-bold tracking-tight text-on-surface">
                  Core Nutrition Principles
                </h2>
              </div>
              <span className="hidden font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant sm:inline">
                Daily Fundamentals
              </span>
            </div>

            <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2 lg:grid-cols-4">
              {NUTRITION_PRINCIPLES.map((p) => (
                <div
                  key={p.title}
                  className="flex flex-col gap-2 rounded-xl border border-outline-variant/20 bg-surface-container-low p-space-md shadow-md transition-all duration-300 hover:border-outline-variant/40 hover:bg-surface-container"
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container-high shadow-sm ${p.iconColorClass}`}
                  >
                    <span className="material-symbols-outlined text-[24px]">
                      {p.icon}
                    </span>
                  </div>
                  <h3 className="font-title-lg text-title-lg font-semibold text-on-surface">
                    {p.title}
                  </h3>
                  <p className="font-body-md text-body-md leading-relaxed text-on-surface-variant">
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* AI Coach CTA Banner */}
          <section className="relative overflow-hidden rounded-2xl border border-outline-variant/25 bg-surface-container-high p-space-lg shadow-2xl md:p-space-xl">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-primary/10 blur-3xl"
            />

            <div className="relative z-10 flex flex-col justify-between gap-space-lg lg:flex-row lg:items-center">
              <div className="max-w-2xl space-y-3">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-outline-variant/25 bg-surface-container-lowest px-3 py-1 font-label-sm text-label-sm font-bold uppercase tracking-wider text-primary shadow-sm">
                  <span className="material-symbols-outlined text-[15px]">
                    auto_awesome
                  </span>
                  <span>AI Gym &amp; Nutrition Coach</span>
                </div>
                <h2 className="font-headline-md text-headline-md font-bold tracking-tight text-on-surface">
                  Have diet questions?
                </h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant">
                  Your AI coach can answer anything about nutrition, meal
                  timing, supplements, and more.
                </p>
              </div>

              <div className="shrink-0">
                <Link
                  href="/coach"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-space-lg py-3.5 font-title-lg text-title-lg font-bold text-on-primary shadow-[0_0_24px_rgba(78,222,163,0.35)] transition-all duration-300 hover:scale-105 hover:bg-primary-fixed active:scale-95"
                >
                  <span>Ask the AI Coach</span>
                  <span className="material-symbols-outlined text-[20px]">
                    arrow_forward
                  </span>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
