import { createClient } from "@/lib/supabase/client";
import type { Workout, DayPlan, Goal, Level } from "@/lib/supabase/types";

// ── Save a generated workout ────────────────────────────────────
export async function saveWorkout(
  goal: Goal,
  level: Level,
  plan: DayPlan[]
): Promise<{ data: Workout | null; error: string | null }> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: "Not authenticated" };

  const { data, error } = await supabase
    .from("workouts")
    .insert({ user_id: user.id, goal, level, plan })
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  return { data, error: null };
}

// ── Fetch all workouts for current user ─────────────────────────
export async function getMyWorkouts(): Promise<{
  data: Workout[];
  error: string | null;
}> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("workouts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return { data: [], error: error.message };
  return { data: data ?? [], error: null };
}

// ── Delete a workout ────────────────────────────────────────────
export async function deleteWorkout(
  id: string
): Promise<{ error: string | null }> {
  const supabase = createClient();

  const { error } = await supabase
    .from("workouts")
    .delete()
    .eq("id", id);

  if (error) return { error: error.message };
  return { error: null };
}