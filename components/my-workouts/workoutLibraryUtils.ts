import type { DayPlan, Workout } from "@/lib/supabase/types";

export type WorkoutGoalFilter = "all" | "muscle-gain" | "fat-loss" | "endurance";
export type WorkoutSortOrder = "newest" | "oldest";

export interface GoalMeta {
  label: string;
  badgeClass: string;
  accentDotClass: string;
}

const GOAL_META_MAP: Record<string, GoalMeta> = {
  "muscle-gain": {
    label: "Muscle Gain",
    badgeClass: "bg-[#4edea3]/12 border-[#4edea3]/25 text-[#4edea3]",
    accentDotClass: "bg-[#4edea3]",
  },
  "fat-loss": {
    label: "Fat Loss",
    badgeClass: "bg-amber-400/12 border-amber-400/25 text-amber-300",
    accentDotClass: "bg-amber-400",
  },
  endurance: {
    label: "Endurance",
    badgeClass: "bg-sky-400/12 border-sky-400/25 text-sky-300",
    accentDotClass: "bg-sky-400",
  },
};

export function getGoalMeta(goal: string): GoalMeta {
  return (
    GOAL_META_MAP[goal] ?? {
      label: goal
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" "),
      badgeClass: "bg-white/[0.08] border-white/[0.14] text-[#e1e2e8]",
      accentDotClass: "bg-[#bbcabf]",
    }
  );
}

export function isRestDay(focus: string): boolean {
  const f = focus.toLowerCase();
  return f.includes("rest") || f.includes("recovery");
}

export function getFocusBadgeClass(focus: string): string {
  const f = focus.toLowerCase();
  if (isRestDay(f)) {
    return "bg-white/[0.05] text-[#86948a] border-white/[0.08]";
  }
  if (f.includes("cardio") || f.includes("run") || f.includes("hiit") || f.includes("cross")) {
    return "bg-sky-400/12 text-sky-300 border-sky-400/25";
  }
  if (f.includes("leg") || f.includes("lower")) {
    return "bg-teal-400/12 text-teal-300 border-teal-400/25";
  }
  if (f.includes("upper") || f.includes("chest") || f.includes("push")) {
    return "bg-[#4edea3]/12 text-[#4edea3] border-[#4edea3]/25";
  }
  if (f.includes("back") || f.includes("pull")) {
    return "bg-emerald-400/12 text-emerald-300 border-emerald-400/25";
  }
  return "bg-[#4edea3]/12 text-[#4edea3] border-[#4edea3]/25";
}

export function formatWorkoutDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export interface PlanMetrics {
  totalDays: number;
  trainingDays: number;
  restDays: number;
  exerciseCount: number;
}

export function countPlanMetrics(plan: DayPlan[]): PlanMetrics {
  const safePlan = Array.isArray(plan) ? plan : [];
  let trainingDays = 0;
  let restDays = 0;
  let exerciseCount = 0;

  for (const day of safePlan) {
    if (isRestDay(day.focus)) {
      restDays += 1;
    } else {
      trainingDays += 1;
    }
    exerciseCount += Array.isArray(day.exercises) ? day.exercises.length : 0;
  }

  return {
    totalDays: safePlan.length,
    trainingDays,
    restDays,
    exerciseCount,
  };
}

export function filterAndSortWorkouts(
  workouts: Workout[],
  searchQuery: string,
  goalFilter: WorkoutGoalFilter,
  sortOrder: WorkoutSortOrder
): Workout[] {
  const q = searchQuery.trim().toLowerCase();

  const filtered = workouts.filter((workout) => {
    if (goalFilter !== "all" && workout.goal !== goalFilter) {
      return false;
    }

    if (!q) return true;

    const meta = getGoalMeta(workout.goal);
    if (
      meta.label.toLowerCase().includes(q) ||
      workout.goal.toLowerCase().includes(q) ||
      workout.level.toLowerCase().includes(q)
    ) {
      return true;
    }

    const days = Array.isArray(workout.plan) ? workout.plan : [];
    return days.some(
      (day) =>
        day.day.toLowerCase().includes(q) ||
        day.focus.toLowerCase().includes(q) ||
        (Array.isArray(day.exercises) &&
          day.exercises.some((ex) => ex.toLowerCase().includes(q)))
    );
  });

  return [...filtered].sort((a, b) => {
    const diff =
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    return sortOrder === "oldest" ? diff : -diff;
  });
}
