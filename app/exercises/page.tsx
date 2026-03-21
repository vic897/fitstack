"use client";

import { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/layout/Navbar";
import { getExercises, type Exercise } from "@/lib/db/exercises";
import { ExerciseCardSkeleton } from "@/components/ui/Skeleton";

const ALL = "All";

const muscles    = [ALL, "Chest", "Back", "Legs", "Shoulders", "Arms", "Core", "Cardio"];
const difficulties = [ALL, "Beginner", "Intermediate", "Advanced"];

const difficultyColor: Record<string, string> = {
  beginner:     "bg-green-400/10 text-green-400 border-green-400/20",
  intermediate: "bg-yellow-400/10 text-yellow-400 border-yellow-400/20",
  advanced:     "bg-red-400/10 text-red-400 border-red-400/20",
};

const muscleIcon: Record<string, string> = {
  Legs:      "🦵",
  Back:      "🔙",
  Chest:     "💪",
  Shoulders: "🏔️",
  Arms:      "💪",
  Core:      "🎯",
  Cardio:    "🏃",
};

function ExerciseCard({ exercise }: { exercise: Exercise }) {
  return (
    <div className="group flex flex-col rounded-2xl border border-white/10 bg-white/5 p-6 transition-all hover:border-green-400/30 hover:bg-white/8">
      <div className="mb-4 flex items-start justify-between gap-2">
        <span className="text-2xl">
          {muscleIcon[exercise.muscle_group] ?? "🏋️"}
        </span>
        <span className={`rounded-full border px-3 py-0.5 text-xs font-semibold ${difficultyColor[exercise.difficulty]}`}>
          {exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1)}
        </span>
      </div>

      <h3 className="mb-2 text-base font-bold leading-snug">{exercise.name}</h3>

      <div className="mt-auto flex flex-wrap gap-2">
        <span className="rounded-full bg-white/8 px-2.5 py-0.5 text-xs text-gray-400">
          {exercise.muscle_group}
        </span>
        <span className="rounded-full bg-white/8 px-2.5 py-0.5 text-xs text-gray-400">
          {exercise.equipment}
        </span>
      </div>
    </div>
  );
}

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [muscle, setMuscle]       = useState(ALL);
  const [difficulty, setDifficulty] = useState(ALL);
  const [search, setSearch]       = useState("");
  const [searchInput, setSearchInput] = useState("");

  // ── Fetch from Supabase whenever filters change ─────────────
  const fetchExercises = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await getExercises({
      muscle_group: muscle,
      difficulty:   difficulty.toLowerCase(),
      search,
    });

    if (error) setError(error);
    setExercises(data);
    setLoading(false);
  }, [muscle, difficulty, search]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchExercises();
  }, [fetchExercises]);

  // ── Debounce search input ────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  function clearFilters() {
    setMuscle(ALL);
    setDifficulty(ALL);
    setSearch("");
    setSearchInput("");
  }

  const hasActiveFilters = muscle !== ALL || difficulty !== ALL || search !== "";

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      <div className="mx-auto max-w-6xl px-6 pt-28 pb-24">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-black tracking-tight md:text-5xl">
            Exercise <span className="text-green-400">Library</span>
          </h1>
          <p className="mt-2 text-gray-400">
            {loading
              ? "Loading exercises…"
              : `${exercises.length} exercises found`}
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search exercises…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition focus:border-green-400/50 focus:ring-1 focus:ring-green-400/20 md:max-w-sm"
          />
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col gap-4">
          {/* Muscle group */}
          <div className="flex flex-wrap gap-2">
            {muscles.map((m) => (
              <button
                key={m}
                onClick={() => setMuscle(m)}
                className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-all ${
                  muscle === m
                    ? "border-green-400 bg-green-400/10 text-green-400"
                    : "border-white/10 bg-white/5 text-gray-400 hover:border-white/20 hover:text-white"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Difficulty */}
          <div className="flex flex-wrap items-center gap-2">
            {difficulties.map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-all ${
                  difficulty === d
                    ? "border-green-400 bg-green-400/10 text-green-400"
                    : "border-white/10 bg-white/5 text-gray-400 hover:border-white/20 hover:text-white"
                }`}
              >
                {d}
              </button>
            ))}

            {/* Clear filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="ml-2 rounded-full border border-red-400/20 bg-red-400/5 px-4 py-1.5 text-xs font-semibold text-red-400 transition-all hover:bg-red-400/10"
              >
                ✕ Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Error state */}
        {error && (
          <div className="mb-8 rounded-2xl border border-red-400/20 bg-red-400/5 p-4 text-sm text-red-400">
            Failed to load exercises: {error}
            <button
              onClick={fetchExercises}
              className="ml-4 underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <ExerciseCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Results grid */}
        {!loading && exercises.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {exercises.map((ex) => (
              <ExerciseCard key={ex.id} exercise={ex} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && exercises.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-4 text-5xl">🔍</div>
            <h3 className="mb-2 text-lg font-bold">No exercises found</h3>
            <p className="mb-6 text-sm text-gray-500">
              Try adjusting your filters or search term.
            </p>
            <button
              onClick={clearFilters}
              className="rounded-full border border-white/10 px-5 py-2 text-sm font-semibold text-gray-300 hover:border-green-400/40 hover:text-green-400"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}