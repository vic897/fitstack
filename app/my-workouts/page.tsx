"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import {
  CalendarIcon,
  DumbbellIcon,
  ErrorAlertIcon,
  ListChecksIcon,
  PlusIcon,
  RefreshIcon,
  SearchIcon,
  SortIcon,
} from "@/components/my-workouts/MyWorkoutsIcons";
import { SavedWorkoutCard } from "@/components/my-workouts/SavedWorkoutCard";
import {
  countPlanMetrics,
  filterAndSortWorkouts,
  formatWorkoutDate,
  type WorkoutGoalFilter,
  type WorkoutSortOrder,
} from "@/components/my-workouts/workoutLibraryUtils";
import { useToast } from "@/components/ui/Toast";
import { deleteWorkout, getMyWorkouts } from "@/lib/db/workouts";
import type { Workout } from "@/lib/supabase/types";

const GOAL_FILTERS: { value: WorkoutGoalFilter; label: string }[] = [
  { value: "all", label: "All Plans" },
  { value: "muscle-gain", label: "Muscle Gain" },
  { value: "fat-loss", label: "Fat Loss" },
  { value: "endurance", label: "Endurance" },
];

export default function MyWorkoutsPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [goalFilter, setGoalFilter] = useState<WorkoutGoalFilter>("all");
  const [sortOrder, setSortOrder] = useState<WorkoutSortOrder>("newest");

  const { showToast, ToastComponent } = useToast();

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const { data, error } = await getMyWorkouts();
        if (!active) return;

        if (error) {
          setLoadError(error);
          showToast(error, "error");
        } else {
          setLoadError(null);
          setWorkouts(data);
        }
      } catch (err) {
        if (!active) return;
        const message =
          err instanceof Error
            ? err.message
            : "Unable to load saved workouts.";
        setLoadError(message);
        showToast(message, "error");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [showToast]);

  async function handleRetry() {
    setLoading(true);
    setLoadError(null);

    try {
      const { data, error } = await getMyWorkouts();
      if (error) {
        setLoadError(error);
        showToast(error, "error");
      } else {
        setWorkouts(data);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to load saved workouts.";
      setLoadError(message);
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    setDeleting(id);
    try {
      const { error } = await deleteWorkout(id);
      if (error) {
        showToast("Failed to delete workout.", "error");
      } else {
        setWorkouts((prev) => prev.filter((w) => w.id !== id));
        if (expanded === id) setExpanded(null);
        showToast("Workout deleted.", "info");
      }
    } catch {
      showToast("Failed to delete workout.", "error");
    } finally {
      setDeleting(null);
    }
  }

  const visibleWorkouts = filterAndSortWorkouts(
    workouts,
    searchQuery,
    goalFilter,
    sortOrder
  );

  // Aggregate real stats solely from saved records
  const totalTrainingDays = workouts.reduce(
    (sum, w) => sum + countPlanMetrics(w.plan).trainingDays,
    0
  );
  const totalExercises = workouts.reduce(
    (sum, w) => sum + countPlanMetrics(w.plan).exerciseCount,
    0
  );
  const latestSavedDate =
    workouts.length > 0
      ? formatWorkoutDate(
          [...workouts].sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          )[0].created_at
        )
      : null;

  const hasActiveFilters = searchQuery.trim().length > 0 || goalFilter !== "all";

  return (
    <div className="relative min-h-screen flex flex-col overflow-x-clip bg-[#111418] text-[#e1e2e8] selection:bg-[#4edea3]/30 selection:text-[#6ffbbe]">
      <Navbar />
      {ToastComponent}

      {/* Ambient Background Lighting */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[420px] w-[780px] rounded-full bg-[#10b981]/[0.07] blur-[140px]" />
        <div className="absolute bottom-0 right-0 h-[360px] w-[420px] rounded-full bg-[#4edea3]/[0.04] blur-[140px]" />
      </div>

      <main className="relative z-10 flex-1 w-full max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-20">
        {/* Hero Header */}
        <header className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#4edea3]/10 border border-[#4edea3]/25 px-3 py-1 mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-[#4edea3] animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#4edea3]">
                Personal Training Library
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#e1e2e8]">
                My{" "}
                <span className="bg-gradient-to-r from-[#4edea3] to-[#6ffbbe] bg-clip-text text-transparent">
                  Workouts
                </span>
              </h1>
              {!loading && !loadError && (
                <span className="rounded-full bg-white/[0.06] border border-white/[0.1] px-3 py-1 text-xs font-semibold text-[#bbcabf]">
                  {workouts.length}{" "}
                  {workouts.length === 1 ? "saved plan" : "saved plans"}
                </span>
              )}
            </div>

            <p className="mt-2.5 max-w-2xl text-sm sm:text-base text-[#bbcabf]/85">
              Inspect your generated weekly splits, review day-by-day exercise programming, and manage your saved plans.
            </p>
          </div>

          <Link
            href="/workout"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#4edea3] hover:bg-[#6ffbbe] px-5 py-3 text-sm font-bold text-[#003824] shadow-[0_0_24px_rgba(78,222,163,0.24)] transition-all shrink-0 self-start sm:self-auto"
          >
            <PlusIcon className="h-4 w-4" />
            <span>New Plan</span>
          </Link>
        </header>

        {/* Loading State */}
        {loading && (
          <div className="space-y-6 animate-pulse">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-28 rounded-2xl bg-[#191c20]/75 border border-white/[0.07] p-5"
                />
              ))}
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-32 rounded-2xl bg-[#191c20]/75 border border-white/[0.07]"
                />
              ))}
            </div>
          </div>
        )}

        {/* Error State */}
        {!loading && loadError && (
          <section className="rounded-2xl bg-[#93000a]/20 border border-[#ffb4ab]/25 p-8 sm:p-10 text-center backdrop-blur-xl">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#93000a]/35 text-[#ffb4ab]">
              <ErrorAlertIcon />
            </div>
            <h2 className="font-display text-lg font-bold text-[#ffdad6]">
              Could not load saved workouts
            </h2>
            <p className="mt-1.5 text-sm text-[#ffb4ab]/85 max-w-md mx-auto break-words [overflow-wrap:anywhere]">
              {loadError}
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleRetry}
                className="inline-flex items-center gap-2 rounded-xl bg-white/[0.09] hover:bg-white/[0.15] border border-white/[0.1] px-4 py-2.5 text-xs font-semibold text-[#e1e2e8] transition-colors cursor-pointer"
              >
                <RefreshIcon />
                <span>Try again</span>
              </button>
              <Link
                href="/workout"
                className="inline-flex items-center gap-2 rounded-xl bg-[#4edea3] hover:bg-[#6ffbbe] px-4 py-2.5 text-xs font-bold text-[#003824] transition-all"
              >
                <span>Open Workout Generator</span>
              </Link>
            </div>
          </section>
        )}

        {/* Empty Library State */}
        {!loading && !loadError && workouts.length === 0 && (
          <section className="relative overflow-hidden rounded-2xl bg-[#191c20]/75 backdrop-blur-xl border border-dashed border-white/[0.12] px-6 py-20 text-center shadow-[0_16px_48px_rgba(0,0,0,0.35)]">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#4edea3]/10 border border-[#4edea3]/25 text-[#4edea3]">
              <DumbbellIcon className="h-6 w-6" />
            </div>
            <h2 className="font-display text-xl font-bold text-[#e1e2e8]">
              No workouts saved yet
            </h2>
            <p className="mt-2 mx-auto max-w-md text-sm text-[#86948a]">
              Generate a personalized 7-day plan in the Workout Generator and it will automatically appear here.
            </p>
            <Link
              href="/workout"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#4edea3] hover:bg-[#6ffbbe] px-6 py-3 text-sm font-bold text-[#003824] shadow-[0_0_24px_rgba(78,222,163,0.22)] transition-all"
            >
              <PlusIcon className="h-4 w-4" />
              <span>Generate my first plan</span>
            </Link>
          </section>
        )}

        {/* Populated Workout Library */}
        {!loading && !loadError && workouts.length > 0 && (
          <div className="space-y-6">
            {/* Real Computed Metrics Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-2xl bg-[#191c20]/75 backdrop-blur-xl border border-white/[0.08] p-5">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#86948a]">
                    Saved Plans
                  </span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#4edea3]/10 text-[#4edea3]">
                    <DumbbellIcon />
                  </span>
                </div>
                <p className="font-display text-3xl font-extrabold text-[#e1e2e8]">
                  {workouts.length}
                </p>
                <p className="mt-1.5 text-xs text-[#bbcabf]/80 truncate">
                  {latestSavedDate
                    ? `Latest saved · ${latestSavedDate}`
                    : "Synced to your account"}
                </p>
              </div>

              <div className="rounded-2xl bg-[#191c20]/75 backdrop-blur-xl border border-white/[0.08] p-5">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#86948a]">
                    Active Training Days
                  </span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.05] text-[#bbcabf]">
                    <CalendarIcon />
                  </span>
                </div>
                <p className="font-display text-3xl font-extrabold text-[#e1e2e8]">
                  {totalTrainingDays}
                </p>
                <p className="mt-1.5 text-xs text-[#bbcabf]/80">
                  Across {workouts.length}{" "}
                  {workouts.length === 1 ? "saved split" : "saved splits"}
                </p>
              </div>

              <div className="rounded-2xl bg-[#191c20]/75 backdrop-blur-xl border border-white/[0.08] p-5">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#86948a]">
                    Saved Exercises
                  </span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.05] text-[#bbcabf]">
                    <ListChecksIcon />
                  </span>
                </div>
                <p className="font-display text-3xl font-extrabold text-[#4edea3]">
                  {totalExercises}
                </p>
                <p className="mt-1.5 text-xs text-[#bbcabf]/80">
                  Total programmed movements
                </p>
              </div>
            </div>

            {/* Search, Goal Filter & Sort Command Bar */}
            <section className="rounded-2xl bg-[#191c20]/75 backdrop-blur-xl border border-white/[0.08] p-4 sm:p-5 space-y-4">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                  <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#86948a]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by goal, level, day focus, or exercise..."
                    aria-label="Search saved workouts"
                    className="w-full h-10 rounded-xl bg-[#0b0e12]/85 border border-white/[0.08] pl-10 pr-4 text-sm text-[#e1e2e8] placeholder-[#86948a]/75 focus:outline-none focus:border-[#4edea3]/70 focus:ring-2 focus:ring-[#4edea3]/15 transition-all"
                  />
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setSortOrder((prev) =>
                      prev === "newest" ? "oldest" : "newest"
                    )
                  }
                  className="inline-flex shrink-0 whitespace-nowrap items-center justify-center gap-1.5 h-10 rounded-xl bg-[#0b0e12]/85 hover:bg-white/[0.07] border border-white/[0.08] px-3.5 text-xs font-semibold text-[#bbcabf] transition-colors cursor-pointer"
                >
                  <SortIcon />
                  <span>
                    {sortOrder === "newest" ? "Newest first" : "Oldest first"}
                  </span>
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div
                  className="flex flex-wrap items-center gap-1.5"
                  role="group"
                  aria-label="Filter workouts by goal"
                >
                  {GOAL_FILTERS.map((opt) => {
                    const active = goalFilter === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setGoalFilter(opt.value)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                          active
                            ? "bg-[#4edea3] text-[#003824] shadow-[0_0_14px_rgba(78,222,163,0.25)]"
                            : "bg-[#0b0e12]/70 border border-white/[0.06] text-[#bbcabf] hover:text-[#e1e2e8]"
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>

                {hasActiveFilters && (
                  <div className="flex items-center gap-3 text-xs text-[#86948a]">
                    <span>
                      Showing {visibleWorkouts.length} of {workouts.length}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        setGoalFilter("all");
                      }}
                      className="font-semibold text-[#4edea3] hover:underline cursor-pointer"
                    >
                      Reset filters
                    </button>
                  </div>
                )}
              </div>
            </section>

            {/* Filtered Empty State */}
            {visibleWorkouts.length === 0 ? (
              <div className="rounded-2xl bg-[#191c20]/65 border border-dashed border-white/[0.1] p-12 text-center">
                <p className="font-display text-base font-bold text-[#e1e2e8]">
                  No matching saved workouts
                </p>
                <p className="mt-1.5 text-xs sm:text-sm text-[#86948a]">
                  Try adjusting your search keywords or goal filter.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setGoalFilter("all");
                  }}
                  className="mt-4 rounded-lg bg-white/[0.08] hover:bg-white/[0.14] px-4 py-2 text-xs font-semibold text-[#e1e2e8] transition-colors cursor-pointer"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {visibleWorkouts.map((workout) => (
                  <SavedWorkoutCard
                    key={workout.id}
                    workout={workout}
                    isExpanded={expanded === workout.id}
                    isDeleting={deleting === workout.id}
                    onToggleExpand={() =>
                      setExpanded(expanded === workout.id ? null : workout.id)
                    }
                    onDelete={() => handleDelete(workout.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
