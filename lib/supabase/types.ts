export type Workout = {
  id: string;
  user_id: string;
  goal: string;
  level: string;
  plan: DayPlan[];
  created_at: string;
};

export type DayPlan = {
  day: string;
  focus: string;
  exercises: string[];
};

export type Progress = {
  id: string;
  user_id: string;
  weight: number;
  note: string | null;
  date: string;
  created_at: string;
};

export type Goal = "muscle-gain" | "fat-loss" | "endurance";
export type Level = "beginner" | "intermediate" | "advanced";