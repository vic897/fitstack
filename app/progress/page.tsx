"use client";

import { useEffect, useState } from "react";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { ProgressLoggerAndHistory } from "@/components/progress/ProgressLoggerAndHistory";
import { ProgressSummaryCards } from "@/components/progress/ProgressSummaryCards";
import {
  computeProgressStats,
  type ProgressRange,
  type ProgressSortOrder,
} from "@/components/progress/progressUtils";
import { WeightChartCard } from "@/components/progress/WeightChartCard";
import { useToast } from "@/components/ui/Toast";
import {
  deleteProgress,
  getMyProgress,
  logProgress,
} from "@/lib/db/progress";
import type { Progress } from "@/lib/supabase/types";

export default function ProgressPage() {
  const [entries, setEntries] = useState<Progress[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [weight, setWeight] = useState("");
  const [note, setNote] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [range, setRange] = useState<ProgressRange>("all");
  const [sortOrder, setSortOrder] = useState<ProgressSortOrder>("newest");

  const { showToast, ToastComponent } = useToast();

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const { data, error } = await getMyProgress();
        if (!active) return;

        if (error) {
          setLoadError(error);
          showToast(error, "error");
        } else {
          setLoadError(null);
          setEntries(data);
        }
      } catch (err) {
        if (!active) return;
        const message =
          err instanceof Error
            ? err.message
            : "Unable to load progress history.";
        setLoadError(message);
        showToast(message, "error");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [showToast]);

  async function handleRetry() {
    setLoading(true);
    setLoadError(null);

    try {
      const { data, error } = await getMyProgress();
      if (error) {
        setLoadError(error);
        showToast(error, "error");
      } else {
        setEntries(data);
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to load progress history.";
      setLoadError(message);
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleLog() {
    const w = parseFloat(weight);
    if (!w || w < 2 || w > 300) {
      showToast("Enter a valid weight (2–300 kg).", "error");
      return;
    }

    setSaving(true);
    try {
      const trimmedNote = note.trim();
      const { data, error } = await logProgress(w, trimmedNote || undefined);
      if (error) {
        showToast(error, "error");
      } else if (data) {
        setEntries((prev) => [data, ...prev]);
        setWeight("");
        setNote("");
        setLoadError(null);
        showToast("Weight logged!", "success");
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to save weight entry.";
      showToast(message, "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      const { error } = await deleteProgress(id);
      if (error) {
        showToast("Failed to delete entry.", "error");
      } else {
        setEntries((prev) => prev.filter((e) => e.id !== id));
      }
    } catch {
      showToast("Failed to delete entry.", "error");
    } finally {
      setDeletingId(null);
    }
  }

  const stats = computeProgressStats(entries);

  return (
    <div className="relative min-h-screen flex flex-col overflow-x-clip bg-[#111418] text-[#e1e2e8] selection:bg-[#4edea3]/30 selection:text-[#6ffbbe]">
      <Navbar />
      {ToastComponent}

      {/* Ambient Background Lighting */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[420px] w-[780px] rounded-full bg-[#10b981]/[0.07] blur-[140px]" />
        <div className="absolute bottom-0 right-0 h-[360px] w-[420px] rounded-full bg-[#4edea3]/[0.04] blur-[140px]" />
      </div>

      <main className="relative z-10 flex-1 w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-20">
        {/* Hero Header */}
        <header className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#4edea3]/10 border border-[#4edea3]/25 px-3 py-1 mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-[#4edea3] animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#4edea3]">
              Progress Analytics
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#e1e2e8]">
            Progress{" "}
            <span className="bg-gradient-to-r from-[#4edea3] to-[#6ffbbe] bg-clip-text text-transparent">
              Dashboard
            </span>
          </h1>
          <p className="mt-2.5 max-w-2xl text-sm sm:text-base text-[#bbcabf]/85">
            Record weigh-ins, review historical changes, and monitor your body weight trajectory from your real saved logs.
          </p>
        </header>

        {/* Top Metric Summary Cards */}
        <ProgressSummaryCards stats={stats} loading={loading} />

        {/* Asymmetric 8 / 4 Analytics + Logger Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 xl:col-span-8">
            <WeightChartCard
              entries={entries}
              loading={loading}
              range={range}
              onRangeChange={setRange}
            />
          </div>

          <div className="lg:col-span-5 xl:col-span-4">
            <ProgressLoggerAndHistory
              entries={entries}
              loading={loading}
              loadError={loadError}
              saving={saving}
              deletingId={deletingId}
              weight={weight}
              note={note}
              sortOrder={sortOrder}
              latestWeight={stats.latest?.weight ?? null}
              onWeightChange={setWeight}
              onNoteChange={setNote}
              onSortOrderChange={setSortOrder}
              onLog={handleLog}
              onDelete={handleDelete}
              onRetry={handleRetry}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
