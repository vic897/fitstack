"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { getMyWorkouts, deleteWorkout } from "@/lib/db/workouts";
import { WorkoutPlanSkeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";
import type { Workout } from "@/lib/supabase/types";

const goalLabel: Record<string, string> = {
  "muscle-gain": "💪 Muscle Gain",
  "fat-loss":    "🔥 Fat Loss",
  "endurance":   "🏃 Endurance",
};

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

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function MyWorkoutsPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading]   = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const { showToast, ToastComponent } = useToast();

  useEffect(() => {
    async function load() {
      const { data, error } = await getMyWorkouts();
      if (error) showToast(error, "error");
      setWorkouts(data);
      setLoading(false);
    }
    load();
  }, []);

  async function handleDelete(id: string) {
    setDeleting(id);
    const { error } = await deleteWorkout(id);
    if (error) {
      showToast("Failed to delete workout.", "error");
    } else {
      setWorkouts((prev) => prev.filter((w) => w.id !== id));
      if (expanded === id) setExpanded(null);
      showToast("Workout deleted.", "info");
    }
    setDeleting(null);
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      {ToastComponent}

      <div className="mx-auto max-w-4xl px-6 pt-28 pb-24">
        {/* Header */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tight md:text-5xl">
              My <span className="text-green-400">Workouts</span>
            </h1>
            <p className="mt-2 text-gray-400">
              Your saved workout plans.
            </p>
          </div>
          <Link
            href="/workout"
            className="rounded-full bg-green-400 px-5 py-2.5 text-sm font-bold text-gray-950 transition-opacity hover:opacity-90"
          >
            + New Plan
          </Link>
        </div>

        {/* Loading */}
        {loading && <WorkoutPlanSkeleton />}

        {/* Empty state */}
        {!loading && workouts.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 py-24 text-center">
            <div className="mb-4 text-5xl">📋</div>
            <h3 className="mb-2 font-bold">No workouts saved yet</h3>
            <p className="mb-6 text-sm text-gray-500">
              Generate a plan and it will appear here automatically.
            </p>
            <Link
              href="/workout"
              className="rounded-full bg-green-400 px-6 py-3 text-sm font-bold text-gray-950 hover:opacity-90"
            >
              Generate my first plan
            </Link>
          </div>
        )}

        {/* Workout list */}
        {!loading && workouts.length > 0 && (
          <div className="space-y-4">
            {workouts.map((workout) => (
              <div
                key={workout.id}
                className="rounded-2xl border border-white/10 bg-white/5"
              >
                {/* Workout row header */}
                <div className="flex items-center justify-between px-6 py-5">
                  <button
                    onClick={() =>
                      setExpanded(expanded === workout.id ? null : workout.id)
                    }
                    className="flex flex-1 items-center gap-4 text-left"
                  >
                    <div>
                      <div className="font-bold">
                        {goalLabel[workout.goal] ?? workout.goal}
                      </div>
                      <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-500">
                        <span className="capitalize">{workout.level}</span>
                        <span>·</span>
                        <span>{formatDate(workout.created_at)}</span>
                      </div>
                    </div>
                    <span className="ml-auto mr-4 text-xs text-gray-500">
                      {expanded === workout.id ? "▲ Hide" : "▼ View plan"}
                    </span>
                  </button>

                  {/* Delete button */}
                  <button
                    onClick={() => handleDelete(workout.id)}
                    disabled={deleting === workout.id}
                    className="rounded-full border border-white/10 px-3 py-1.5 text-xs font-semibold text-gray-500 transition-colors hover:border-red-400/30 hover:text-red-400 disabled:opacity-40"
                  >
                    {deleting === workout.id ? "..." : "Delete"}
                  </button>
                </div>

                {/* Expanded plan */}
                {expanded === workout.id && (
                  <div className="border-t border-white/10 px-6 pb-6 pt-5">
                    <div className="grid gap-3 sm:grid-cols-2">
                      {workout.plan.map((day) => {
                        const isRest = day.focus.toLowerCase().includes("rest");
                        return (
                          <div
                            key={day.day}
                            className={`rounded-xl border p-4 ${
                              isRest
                                ? "border-white/5 bg-white/[0.02]"
                                : "border-white/10 bg-white/5"
                            }`}
                          >
                            <div className="mb-2 flex items-center justify-between">
                              <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
                                {day.day}
                              </span>
                              <span className={`text-xs font-semibold ${focusColor[day.focus] ?? "text-green-400"}`}>
                                {day.focus}
                              </span>
                            </div>
                            <ul className="space-y-1">
                              {day.exercises.map((ex, i) => (
                                <li
                                  key={i}
                                  className="flex items-start gap-2 text-xs text-gray-400"
                                >
                                  <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-green-400/50" />
                                  {ex}
                                </li>
                              ))}
                            </ul>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}