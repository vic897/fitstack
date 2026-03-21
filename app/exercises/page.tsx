"use client";

import { useState, useMemo } from "react";
import Navbar from "@/components/layout/Navbar";
import ExerciseCard from "@/components/ui/ExerciseCard";
import exercisesData from "@/data/exercises.json";

const ALL = "All";

const muscles = [ALL, "Chest", "Back", "Legs", "Shoulders", "Arms", "Core"];
const difficulties = [ALL, "Beginner", "Intermediate", "Advanced"];

export default function ExercisesPage() {
  const [muscle, setMuscle] = useState(ALL);
  const [difficulty, setDifficulty] = useState(ALL);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return exercisesData.filter((ex) => {
      const matchMuscle = muscle === ALL || ex.muscle === muscle;
      const matchDiff = difficulty === ALL || ex.difficulty === difficulty;
      const matchSearch =
        search === "" ||
        ex.name.toLowerCase().includes(search.toLowerCase()) ||
        ex.muscle.toLowerCase().includes(search.toLowerCase());
      return matchMuscle && matchDiff && matchSearch;
    });
  }, [muscle, difficulty, search]);

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
            {exercisesData.length} exercises. Filter by muscle or difficulty.
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search exercises..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition focus:border-green-400/50 focus:ring-1 focus:ring-green-400/20 md:max-w-sm"
          />
        </div>

        {/* Filters */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center">
          {/* Muscle filter */}
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

          {/* Divider */}
          <div className="hidden h-5 w-px bg-white/10 sm:block" />

          {/* Difficulty filter */}
          <div className="flex flex-wrap gap-2">
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
          </div>
        </div>

        {/* Results count */}
        <p className="mb-6 text-sm text-gray-500">
          Showing{" "}
          <span className="font-semibold text-white">{filtered.length}</span>{" "}
          exercise{filtered.length !== 1 ? "s" : ""}
        </p>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((ex) => (
              <ExerciseCard key={ex.id} exercise={ex} />
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-4 text-5xl">🔍</div>
            <h3 className="mb-2 text-lg font-bold">No exercises found</h3>
            <p className="text-sm text-gray-500">
              Try adjusting your filters or search term.
            </p>
            <button
              onClick={() => {
                setMuscle(ALL);
                setDifficulty(ALL);
                setSearch("");
              }}
              className="mt-6 rounded-full border border-white/10 px-5 py-2 text-sm font-semibold text-gray-300 hover:border-green-400/40 hover:text-green-400"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}