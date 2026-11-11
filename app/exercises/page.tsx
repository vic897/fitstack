"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getExercises, type Exercise } from "@/lib/db/exercises";
import {
  ALL_FILTER,
  DIFFICULTY_OPTIONS,
  MUSCLE_GROUPS,
  PAGE_SIZE,
} from "@/components/exercises/exerciseConfig";
import {
  ExerciseCard,
  ExerciseGridSkeleton,
} from "@/components/exercises/ExerciseCard";
import PaginationBar from "@/components/exercises/PaginationBar";

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [muscle, setMuscle] = useState<string>(ALL_FILTER);
  const [difficulty, setDifficulty] = useState<string>(ALL_FILTER);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [retryCount, setRetryCount] = useState(0);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const gridTopRef = useRef<HTMLDivElement>(null);

  // Fetch exercises from Supabase whenever filters or retry counter change
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const { data, error: fetchError } = await getExercises({
          muscle_group: muscle,
          difficulty: difficulty.toLowerCase(),
          search,
        });
        if (cancelled) return;
        if (fetchError) {
          setError(fetchError);
          setExercises([]);
        } else {
          setExercises(data);
        }
      } catch (err) {
        if (cancelled) return;
        setError(
          err instanceof Error ? err.message : "Failed to load exercises."
        );
        setExercises([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [muscle, difficulty, search, retryCount]);

  // Debounce search input -> search filter & reset pagination
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Keyboard shortcut: "/" focuses search input; "Escape" clears when focused
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isEditable =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      if (e.key === "/" && !isEditable) {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (
        e.key === "Escape" &&
        document.activeElement === searchInputRef.current
      ) {
        setSearchInput("");
        setSearch("");
        setPage(1);
        searchInputRef.current?.blur();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  function handleSelectMuscle(nextMuscle: string) {
    setMuscle(nextMuscle);
    setPage(1);
  }

  function handleSelectDifficulty(nextDifficulty: string) {
    setDifficulty(nextDifficulty);
    setPage(1);
  }

  function clearSearch() {
    setSearchInput("");
    setSearch("");
    setPage(1);
    searchInputRef.current?.focus();
  }

  function clearFilters() {
    setMuscle(ALL_FILTER);
    setDifficulty(ALL_FILTER);
    setSearch("");
    setSearchInput("");
    setPage(1);
  }

  function handlePageChange(nextPage: number) {
    setPage(nextPage);
    gridTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const hasActiveFilters =
    muscle !== ALL_FILTER || difficulty !== ALL_FILTER || search !== "";

  const totalItems = exercises.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const paginatedExercises = exercises.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );
  const startItem = totalItems === 0 ? 0 : startIndex + 1;
  const endItem = Math.min(startIndex + PAGE_SIZE, totalItems);

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-clip bg-surface text-on-surface">
      <Navbar />

      {/* Ambient Atmospheric Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        <div className="absolute left-1/2 top-0 h-[340px] w-[1000px] -translate-x-1/2 rounded-full bg-gradient-to-b from-primary/10 via-tertiary/5 to-transparent blur-3xl" />
      </div>

      <main className="relative z-10 w-full flex-1 pt-16">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-space-xl px-margin-mobile py-space-xl sm:px-margin">
          {/* Header Section */}
          <div className="flex flex-col justify-between gap-space-lg lg:flex-row lg:items-end">
            <div className="flex max-w-2xl flex-col gap-space-sm">
              <div className="inline-flex items-center gap-2 self-start rounded-full border border-outline-variant/25 bg-surface-container-high px-3 py-1 font-label-sm text-label-sm font-semibold uppercase tracking-wider text-primary">
                <span className="h-1.5 w-1.5 animate-ping rounded-full bg-primary" />
                <span>Kinetic Exercise Repository</span>
              </div>

              <h1 className="font-headline-xl text-headline-xl-mobile tracking-tight text-on-surface sm:text-headline-xl">
                Explore{" "}
                <span className="bg-gradient-to-r from-primary via-secondary to-tertiary bg-clip-text text-transparent">
                  Exercises
                </span>
              </h1>

              <p className="font-body-lg text-body-lg text-on-surface-variant">
                Discover movements. Build strength. Train smarter across
                curated exercises filtered by muscle group and difficulty.
              </p>
            </div>

            {/* Live Exercise Count & Database Tag */}
            <div className="flex flex-wrap items-center gap-space-sm sm:flex-nowrap">
              <div className="flex items-center gap-3 rounded-xl border border-outline-variant/25 bg-surface-container-low px-4 py-2.5 shadow-sm">
                <div className="relative flex items-center justify-center">
                  <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                  <span className="absolute h-2.5 w-2.5 animate-ping rounded-full bg-primary opacity-75" />
                </div>
                <div className="flex flex-col">
                  <span
                    id="counter-display"
                    className="font-title-lg text-title-lg leading-none font-extrabold text-on-surface"
                  >
                    {loading ? "…" : totalItems}
                  </span>
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                    {totalItems === 1 ? "Exercise Found" : "Exercises Found"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-outline-variant/25 bg-surface-container-low px-3.5 py-2.5 font-label-md text-label-md text-on-surface">
                <span className="material-symbols-outlined text-[18px] text-primary">
                  verified
                </span>
                <span>Goal &amp; Level Tagged</span>
              </div>
            </div>
          </div>

          {/* Search & Filtering Command Center */}
          <div className="flex flex-col gap-space-md rounded-2xl border border-outline-variant/25 bg-surface-container-low/90 p-space-lg shadow-xl backdrop-blur-xl">
            {/* Search Input */}
            <div className="relative flex w-full items-center">
              <div className="pointer-events-none absolute left-4 flex items-center text-primary">
                <span className="material-symbols-outlined text-[22px]">
                  search
                </span>
              </div>
              <input
                ref={searchInputRef}
                id="exercise-search"
                type="text"
                aria-label="Search exercises"
                placeholder="Search exercises by name…"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className={`w-full rounded-xl border border-outline-variant/25 bg-surface-container-lowest py-3.5 pl-12 font-body-md text-body-md text-on-surface shadow-inner placeholder:text-on-surface-variant/60 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                  searchInput.length > 0 ? "pr-20 sm:pr-24" : "pr-4 sm:pr-12"
                }`}
              />
              <div className="absolute right-3.5 flex items-center gap-1.5">
                {searchInput.length > 0 && (
                  <button
                    id="clear-search-btn"
                    type="button"
                    onClick={clearSearch}
                    className="rounded bg-surface-container px-2 py-1 font-label-sm text-label-sm text-on-surface-variant transition-colors hover:text-on-surface"
                  >
                    Esc ✕
                  </button>
                )}
                <span
                  aria-hidden="true"
                  className="hidden select-none rounded bg-surface-container-high px-2 py-1 font-label-sm text-label-sm font-semibold text-on-surface-variant sm:inline-block"
                >
                  /
                </span>
              </div>
            </div>

            {/* Filter Rows */}
            <div className="flex flex-col gap-space-sm pt-1">
              {/* Target Muscle Pills */}
              <div className="flex flex-col gap-space-sm sm:flex-row sm:items-center">
                <span className="shrink-0 font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant sm:w-28">
                  Target Muscle
                </span>
                <div
                  id="muscle-filters"
                  className="flex flex-wrap items-center gap-2"
                >
                  {MUSCLE_GROUPS.map((m) => {
                    const active = muscle === m;
                    return (
                      <button
                        key={m}
                        type="button"
                        aria-pressed={active}
                        data-muscle-filter={m}
                        onClick={() => handleSelectMuscle(m)}
                        className={`rounded-full px-4 py-1.5 font-label-md text-label-md transition-all ${
                          active
                            ? "bg-primary-container font-bold text-on-primary-container shadow-md"
                            : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                        }`}
                      >
                        {m}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Difficulty Pills */}
              <div className="flex flex-col gap-space-sm pt-1 sm:flex-row sm:items-center">
                <span className="shrink-0 font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant sm:w-28">
                  Difficulty
                </span>
                <div
                  id="difficulty-filters"
                  className="flex flex-wrap items-center gap-2"
                >
                  {DIFFICULTY_OPTIONS.map((opt) => {
                    const active = difficulty === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        aria-pressed={active}
                        data-difficulty-filter={opt.value}
                        onClick={() => handleSelectDifficulty(opt.value)}
                        className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 font-label-md text-label-md transition-all ${
                          active
                            ? "bg-primary-container font-bold text-on-primary-container shadow-md"
                            : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                        }`}
                      >
                        {opt.dotClass && (
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              active ? "bg-on-primary-container" : opt.dotClass
                            }`}
                          />
                        )}
                        <span>{opt.label}</span>
                      </button>
                    );
                  })}

                  {hasActiveFilters && (
                    <button
                      id="clear-filters-inline"
                      type="button"
                      onClick={clearFilters}
                      className="inline-flex items-center gap-1 rounded-full border border-error/25 bg-error-container/25 px-3.5 py-1.5 font-label-md text-label-md font-semibold text-error transition-colors hover:bg-error-container/40"
                    >
                      <span className="material-symbols-outlined text-[15px]">
                        close
                      </span>
                      <span>Clear filters</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Grid & Feedback Region */}
          <div ref={gridTopRef} className="scroll-mt-24 flex flex-col gap-space-md">
            {/* Error State */}
            {error && (
              <div
                role="alert"
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-error/30 bg-error-container/25 p-space-md font-body-md text-body-md text-error"
              >
                <span>Failed to load exercises: {error}</span>
                <button
                  type="button"
                  onClick={() => setRetryCount((c) => c + 1)}
                  className="rounded-full border border-error/35 px-4 py-1.5 font-label-md text-label-md font-semibold text-error transition-colors hover:bg-error-container/40"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Loading Skeletons */}
            {loading && <ExerciseGridSkeleton count={PAGE_SIZE} />}

            {/* Exercise Cards Grid (4 columns on desktop) */}
            {!loading && paginatedExercises.length > 0 && (
              <div
                id="exercise-grid"
                className="grid w-full grid-cols-1 gap-space-md sm:grid-cols-2 lg:grid-cols-4"
              >
                {paginatedExercises.map((ex) => (
                  <ExerciseCard key={ex.id} exercise={ex} />
                ))}
              </div>
            )}

            {/* Empty Search Results State */}
            {!loading && exercises.length === 0 && !error && (
              <div
                id="no-results"
                className="flex flex-col items-center justify-center rounded-2xl border border-outline-variant/25 bg-surface-container-low/80 px-4 py-16 text-center"
              >
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface-container-high text-on-surface-variant">
                  <span className="material-symbols-outlined text-[32px]">
                    manage_search
                  </span>
                </div>
                <h3 className="mb-2 font-headline-md text-headline-md text-on-surface">
                  No exercises found
                </h3>
                <p className="mb-6 max-w-md font-body-md text-body-md text-on-surface-variant">
                  We couldn&apos;t find any movements matching your criteria. Try
                  adjusting your target muscle, difficulty level, or search
                  keyword.
                </p>
                <button
                  id="reset-filters-btn"
                  type="button"
                  onClick={clearFilters}
                  className="rounded-full bg-primary-container px-6 py-2.5 font-label-md text-label-md font-bold text-on-primary-container shadow-md transition-all hover:bg-primary"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>

          {/* Pagination & AI Coach Banner */}
          <div className="flex flex-col gap-space-md pt-space-xs">
            {!loading && totalItems > 0 && (
              <PaginationBar
                currentPage={safePage}
                totalPages={totalPages}
                startItem={startItem}
                endItem={endItem}
                totalItems={totalItems}
                onPageChange={handlePageChange}
              />
            )}

            {/* AI Coach Promotional Banner */}
            <div className="flex flex-col items-center justify-between gap-space-md rounded-2xl border border-outline-variant/25 bg-surface-container-high/90 p-space-lg shadow-lg md:flex-row">
              <div className="flex items-center gap-space-md">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-container/20 text-primary-fixed">
                  <span className="material-symbols-outlined text-[28px]">
                    neurology
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-title-lg text-title-lg font-bold text-on-surface">
                    AI Exercise &amp; Form Assistant
                  </span>
                  <span className="font-body-md text-body-md text-on-surface-variant">
                    Looking for equipment swaps, joint-friendly alternatives, or
                    form advice? Ask the FitStack AI Coach.
                  </span>
                </div>
              </div>
              <Link
                href="/coach"
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-primary-container px-5 py-2.5 font-label-md text-label-md font-bold text-on-primary-container shadow-md transition-all hover:bg-primary"
              >
                <span>Ask AI Coach</span>
                <span className="material-symbols-outlined text-[18px]">
                  psychology
                </span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
