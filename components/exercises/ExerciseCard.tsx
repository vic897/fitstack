import type { Exercise } from "@/lib/db/exercises";
import {
  formatDifficultyLabel,
  getDifficultyBadgeStyle,
  getMuscleIcon,
} from "./exerciseConfig";

export function ExerciseCard({ exercise }: { exercise: Exercise }) {
  const iconName = getMuscleIcon(exercise.muscle_group);
  const badgeStyle = getDifficultyBadgeStyle(exercise.difficulty);
  const difficultyLabel = formatDifficultyLabel(exercise.difficulty);

  return (
    <article
      data-exercise-card="true"
      data-muscle={exercise.muscle_group.toLowerCase()}
      data-difficulty={exercise.difficulty.toLowerCase()}
      className="group flex flex-col justify-between rounded-2xl border border-outline-variant/25 bg-surface-container-low/80 p-space-md shadow-md backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-surface-container hover:shadow-xl"
    >
      <div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-container-high text-primary transition-colors group-hover:bg-primary-container group-hover:text-on-primary-container">
            <span className="material-symbols-outlined text-[22px]">
              {iconName}
            </span>
          </div>
          <span
            className={`rounded-full px-2.5 py-0.5 font-label-sm text-label-sm font-semibold uppercase tracking-wider ${badgeStyle}`}
          >
            {difficultyLabel}
          </span>
        </div>

        <h2 className="mt-space-md mb-space-md font-title-lg text-title-lg leading-snug font-bold text-on-surface transition-colors group-hover:text-primary">
          {exercise.name}
        </h2>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 border-t border-outline-variant/15 pt-space-sm">
        <span className="rounded bg-surface-container-highest px-2.5 py-1 font-label-sm text-label-sm font-medium text-on-surface-variant">
          {exercise.muscle_group}
        </span>
        <span className="rounded bg-surface-container-highest px-2.5 py-1 font-label-sm text-label-sm font-medium text-on-surface-variant">
          {exercise.equipment}
        </span>
      </div>
    </article>
  );
}

export function ExerciseGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div
      aria-label="Loading exercises"
      className="grid w-full grid-cols-1 gap-space-md sm:grid-cols-2 lg:grid-cols-4"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col justify-between rounded-2xl border border-outline-variant/20 bg-surface-container-low/70 p-space-md"
        >
          <div>
            <div className="flex items-center justify-between gap-2">
              <div className="h-10 w-10 animate-pulse rounded-xl bg-surface-container-high" />
              <div className="h-5 w-20 animate-pulse rounded-full bg-surface-container-high" />
            </div>
            <div className="mt-space-md mb-space-md space-y-2">
              <div className="h-5 w-4/5 animate-pulse rounded-full bg-surface-container-high" />
              <div className="h-5 w-1/2 animate-pulse rounded-full bg-surface-container-high" />
            </div>
          </div>
          <div className="flex gap-1.5 border-t border-outline-variant/15 pt-space-sm">
            <div className="h-6 w-16 animate-pulse rounded bg-surface-container-highest" />
            <div className="h-6 w-20 animate-pulse rounded bg-surface-container-highest" />
          </div>
        </div>
      ))}
    </div>
  );
}
