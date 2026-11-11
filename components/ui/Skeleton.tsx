export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-xl bg-surface-container-highest/75 ${className}`}
    />
  );
}

export function ExerciseCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="flex flex-col rounded-2xl border border-outline-variant/25 bg-surface-container-low/75 p-6 backdrop-blur-xl"
    >
      <div className="mb-4 flex items-start justify-between">
        <Skeleton className="h-9 w-9 rounded-xl" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
      <Skeleton className="mb-2.5 h-5 w-3/4" />
      <div className="mb-3 flex gap-2">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="mt-1.5 h-4 w-5/6" />
    </div>
  );
}

export function WorkoutPlanSkeleton() {
  return (
    <div aria-hidden="true" className="grid gap-4 sm:grid-cols-2">
      {Array.from({ length: 7 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-outline-variant/25 bg-surface-container-low/75 p-5 backdrop-blur-xl"
        >
          <div className="mb-3 flex items-center justify-between">
            <Skeleton className="h-3.5 w-16" />
            <Skeleton className="h-3.5 w-24" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-4/5" />
            <Skeleton className="h-3.5 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function MealPlanSkeleton() {
  return (
    <div aria-hidden="true" className="grid gap-4 sm:grid-cols-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-outline-variant/25 bg-surface-container-low/75 p-6 backdrop-blur-xl"
        >
          <div className="mb-4 flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-xl" />
            <Skeleton className="h-5 w-24" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-5/6" />
            <Skeleton className="h-3.5 w-4/5" />
            <Skeleton className="h-3.5 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}
