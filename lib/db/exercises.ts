import { createClient } from "@/lib/supabase/client";

export type Exercise = {
  id: string;
  name: string;
  muscle_group: string;
  equipment: string;
  difficulty: string;
};

type Filters = {
  muscle_group?: string;
  difficulty?: string;
  search?: string;
};

export async function getExercises(filters: Filters = {}): Promise<{
  data: Exercise[];
  error: string | null;
}> {
  const supabase = createClient();

  let query = supabase
    .from("exercises")
    .select("id, name, muscle_group, equipment, difficulty")
    .order("name", { ascending: true });

  if (filters.muscle_group && filters.muscle_group.toLowerCase() !== "all") {
    query = query.eq("muscle_group", filters.muscle_group);
  }

  if (filters.difficulty && filters.difficulty.toLowerCase() !== "all") {
    query = query.eq("difficulty", filters.difficulty.toLowerCase());
  }

  if (filters.search && filters.search.trim() !== "") {
    query = query.ilike("name", `%${filters.search.trim()}%`);
  }

  const { data, error } = await query;

  if (error) return { data: [], error: error.message };
  return { data: data ?? [], error: null };
}

export async function getExercisesForAI(
  muscle_groups?: string[]
): Promise<{
  name: string;
  muscle_group: string;
  equipment: string;
  difficulty: string;
}[]> {
  const supabase = createClient();

  let query = supabase
    .from("exercises")
    .select("name, muscle_group, equipment, difficulty")
    .order("muscle_group", { ascending: true });

  if (muscle_groups && muscle_groups.length > 0) {
    query = query.in("muscle_group", muscle_groups);
  }

  const { data } = await query;
  return data ?? [];
}

// ── Get unique filter values from DB ────────────────────────────
export async function getExerciseFilters(): Promise<{
  muscle_groups: string[];
  equipment: string[];
}> {
  const supabase = createClient();

  const { data } = await supabase
    .from("exercises")
    .select("muscle_group, equipment");

  if (!data) return { muscle_groups: [], equipment: [] };

  const muscle_groups = [...new Set(data.map((e) => e.muscle_group))].sort();
  const equipment     = [...new Set(data.map((e) => e.equipment))].sort();

  return { muscle_groups, equipment };
}