import type { Progress } from "@/lib/supabase/types";

export type ProgressRange = "7d" | "30d" | "all";
export type ProgressSortOrder = "newest" | "oldest";

export interface ProgressStats {
  latest: Progress | null;
  oldest: Progress | null;
  minWeight: number | null;
  maxWeight: number | null;
  change: number | null;
  count: number;
}

export function formatProgressDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatShortDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

export function sortProgressEntries(
  entries: Progress[],
  order: ProgressSortOrder
): Progress[] {
  return [...entries].sort((a, b) => {
    const diff = new Date(a.date).getTime() - new Date(b.date).getTime();
    if (diff !== 0) {
      return order === "oldest" ? diff : -diff;
    }
    const createdDiff =
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    return order === "oldest" ? createdDiff : -createdDiff;
  });
}

export function filterEntriesByRange(
  entries: Progress[],
  range: ProgressRange
): Progress[] {
  if (range === "all" || entries.length === 0) {
    return entries;
  }

  const orderedDesc = sortProgressEntries(entries, "newest");
  const anchorTime = new Date(orderedDesc[0].date).getTime();
  if (Number.isNaN(anchorTime)) {
    return entries;
  }

  const days = range === "7d" ? 7 : 30;
  const cutoff = anchorTime - days * 24 * 60 * 60 * 1000;

  return entries.filter((entry) => {
    const ts = new Date(entry.date).getTime();
    return Number.isNaN(ts) || ts >= cutoff;
  });
}

export function computeProgressStats(entries: Progress[]): ProgressStats {
  if (entries.length === 0) {
    return {
      latest: null,
      oldest: null,
      minWeight: null,
      maxWeight: null,
      change: null,
      count: 0,
    };
  }

  const orderedAsc = sortProgressEntries(entries, "oldest");
  const oldest = orderedAsc[0];
  const latest = orderedAsc[orderedAsc.length - 1];

  let minWeight = orderedAsc[0].weight;
  let maxWeight = orderedAsc[0].weight;

  for (const entry of orderedAsc) {
    if (entry.weight < minWeight) minWeight = entry.weight;
    if (entry.weight > maxWeight) maxWeight = entry.weight;
  }

  const change =
    orderedAsc.length >= 2
      ? Number((latest.weight - oldest.weight).toFixed(1))
      : null;

  return {
    latest,
    oldest,
    minWeight,
    maxWeight,
    change,
    count: entries.length,
  };
}
