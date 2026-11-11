"use client";

import Link from "next/link";
import {
  ArrowRightIcon,
  CalendarIcon,
  ChevronDownIcon,
  DumbbellIcon,
  SpinnerIcon,
  TrashIcon,
} from "@/components/my-workouts/MyWorkoutsIcons";
import {
  countPlanMetrics,
  formatWorkoutDate,
  getFocusBadgeClass,
  getGoalMeta,
  isRestDay,
} from "@/components/my-workouts/workoutLibraryUtils";
import type { Workout } from "@/lib/supabase/types";

interface SavedWorkoutCardProps {
  workout: Workout;
  isExpanded: boolean;
  isDeleting: boolean;
  onToggleExpand: () => void;
  onDelete: () => void;
}

export function SavedWorkoutCard({
  workout,
  isExpanded,
  isDeleting,
  onToggleExpand,
  onDelete,
}: SavedWorkoutCardProps) {
  const goalMeta = getGoalMeta(workout.goal);
  const metrics = countPlanMetrics(workout.plan);
  const days = Array.isArray(workout.plan) ? workout.plan : [];

  const uniqueTrainingFocuses = Array.from(
    new Set(
      days
        .filter((d) => !isRestDay(d.focus) && d.focus.trim().length > 0)
        .map((d) => d.focus.trim())
    )
  );
  const previewFocuses = uniqueTrainingFocuses.slice(0, 4);
  const extraFocusCount = uniqueTrainingFocuses.length - previewFocuses.length;

  return (
    <article
      className={`overflow-hidden rounded-2xl bg-[#191c20]/75 backdrop-blur-xl border transition-all duration-200 shadow-[0_12px_36px_rgba(0,0,0,0.35)] ${
        isExpanded
          ? "border-[#4edea3]/35 shadow-[0_16px_48px_rgba(16,185,129,0.12)]"
          : "border-white/[0.08] hover:border-white/[0.15]"
      }`}
    >
      {/* Card Header */}
      <div className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <button
          type="button"
          onClick={onToggleExpand}
          aria-expanded={isExpanded}
          className="flex-1 text-left group cursor-pointer focus:outline-none"
        >
          <div className="flex flex-wrap items-center gap-2.5 mb-2.5">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${goalMeta.badgeClass}`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${goalMeta.accentDotClass}`}
              />
              <span>{goalMeta.label}</span>
            </span>

            <span className="inline-flex items-center rounded-full bg-white/[0.06] border border-white/[0.08] px-2.5 py-1 text-[11px] font-semibold capitalize text-[#bbcabf]">
              {workout.level}
            </span>

            <span className="inline-flex items-center gap-1.5 text-xs text-[#86948a]">
              <CalendarIcon className="h-3.5 w-3.5" />
              <span>Saved {formatWorkoutDate(workout.created_at)}</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm">
            <span className="font-display text-base sm:text-lg font-bold text-[#e1e2e8] group-hover:text-[#4edea3] transition-colors">
              {metrics.totalDays}-Day {goalMeta.label} Split
            </span>

            <span className="text-xs font-medium text-[#bbcabf]/85">
              {metrics.trainingDays} training · {metrics.restDays} rest
            </span>

            <span className="text-xs font-medium text-[#86948a]">
              {metrics.exerciseCount}{" "}
              {metrics.exerciseCount === 1 ? "exercise" : "exercises"}
            </span>
          </div>

          {/* Focus preview pills */}
          {previewFocuses.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              {previewFocuses.map((focus) => (
                <span
                  key={focus}
                  className="rounded-lg bg-[#0b0e12]/70 border border-white/[0.06] px-2.5 py-0.5 text-[11px] font-medium text-[#bbcabf]"
                >
                  {focus}
                </span>
              ))}
              {extraFocusCount > 0 && (
                <span className="rounded-lg bg-white/[0.04] px-2 py-0.5 text-[11px] font-medium text-[#86948a]">
                  +{extraFocusCount} more
                </span>
              )}
            </div>
          )}
        </button>

        {/* Header Actions */}
        <div className="flex items-center gap-2.5 shrink-0 self-start md:self-center">
          <button
            type="button"
            onClick={onToggleExpand}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all cursor-pointer ${
              isExpanded
                ? "bg-[#4edea3]/12 border-[#4edea3]/30 text-[#4edea3]"
                : "bg-white/[0.05] hover:bg-white/[0.1] border-white/[0.08] text-[#e1e2e8]"
            }`}
          >
            <span>{isExpanded ? "Hide plan" : "View plan"}</span>
            <ChevronDownIcon
              className={`h-3.5 w-3.5 transition-transform duration-200 ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </button>

          <button
            type="button"
            onClick={onDelete}
            disabled={isDeleting}
            aria-label={`Delete ${goalMeta.label} ${workout.level} workout saved ${formatWorkoutDate(workout.created_at)}`}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-[#0b0e12]/70 hover:border-[#ffb4ab]/35 hover:bg-[#93000a]/25 hover:text-[#ffb4ab] px-3 py-2 text-xs font-semibold text-[#86948a] disabled:opacity-45 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            {isDeleting ? (
              <>
                <SpinnerIcon className="h-3.5 w-3.5 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <TrashIcon className="h-3.5 w-3.5" />
                <span>Delete</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Expanded 7-Day Plan Detail */}
      {isExpanded && (
        <div className="border-t border-white/[0.08] bg-[#0b0e12]/55 px-5 sm:px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {days.map((day, idx) => {
              const rest = isRestDay(day.focus);
              const exercises = Array.isArray(day.exercises)
                ? day.exercises
                : [];

              return (
                <div
                  key={`${day.day}-${idx}`}
                  className={`rounded-xl border p-4 transition-colors ${
                    rest
                      ? "bg-[#111418]/65 border-white/[0.05]"
                      : "bg-[#191c20]/85 border-white/[0.08]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 pb-2.5 mb-3 border-b border-white/[0.06]">
                    <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#86948a]">
                      {day.day}
                    </span>

                    <span
                      className={`rounded-md border px-2 py-0.5 text-[11px] font-semibold ${getFocusBadgeClass(day.focus)}`}
                    >
                      {day.focus}
                    </span>
                  </div>

                  {exercises.length > 0 ? (
                    <ul className="space-y-2">
                      {exercises.map((ex, i) => (
                        <li
                          key={`${day.day}-${i}`}
                          className="flex items-start gap-2.5 text-xs leading-relaxed text-[#bbcabf]"
                        >
                          <span
                            className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                              rest ? "bg-[#86948a]/60" : "bg-[#4edea3]/80"
                            }`}
                          />
                          <span>{ex}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs italic text-[#86948a]">
                      {rest
                        ? "Rest & active recovery day"
                        : "No exercises listed for this day"}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-5 pt-4 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-[#86948a]">
              <DumbbellIcon className="h-3.5 w-3.5 text-[#4edea3]" />
              <span>
                {metrics.trainingDays} active training days · {metrics.exerciseCount} total movements
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                href="/coach"
                className="rounded-lg bg-white/[0.06] hover:bg-white/[0.11] border border-white/[0.08] px-3 py-1.5 text-xs font-semibold text-[#e1e2e8] transition-colors"
              >
                Ask AI Coach
              </Link>
              <Link
                href="/workout"
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#4edea3]/12 hover:bg-[#4edea3]/20 border border-[#4edea3]/25 px-3 py-1.5 text-xs font-semibold text-[#4edea3] transition-colors"
              >
                <span>Generate New Plan</span>
                <ArrowRightIcon className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
