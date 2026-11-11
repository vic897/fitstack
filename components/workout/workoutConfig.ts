import type { Goal, Level } from "@/lib/supabase/types";

export interface WorkoutGoalOption {
  value: Goal;
  label: string;
  icon: string;
  materialIcon: string;
  desc: string;
  tip: string;
  schemeLabel: string;
  schemeValue: string;
}

export interface WorkoutLevelOption {
  value: Level;
  label: string;
  span: string;
  desc: string;
  days: string;
  shortDays: string;
  trainingDaysCount: number;
  barWidthClass: string;
  badge?: string;
}

export const WORKOUT_GOALS: WorkoutGoalOption[] = [
  {
    value: "muscle-gain",
    label: "Muscle Gain",
    icon: "💪",
    materialIcon: "fitness_center",
    desc: "Build size, strength, and hypertrophy with compound and isolation lifts.",
    tip: "AI will select compound and isolation lifts suited to your level.",
    schemeLabel: "Rep Scheme",
    schemeValue: "3–5 sets · 6–15 reps",
  },
  {
    value: "fat-loss",
    label: "Fat Loss",
    icon: "🔥",
    materialIcon: "local_fire_department",
    desc: "Burn fat and stay lean by combining resistance work with higher rep density.",
    tip: "AI will combine resistance training with higher rep cardio work.",
    schemeLabel: "Rep Scheme",
    schemeValue: "3–4 sets · 12–20 reps",
  },
  {
    value: "endurance",
    label: "Endurance",
    icon: "🏃",
    materialIcon: "sprint",
    desc: "Improve stamina and cardio fitness with high-rep and timed conditioning work.",
    tip: "AI will build a cardio-first plan with supporting strength work.",
    schemeLabel: "Rep Scheme",
    schemeValue: "2–4 sets · 15–20 reps",
  },
];

export const WORKOUT_LEVELS: WorkoutLevelOption[] = [
  {
    value: "beginner",
    label: "Beginner",
    span: "0 – 6 months training",
    desc: "Master fundamental movement patterns, balanced volume, and foundational technique.",
    days: "3 days/week",
    shortDays: "3 Days / wk",
    trainingDaysCount: 3,
    barWidthClass: "w-1/3",
  },
  {
    value: "intermediate",
    label: "Intermediate",
    span: "6 months – 2 years training",
    desc: "Structured split routines, progressive volume loading, and balanced muscle focus.",
    days: "5 days/week",
    shortDays: "5 Days / wk",
    trainingDaysCount: 5,
    barWidthClass: "w-2/3",
    badge: "Balanced Split",
  },
  {
    value: "advanced",
    label: "Advanced",
    span: "2+ years training",
    desc: "High-frequency training split across compound and accessory work with minimal rest.",
    days: "6 days/week",
    shortDays: "6 Days / wk",
    trainingDaysCount: 6,
    barWidthClass: "w-full",
  },
];

export function getGoalOption(goal: Goal | ""): WorkoutGoalOption | undefined {
  return WORKOUT_GOALS.find((g) => g.value === goal);
}

export function getLevelOption(
  level: Level | ""
): WorkoutLevelOption | undefined {
  return WORKOUT_LEVELS.find((l) => l.value === level);
}
