"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { logProgress, getMyProgress, deleteProgress } from "@/lib/db/progress";
import { useToast } from "@/components/ui/Toast";
import type { Progress } from "@/lib/supabase/types";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getBmiCategory(bmi: number) {
  if (bmi < 18.5) return { label: "Underweight", color: "text-blue-400" };
  if (bmi < 25)   return { label: "Normal",       color: "text-green-400" };
  if (bmi < 30)   return { label: "Overweight",   color: "text-yellow-400" };
  return             { label: "Obese",            color: "text-red-400" };
}

export default function ProgressPage() {
  const [entries, setEntries]   = useState<Progress[]>([]);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [weight, setWeight]     = useState("");
  const [note, setNote]         = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const { showToast, ToastComponent } = useToast();

  useEffect(() => {
    async function load() {
      const { data, error } = await getMyProgress();
      if (error) showToast(error, "error");
      setEntries(data);
      setLoading(false);
    }
    load();
  }, []);

  async function handleLog() {
    const w = parseFloat(weight);
    if (!w || w < 2 || w > 300) {
      showToast("Enter a valid weight (2–300 kg).", "error");
      return;
    }

    setSaving(true);
    const { data, error } = await logProgress(w, note || undefined);
    if (error) {
      showToast(error, "error");
    } else if (data) {
      setEntries((prev) => [data, ...prev]);
      setWeight("");
      setNote("");
      showToast("Weight logged!", "success");
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    setDeleting(id);
    const { error } = await deleteProgress(id);
    if (error) {
      showToast("Failed to delete entry.", "error");
    } else {
      setEntries((prev) => prev.filter((e) => e.id !== id));
    }
    setDeleting(null);
  }

  // Simple trend — difference between latest and oldest entry
  const trend = entries.length >= 2
    ? (entries[0].weight - entries[entries.length - 1].weight).toFixed(1)
    : null;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      {ToastComponent}

      <div className="mx-auto max-w-2xl px-6 pt-28 pb-24">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-black tracking-tight md:text-5xl">
            Progress <span className="text-green-400">Tracker</span>
          </h1>
          <p className="mt-2 text-gray-400">
            Log your weight over time. See your trend.
          </p>
        </div>

        {/* Log weight form */}
        <div className="mb-10 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-5 font-bold">Log today's weight</h2>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Weight in kg"
                min={20}
                max={300}
                step={0.1}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition focus:border-green-400/50 focus:ring-1 focus:ring-green-400/20"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                kg
              </span>
            </div>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Optional note"
              className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition focus:border-green-400/50 focus:ring-1 focus:ring-green-400/20"
            />
          </div>
          <button
            onClick={handleLog}
            disabled={saving || !weight}
            className="mt-4 w-full rounded-full bg-green-400 py-3 text-sm font-bold text-gray-950 transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
          >
            {saving ? "Saving…" : "Log Weight →"}
          </button>
        </div>

        {/* Trend summary */}
        {entries.length >= 2 && trend && (
          <div className="mb-8 grid grid-cols-3 gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
              <div className="text-2xl font-black text-green-400">
                {entries[0].weight}
              </div>
              <div className="mt-1 text-xs text-gray-500">Latest (kg)</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
              <div className={`text-2xl font-black ${
                parseFloat(trend) < 0 ? "text-green-400" :
                parseFloat(trend) > 0 ? "text-red-400" : "text-gray-400"
              }`}>
                {parseFloat(trend) > 0 ? "+" : ""}{trend}
              </div>
              <div className="mt-1 text-xs text-gray-500">Change (kg)</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
              <div className="text-2xl font-black text-white">
                {entries.length}
              </div>
              <div className="mt-1 text-xs text-gray-500">Entries</div>
            </div>
          </div>
        )}

        {/* Entry list */}
        {loading && (
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-green-400 border-t-transparent" />
            Loading entries…
          </div>
        )}

        {!loading && entries.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 py-16 text-center">
            <div className="mb-4 text-5xl">⚖️</div>
            <h3 className="mb-1 font-bold">No entries yet</h3>
            <p className="text-sm text-gray-500">
              Log your first weight above to start tracking.
            </p>
          </div>
        )}

        {!loading && entries.length > 0 && (
          <div className="space-y-3">
            <h2 className="mb-4 font-bold text-gray-300">History</h2>
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-5 py-4"
              >
                <div className="flex items-center gap-4">
                  <div className="text-lg font-black text-green-400">
                    {entry.weight} kg
                  </div>
                  <div>
                    <div className="text-sm text-gray-300">
                      {formatDate(entry.date)}
                    </div>
                    {entry.note && (
                      <div className="text-xs text-gray-500">{entry.note}</div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(entry.id)}
                  disabled={deleting === entry.id}
                  className="text-xs text-gray-600 transition-colors hover:text-red-400 disabled:opacity-40"
                >
                  {deleting === entry.id ? "..." : "✕"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}