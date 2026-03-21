import { createClient } from "@/lib/supabase/client";
import type { Progress } from "@/lib/supabase/types";

// ── Log a weight entry ──────────────────────────────────────────
export async function logProgress(
  weight: number,
  note?: string
): Promise<{ data: Progress | null; error: string | null }> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: "Not authenticated" };

  const { data, error } = await supabase
    .from("progress")
    .insert({ user_id: user.id, weight, note: note ?? null })
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  return { data, error: null };
}

// ── Fetch progress entries for current user ─────────────────────
export async function getMyProgress(): Promise<{
  data: Progress[];
  error: string | null;
}> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("progress")
    .select("*")
    .order("date", { ascending: false })
    .limit(30); // last 30 entries

  if (error) return { data: [], error: error.message };
  return { data: data ?? [], error: null };
}

// ── Delete a progress entry ─────────────────────────────────────
export async function deleteProgress(
  id: string
): Promise<{ error: string | null }> {
  const supabase = createClient();

  const { error } = await supabase
    .from("progress")
    .delete()
    .eq("id", id);

  if (error) return { error: error.message };
  return { error: null };
}
