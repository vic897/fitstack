"use client";

import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useToast } from "@/components/ui/Toast";
import { saveWorkout } from "@/lib/db/workouts";
import type { DayPlan, Goal, Level } from "@/lib/supabase/types";
import ConfigurationView from "@/components/workout/ConfigurationView";
import SynthesisLoadingView from "@/components/workout/SynthesisLoadingView";
import WorkoutPlanView from "@/components/workout/WorkoutPlanView";
import {
  getGoalOption,
  getLevelOption,
} from "@/components/workout/workoutConfig";
import "./workout.css";

export default function WorkoutPage() {
  const [goal, setGoal] = useState<Goal | "">("");
  const [level, setLevel] = useState<Level | "">("");
  const [plan, setPlan] = useState<DayPlan[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const tickerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { showToast, ToastComponent } = useToast();

  useEffect(() => {
    return () => {
      if (tickerRef.current) clearInterval(tickerRef.current);
    };
  }, []);

  function buildCoachQuery(): string {
    if (!plan || !goal || !level) return "/coach";

    const trainingDays = plan
      .filter((d) => !d.focus.toLowerCase().includes("rest"))
      .map(
        (d) =>
          `${d.day} (${d.focus}): ${d.exercises
            .slice(0, 3)
            .map((e) => e.split(":")[0].trim())
            .join(", ")}`
      )
      .join(" | ");

    const params = new URLSearchParams({
      source: "workout",
      goal,
      level,
      summary: trainingDays,
    });

    return `/coach?${params.toString()}`;
  }

  async function generatePlan() {
    if (!goal || !level) return;
    if (tickerRef.current) clearInterval(tickerRef.current);

    setLoading(true);
    setSaved(false);
    setPlan(null);
    setElapsed(0);

    const startTime = Date.now();
    tickerRef.current = setInterval(() => {
      setElapsed(Date.now() - startTime);
    }, 250);

    try {
      const res = await fetch("/api/workout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal, level }),
      });

      if (tickerRef.current) {
        clearInterval(tickerRef.current);
        tickerRef.current = null;
      }

      const data = await res.json().catch(() => null);
      if (!res.ok || !Array.isArray(data?.plan)) {
        throw new Error(
          data?.error ?? `Failed to generate plan (${res.status})`
        );
      }

      setPlan(data.plan);

      try {
        const { error: saveError } = await saveWorkout(
          goal as Goal,
          level as Level,
          data.plan
        );
        if (!saveError) setSaved(true);
      } catch {
        // Keep generated plan visible when Supabase browser env is unconfigured
      }
    } catch (err) {
      if (tickerRef.current) {
        clearInterval(tickerRef.current);
        tickerRef.current = null;
      }
      const msg = err instanceof Error ? err.message : "Something went wrong";
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    if (tickerRef.current) {
      clearInterval(tickerRef.current);
      tickerRef.current = null;
    }
    setGoal("");
    setLevel("");
    setPlan(null);
    setSaved(false);
    setElapsed(0);
  }

  const selectedGoal = getGoalOption(goal);
  const selectedLevel = getLevelOption(level);

  const badgeText = loading
    ? "Synthesizing Workout Data"
    : plan
    ? "Workout Engine Ready"
    : "AI Workout Generation Engine";

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-clip bg-background text-on-surface">
      <Navbar />
      {ToastComponent}

      {/* Atmospheric Bioluminescent Background Accents */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        <div className="absolute -top-32 left-1/2 h-[360px] w-[760px] -translate-x-1/2 rounded-full bg-primary/10 blur-[130px]" />
        <div className="absolute right-[-10%] top-[440px] h-[440px] w-[520px] rounded-full bg-primary-container/8 blur-[150px]" />
        <div className="absolute bottom-12 left-[-10%] h-[360px] w-[420px] rounded-full bg-tertiary-container/8 blur-[120px]" />
      </div>

      <main className="relative z-10 w-full flex-1 pt-16">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-space-xl px-margin-mobile py-8 sm:px-margin sm:py-12">
          {/* Dynamic State Hero Header */}
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-space-sm pt-space-xs text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-outline-variant/25 bg-surface-container-high/75 px-3.5 py-1 shadow-sm backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              <span className="font-label-sm text-label-sm font-bold uppercase tracking-wider text-primary">
                {badgeText}
              </span>
            </div>

            {loading ? (
              <>
                <h1 className="mt-space-xs font-headline-lg text-headline-lg-mobile tracking-tight text-on-surface sm:text-headline-lg">
                  Building Your{" "}
                  <span className="bg-gradient-to-r from-primary via-primary-fixed to-secondary bg-clip-text text-transparent">
                    Weekly Plan
                  </span>
                </h1>
                <p className="max-w-lg font-body-lg text-body-lg text-on-surface-variant">
                  AI is assembling a personalised weekly schedule tailored to your
                  goal and experience level.
                </p>
              </>
            ) : plan ? (
              <>
                <h1 className="mt-space-xs font-headline-xl text-headline-xl-mobile tracking-tight text-on-surface sm:text-headline-xl">
                  Workout{" "}
                  <span className="bg-gradient-to-r from-primary to-secondary-fixed bg-clip-text text-transparent">
                    Generator
                  </span>
                </h1>
                <p className="max-w-xl font-body-lg text-body-lg text-on-surface-variant">
                  AI builds a personalised weekly plan using real exercises from
                  our database.
                </p>
              </>
            ) : (
              <>
                <h1 className="mt-space-xs font-headline-xl text-headline-xl-mobile tracking-tight text-on-surface sm:text-headline-xl">
                  Build Your Perfect{" "}
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Workout
                  </span>
                </h1>
                <p className="font-body-lg text-body-lg font-medium text-on-surface-variant">
                  Your goals. Your level. A training plan built around you.
                </p>
                <div className="mt-space-xs inline-flex items-center gap-space-xs rounded-full border border-outline-variant/25 bg-surface-container-lowest/65 px-4 py-1.5 font-label-md text-label-md text-outline shadow-inner backdrop-blur-md">
                  <span className="material-symbols-outlined text-[18px] text-primary">
                    verified
                  </span>
                  <span>
                    AI builds a weekly split from{" "}
                    <strong className="font-semibold text-on-surface">
                      149 curated exercises
                    </strong>
                  </span>
                </div>
              </>
            )}
          </div>

          {/* State 1: Configuration */}
          {!plan && !loading && (
            <ConfigurationView
              goal={goal}
              level={level}
              onSelectGoal={setGoal}
              onSelectLevel={setLevel}
              onGenerate={generatePlan}
            />
          )}

          {/* State 2: AI Synthesis */}
          {loading && (
            <SynthesisLoadingView
              elapsed={elapsed}
              goalLabel={selectedGoal?.label}
              levelLabel={selectedLevel?.label}
              levelDays={selectedLevel?.days}
            />
          )}

          {/* State 3: Generated Workout Plan */}
          {plan && !loading && (
            <WorkoutPlanView
              plan={plan}
              goal={goal}
              level={level}
              saved={saved}
              coachQuery={buildCoachQuery()}
              onRegenerate={generatePlan}
              onReset={resetForm}
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
