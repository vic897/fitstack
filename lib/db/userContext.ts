import { createClient } from "@/lib/supabase/client";
import type { Goal, Level } from "@/lib/supabase/types";

export type UserContext = {
  name: string | null;
  latestGoal: Goal | null;
  latestLevel: Level | null;
  latestWeight: number | null;
  totalWorkouts: number;
};

export async function getUserContext(): Promise<UserContext> {
  const supabase = createClient();

  const defaultContext: UserContext = {
    name: null,
    latestGoal: null,
    latestLevel: null,
    latestWeight: null,
    totalWorkouts: 0,
  };

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return defaultContext;

  // Run both queries in parallel
  const [workoutRes, progressRes] = await Promise.all([
    supabase
      .from("workouts")
      .select("goal, level, created_at")
      .order("created_at", { ascending: false })
      .limit(1),
    supabase
      .from("progress")
      .select("weight")
      .order("date", { ascending: false })
      .limit(1),
  ]);

  // Count total workouts separately
  const { count } = await supabase
    .from("workouts")
    .select("*", { count: "exact", head: true });

  const latestWorkout = workoutRes.data?.[0];
  const latestProgress = progressRes.data?.[0];

  return {
    name: user.user_metadata?.full_name?.split(" ")[0] ?? null,
    latestGoal: (latestWorkout?.goal as Goal) ?? null,
    latestLevel: (latestWorkout?.level as Level) ?? null,
    latestWeight: latestProgress?.weight ?? null,
    totalWorkouts: count ?? 0,
  };
}