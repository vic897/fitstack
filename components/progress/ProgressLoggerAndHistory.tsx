"use client";

import {
  ArrowRightIcon,
  ErrorAlertIcon,
  PlusChartIcon,
  RefreshIcon,
  ScaleIcon,
  SortIcon,
  SpinnerIcon,
  TrashIcon,
} from "@/components/progress/ProgressIcons";
import type { Progress } from "@/lib/supabase/types";
import {
  formatProgressDate,
  sortProgressEntries,
  type ProgressSortOrder,
} from "@/components/progress/progressUtils";

interface ProgressLoggerAndHistoryProps {
  entries: Progress[];
  loading: boolean;
  loadError: string | null;
  saving: boolean;
  deletingId: string | null;
  weight: string;
  note: string;
  sortOrder: ProgressSortOrder;
  latestWeight: number | null;
  onWeightChange: (val: string) => void;
  onNoteChange: (val: string) => void;
  onSortOrderChange: (order: ProgressSortOrder) => void;
  onLog: () => void;
  onDelete: (id: string) => void;
  onRetry: () => void;
}

const QUICK_NOTES = ["Morning fasted", "Post-workout", "Evening check-in"];

export function ProgressLoggerAndHistory({
  entries,
  loading,
  loadError,
  saving,
  deletingId,
  weight,
  note,
  sortOrder,
  latestWeight,
  onWeightChange,
  onNoteChange,
  onSortOrderChange,
  onLog,
  onDelete,
  onRetry,
}: ProgressLoggerAndHistoryProps) {
  const chronologicalAsc = sortProgressEntries(entries, "oldest");
  const oldestId = chronologicalAsc[0]?.id ?? null;
  const latestId =
    chronologicalAsc.length > 0
      ? chronologicalAsc[chronologicalAsc.length - 1].id
      : null;

  const deltaById = new Map<string, number>();
  for (let i = 1; i < chronologicalAsc.length; i++) {
    const delta = Number(
      (chronologicalAsc[i].weight - chronologicalAsc[i - 1].weight).toFixed(1)
    );
    deltaById.set(chronologicalAsc[i].id, delta);
  }

  const displayedEntries = sortProgressEntries(entries, sortOrder);

  function nudgeWeight(delta: number) {
    const parsed = parseFloat(weight);
    const base =
      !Number.isNaN(parsed) && parsed > 0
        ? parsed
        : latestWeight ?? 70;
    const next = Math.min(300, Math.max(2, Number((base + delta).toFixed(1))));
    onWeightChange(next.toFixed(1));
  }

  return (
    <div className="space-y-6">
      {/* Precision Logger Card */}
      <section className="relative overflow-hidden rounded-2xl bg-[#191c20]/80 backdrop-blur-xl border border-white/[0.08] p-5 sm:p-6 shadow-[0_16px_48px_rgba(0,0,0,0.4)]">
        <div className="flex items-center justify-between gap-3 mb-5">
          <div>
            <h2 className="font-display text-lg font-bold text-[#e1e2e8]">
              Log Today&apos;s Weight
            </h2>
            <p className="mt-0.5 text-xs text-[#86948a]">
              Valid range: 2–300 kg · Stored privately in your account
            </p>
          </div>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#4edea3]/10 border border-[#4edea3]/20 text-[#4edea3]">
            <PlusChartIcon />
          </span>
        </div>

        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            onLog();
          }}
          className="space-y-4"
        >
          {/* Weight Input + Steppers */}
          <div>
            <label
              htmlFor="progress-weight-input"
              className="block text-xs font-semibold uppercase tracking-wider text-[#bbcabf] mb-2"
            >
              Body Weight (kg)
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => nudgeWeight(-0.1)}
                aria-label="Decrease weight by 0.1 kg"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0b0e12]/80 border border-white/[0.08] text-sm font-bold text-[#bbcabf] hover:text-[#e1e2e8] hover:border-white/[0.16] transition-colors cursor-pointer"
              >
                -0.1
              </button>

              <div className="relative flex-1">
                <input
                  id="progress-weight-input"
                  type="number"
                  step="0.1"
                  min="2"
                  max="300"
                  value={weight}
                  onChange={(e) => onWeightChange(e.target.value)}
                  placeholder={latestWeight ? latestWeight.toFixed(1) : "74.5"}
                  className="w-full h-11 rounded-xl bg-[#0b0e12]/90 border border-white/[0.1] px-4 pr-10 text-sm font-semibold text-[#e1e2e8] placeholder-[#86948a]/70 focus:outline-none focus:border-[#4edea3]/70 focus:ring-2 focus:ring-[#4edea3]/15 transition-all"
                />
                <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-[#86948a]">
                  kg
                </span>
              </div>

              <button
                type="button"
                onClick={() => nudgeWeight(0.1)}
                aria-label="Increase weight by 0.1 kg"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0b0e12]/80 border border-white/[0.08] text-sm font-bold text-[#bbcabf] hover:text-[#e1e2e8] hover:border-white/[0.16] transition-colors cursor-pointer"
              >
                +0.1
              </button>
            </div>
          </div>

          {/* Note Input + Quick Chips */}
          <div>
            <label
              htmlFor="progress-note-input"
              className="block text-xs font-semibold uppercase tracking-wider text-[#bbcabf] mb-2"
            >
              Note <span className="text-[#86948a] font-normal">(optional)</span>
            </label>
            <input
              id="progress-note-input"
              type="text"
              maxLength={140}
              value={note}
              onChange={(e) => onNoteChange(e.target.value)}
              placeholder="e.g. Morning fasted, post-training..."
              className="w-full h-11 rounded-xl bg-[#0b0e12]/90 border border-white/[0.1] px-4 text-sm text-[#e1e2e8] placeholder-[#86948a]/70 focus:outline-none focus:border-[#4edea3]/70 focus:ring-2 focus:ring-[#4edea3]/15 transition-all"
            />
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {QUICK_NOTES.map((preset) => {
                const selected = note === preset;
                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => onNoteChange(selected ? "" : preset)}
                    className={`rounded-lg px-2.5 py-1 text-[11px] font-medium border transition-colors cursor-pointer ${
                      selected
                        ? "bg-[#4edea3]/15 border-[#4edea3]/40 text-[#4edea3]"
                        : "bg-white/[0.04] border-white/[0.07] text-[#86948a] hover:text-[#e1e2e8] hover:border-white/[0.14]"
                    }`}
                  >
                    {preset}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full h-11 rounded-xl bg-[#4edea3] hover:bg-[#6ffbbe] disabled:opacity-50 disabled:cursor-not-allowed text-[#003824] font-display text-sm font-bold shadow-[0_0_24px_rgba(78,222,163,0.22)] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {saving ? (
              <>
                <SpinnerIcon />
                <span>Saving entry...</span>
              </>
            ) : (
              <>
                <span>Log Weight</span>
                <ArrowRightIcon />
              </>
            )}
          </button>
        </form>
      </section>

      {/* Weight History Ledger */}
      <section className="rounded-2xl bg-[#191c20]/75 backdrop-blur-xl border border-white/[0.08] p-5 sm:p-6 shadow-[0_16px_48px_rgba(0,0,0,0.4)]">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <h2 className="font-display text-lg font-bold text-[#e1e2e8]">
              Weight History
            </h2>
            {!loading && entries.length > 0 && (
              <span className="rounded-full bg-white/[0.07] px-2.5 py-0.5 text-[11px] font-semibold text-[#bbcabf]">
                {entries.length}
              </span>
            )}
          </div>

          {entries.length >= 2 && (
            <button
              type="button"
              onClick={() =>
                onSortOrderChange(sortOrder === "newest" ? "oldest" : "newest")
              }
              className="inline-flex shrink-0 whitespace-nowrap items-center gap-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] px-2.5 py-1.5 text-[11px] font-semibold text-[#bbcabf] transition-colors cursor-pointer"
            >
              <SortIcon />
              <span>{sortOrder === "newest" ? "Newest first" : "Oldest first"}</span>
            </button>
          )}
        </div>

        {loading ? (
          <div className="space-y-2.5 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-16 rounded-xl bg-[#0b0e12]/55 border border-white/[0.05]"
              />
            ))}
          </div>
        ) : loadError ? (
          <div className="rounded-xl bg-[#93000a]/20 border border-[#ffb4ab]/25 p-5 text-center">
            <div className="flex justify-center mb-2 text-[#ffb4ab]">
              <ErrorAlertIcon />
            </div>
            <p className="text-sm font-semibold text-[#ffdad6]">
              Could not load weight logs
            </p>
            <p className="mt-1 text-xs text-[#ffb4ab]/85 break-words [overflow-wrap:anywhere]">
              {loadError}
            </p>
            <button
              type="button"
              onClick={onRetry}
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.14] px-3.5 py-1.5 text-xs font-semibold text-[#e1e2e8] transition-colors cursor-pointer"
            >
              <RefreshIcon />
              <span>Try again</span>
            </button>
          </div>
        ) : entries.length === 0 ? (
          <div className="rounded-xl bg-[#0b0e12]/50 border border-dashed border-white/[0.1] p-7 text-center">
            <div className="flex justify-center mb-2 text-[#86948a]">
              <ScaleIcon className="h-7 w-7" />
            </div>
            <p className="text-sm font-semibold text-[#e1e2e8]">
              No entries yet
            </p>
            <p className="mt-1 text-xs text-[#86948a]">
              Add your first weight measurement above to start tracking your progress.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
            {displayedEntries.map((entry) => {
              const delta = deltaById.get(entry.id);
              const isLatest = entry.id === latestId;
              const isOldest =
                entry.id === oldestId && entry.id !== latestId;

              return (
                <div
                  key={entry.id}
                  className="group flex items-center justify-between gap-3 rounded-xl bg-[#0b0e12]/65 hover:bg-[#0b0e12]/90 border border-white/[0.06] hover:border-white/[0.12] px-4 py-3 transition-all"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-display text-base font-bold text-[#e1e2e8]">
                        {entry.weight.toFixed(1)} kg
                      </span>

                      {delta !== undefined && (
                        <span
                          className={`rounded-md px-1.5 py-0.5 text-[11px] font-semibold ${
                            delta < 0
                              ? "bg-[#4edea3]/12 text-[#4edea3]"
                              : delta > 0
                                ? "bg-[#fbbf24]/12 text-[#fbbf24]"
                                : "bg-white/[0.06] text-[#86948a]"
                          }`}
                        >
                          {delta > 0 ? `+${delta.toFixed(1)}` : delta.toFixed(1)} kg
                        </span>
                      )}

                      {isLatest && (
                        <span className="rounded-md bg-[#4edea3]/12 border border-[#4edea3]/25 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#4edea3]">
                          Latest
                        </span>
                      )}

                      {isOldest && (
                        <span className="rounded-md bg-white/[0.06] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#86948a]">
                          Start
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-xs text-[#86948a] break-words [overflow-wrap:anywhere]">
                      {formatProgressDate(entry.date)}
                      {entry.note ? ` · ${entry.note}` : ""}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onDelete(entry.id)}
                    disabled={deletingId === entry.id}
                    aria-label={`Delete ${entry.weight.toFixed(1)} kg entry from ${formatProgressDate(entry.date)}`}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#86948a] hover:bg-[#93000a]/30 hover:text-[#ffb4ab] disabled:opacity-40 transition-colors cursor-pointer"
                  >
                    {deletingId === entry.id ? <SpinnerIcon /> : <TrashIcon />}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
