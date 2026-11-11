"use client";

import {
  CalendarIcon,
  ScaleIcon,
  TrendDownIcon,
  TrendFlatIcon,
  TrendUpIcon,
} from "@/components/progress/ProgressIcons";
import {
  formatProgressDate,
  type ProgressStats,
} from "@/components/progress/progressUtils";

interface ProgressSummaryCardsProps {
  stats: ProgressStats;
  loading: boolean;
}

export function ProgressSummaryCards({
  stats,
  loading,
}: ProgressSummaryCardsProps) {
  const { latest, oldest, minWeight, maxWeight, change, count } = stats;

  const hasEntries = count > 0;
  const hasChange = change !== null;
  const isGain = change !== null && change > 0;
  const isLoss = change !== null && change < 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {/* Card 1: Current Weight */}
      <div className="relative overflow-hidden rounded-2xl bg-[#191c20]/75 backdrop-blur-xl border border-white/[0.08] p-5 sm:p-6 shadow-[0_12px_36px_rgba(0,0,0,0.35)]">
        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[#4edea3]/[0.06] blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between gap-3 mb-3">
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#86948a]">
            Current Weight
          </span>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#4edea3]/10 text-[#4edea3]">
            <ScaleIcon />
          </span>
        </div>

        {loading ? (
          <div className="space-y-2.5 animate-pulse">
            <div className="h-9 w-28 rounded-lg bg-white/[0.07]" />
            <div className="h-4 w-36 rounded bg-white/[0.05]" />
          </div>
        ) : (
          <>
            <div className="flex items-baseline gap-1.5">
              <span className="font-display text-3xl sm:text-[34px] font-extrabold tracking-tight text-[#e1e2e8]">
                {latest ? latest.weight.toFixed(1) : "—"}
              </span>
              {latest && (
                <span className="text-sm font-medium text-[#86948a]">kg</span>
              )}
            </div>
            <p className="mt-2 text-xs text-[#bbcabf]/80 truncate">
              {latest
                ? `Latest log · ${formatProgressDate(latest.date)}`
                : "Log your first weigh-in to begin"}
            </p>
          </>
        )}
      </div>

      {/* Card 2: Total Change */}
      <div className="relative overflow-hidden rounded-2xl bg-[#191c20]/75 backdrop-blur-xl border border-white/[0.08] p-5 sm:p-6 shadow-[0_12px_36px_rgba(0,0,0,0.35)]">
        <div className="flex items-center justify-between gap-3 mb-3">
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#86948a]">
            Net Change
          </span>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.05] text-[#bbcabf]">
            {isLoss ? (
              <TrendDownIcon />
            ) : isGain ? (
              <TrendUpIcon />
            ) : (
              <TrendFlatIcon />
            )}
          </span>
        </div>

        {loading ? (
          <div className="space-y-2.5 animate-pulse">
            <div className="h-9 w-24 rounded-lg bg-white/[0.07]" />
            <div className="h-4 w-40 rounded bg-white/[0.05]" />
          </div>
        ) : (
          <>
            <div className="flex items-baseline gap-1.5">
              <span
                className={`font-display text-3xl sm:text-[34px] font-extrabold tracking-tight ${
                  !hasChange
                    ? "text-[#e1e2e8]"
                    : isLoss
                      ? "text-[#4edea3]"
                      : isGain
                        ? "text-[#fbbf24]"
                        : "text-[#e1e2e8]"
                }`}
              >
                {hasChange
                  ? `${change > 0 ? "+" : ""}${change.toFixed(1)}`
                  : "—"}
              </span>
              {hasChange && (
                <span className="text-sm font-medium text-[#86948a]">kg</span>
              )}
            </div>
            <p className="mt-2 text-xs text-[#bbcabf]/80 truncate">
              {hasChange && oldest && latest
                ? `From ${oldest.weight.toFixed(1)} kg on ${formatProgressDate(oldest.date)}`
                : count === 1
                  ? "Log 1 more entry to compute trend"
                  : "Requires at least 2 entries"}
            </p>
          </>
        )}
      </div>

      {/* Card 3: Recorded Entries */}
      <div className="relative overflow-hidden rounded-2xl bg-[#191c20]/75 backdrop-blur-xl border border-white/[0.08] p-5 sm:p-6 shadow-[0_12px_36px_rgba(0,0,0,0.35)]">
        <div className="flex items-center justify-between gap-3 mb-3">
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#86948a]">
            Entries Logged
          </span>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.05] text-[#bbcabf]">
            <CalendarIcon />
          </span>
        </div>

        {loading ? (
          <div className="space-y-2.5 animate-pulse">
            <div className="h-9 w-20 rounded-lg bg-white/[0.07]" />
            <div className="h-4 w-36 rounded bg-white/[0.05]" />
          </div>
        ) : (
          <>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-3xl sm:text-[34px] font-extrabold tracking-tight text-[#e1e2e8]">
                {count}
              </span>
              <span className="text-sm font-medium text-[#86948a]">
                {count === 1 ? "log" : "logs"}
              </span>
            </div>
            <p className="mt-2 text-xs text-[#bbcabf]/80 truncate">
              {hasEntries && minWeight !== null && maxWeight !== null
                ? `Range: ${minWeight.toFixed(1)} – ${maxWeight.toFixed(1)} kg`
                : "Synced to your private profile"}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
