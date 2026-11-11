"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRightIcon,
  ChartLineIcon,
  SparkCoachIcon,
} from "@/components/progress/ProgressIcons";
import type { Progress } from "@/lib/supabase/types";
import {
  computeProgressStats,
  filterEntriesByRange,
  formatProgressDate,
  formatShortDate,
  sortProgressEntries,
  type ProgressRange,
} from "@/components/progress/progressUtils";

interface WeightChartCardProps {
  entries: Progress[];
  loading: boolean;
  range: ProgressRange;
  onRangeChange: (range: ProgressRange) => void;
}

const RANGE_OPTIONS: { value: ProgressRange; label: string }[] = [
  { value: "7d", label: "7 Days" },
  { value: "30d", label: "30 Days" },
  { value: "all", label: "All Time" },
];

export function WeightChartCard({
  entries,
  loading,
  range,
  onRangeChange,
}: WeightChartCardProps) {
  const filteredEntries = filterEntriesByRange(entries, range);
  const chronological = sortProgressEntries(filteredEntries, "oldest");
  const rangeStats = computeProgressStats(chronological);

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const activeEntry =
    chronological.find((e) => e.id === selectedId) ??
    chronological[chronological.length - 1] ??
    null;

  // Compute SVG geometry strictly from real entries when >= 2 points exist
  const chartWidth = 720;
  const chartHeight = 260;
  const padLeft = 52;
  const padRight = 24;
  const padTop = 28;
  const padBottom = 38;
  const innerWidth = chartWidth - padLeft - padRight;
  const innerHeight = chartHeight - padTop - padBottom;

  let yMin = 0;
  let yMax = 100;
  let points: { x: number; y: number; entry: Progress }[] = [];

  if (chronological.length >= 2) {
    const weights = chronological.map((e) => e.weight);
    const rawMin = Math.min(...weights);
    const rawMax = Math.max(...weights);
    const spread = Math.max(rawMax - rawMin, 1);
    const yPadding = Math.max(spread * 0.22, 0.8);

    yMin = Math.max(0, rawMin - yPadding);
    yMax = rawMax + yPadding;
    const ySpan = Math.max(yMax - yMin, 1);

    const timestamps = chronological.map((e) => new Date(e.date).getTime());
    const validTimestamps = timestamps.every((t) => !Number.isNaN(t));
    const minTs = validTimestamps ? Math.min(...timestamps) : 0;
    const maxTs = validTimestamps ? Math.max(...timestamps) : 0;
    const tsSpan = maxTs - minTs;

    points = chronological.map((entry, idx) => {
      const ratioX =
        validTimestamps && tsSpan > 0
          ? (timestamps[idx] - minTs) / tsSpan
          : idx / (chronological.length - 1);
      const x = padLeft + ratioX * innerWidth;
      const normalizedY = (entry.weight - yMin) / ySpan;
      const y = padTop + innerHeight - normalizedY * innerHeight;
      return { x, y, entry };
    });
  }

  const linePath =
    points.length >= 2
      ? points
          .map(
            (pt, i) =>
              `${i === 0 ? "M" : "L"} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`
          )
          .join(" ")
      : "";

  const areaPath =
    points.length >= 2
      ? `${linePath} L ${points[points.length - 1].x.toFixed(1)} ${(
          padTop + innerHeight
        ).toFixed(1)} L ${points[0].x.toFixed(1)} ${(
          padTop + innerHeight
        ).toFixed(1)} Z`
      : "";

  const yTicks =
    chronological.length >= 2
      ? [yMax, (yMax + yMin) / 2, yMin].map((val) => ({
          value: val,
          y:
            padTop +
            innerHeight -
            ((val - yMin) / Math.max(yMax - yMin, 1)) * innerHeight,
        }))
      : [];

  const firstTs =
    chronological.length >= 2
      ? new Date(chronological[0].date).getTime()
      : Number.NaN;
  const lastTs =
    chronological.length >= 2
      ? new Date(chronological[chronological.length - 1].date).getTime()
      : Number.NaN;
  const hasDistinctSpan =
    !Number.isNaN(firstTs) && !Number.isNaN(lastTs) && lastTs - firstTs > 86400000;

  const xLabels =
    chronological.length >= 2
      ? hasDistinctSpan && chronological.length >= 3
        ? [
            { label: formatShortDate(chronological[0].date), x: points[0].x },
            {
              label: formatShortDate(
                new Date((firstTs + lastTs) / 2).toISOString()
              ),
              x: padLeft + innerWidth * 0.5,
            },
            {
              label: formatShortDate(
                chronological[chronological.length - 1].date
              ),
              x: points[points.length - 1].x,
            },
          ]
        : [
            { label: formatShortDate(chronological[0].date), x: points[0].x },
            {
              label: formatShortDate(
                chronological[chronological.length - 1].date
              ),
              x: points[points.length - 1].x,
            },
          ]
      : [];

  return (
    <div className="space-y-6">
      {/* Main Chart Card */}
      <section className="relative overflow-hidden rounded-2xl bg-[#191c20]/75 backdrop-blur-xl border border-white/[0.08] p-5 sm:p-7 shadow-[0_16px_48px_rgba(0,0,0,0.4)]">
        <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-[#4edea3]/[0.05] blur-3xl pointer-events-none" />

        {/* Header + Range Controls */}
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="font-display text-lg sm:text-xl font-bold text-[#e1e2e8]">
                Weight Trajectory
              </h2>
              {chronological.length > 0 && (
                <span className="inline-flex items-center rounded-full bg-[#4edea3]/10 border border-[#4edea3]/20 px-2.5 py-0.5 text-[11px] font-semibold text-[#4edea3]">
                  {chronological.length}{" "}
                  {chronological.length === 1 ? "point" : "points"}
                </span>
              )}
            </div>
            <p className="mt-1 text-xs sm:text-sm text-[#bbcabf]/80">
              {chronological.length >= 2 && rangeStats.oldest && rangeStats.latest
                ? `${formatProgressDate(rangeStats.oldest.date)} — ${formatProgressDate(rangeStats.latest.date)}`
                : "Plotted directly from your recorded weigh-ins"}
            </p>
          </div>

          <div
            className="inline-flex items-center rounded-xl bg-[#0b0e12]/80 border border-white/[0.08] p-1 self-start"
            role="group"
            aria-label="Timeframe filter"
          >
            {RANGE_OPTIONS.map((opt) => {
              const active = range === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onRangeChange(opt.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    active
                      ? "bg-[#4edea3] text-[#003824] shadow-[0_0_16px_rgba(78,222,163,0.28)]"
                      : "text-[#bbcabf] hover:text-[#e1e2e8]"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Inspection Strip (when >= 2 points) */}
        {!loading && chronological.length >= 2 && activeEntry && (
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[#0b0e12]/60 border border-white/[0.06] px-4 py-2.5 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-[#4edea3] shadow-[0_0_8px_#4edea3]" />
              <span className="font-semibold text-[#e1e2e8]">
                {activeEntry.weight.toFixed(1)} kg
              </span>
              <span className="text-[#86948a]">•</span>
              <span className="text-[#bbcabf]">
                {formatProgressDate(activeEntry.date)}
              </span>
            </div>
            {activeEntry.note ? (
              <span className="text-[#4edea3]/90 italic truncate max-w-full sm:max-w-[320px]">
                &ldquo;{activeEntry.note}&rdquo;
              </span>
            ) : (
              <span className="text-[#86948a]">
                Click any node to inspect entry
              </span>
            )}
          </div>
        )}

        {/* Chart Body */}
        {loading ? (
          <div className="h-[250px] rounded-xl bg-[#0b0e12]/50 border border-white/[0.06] p-6 flex flex-col justify-between animate-pulse">
            <div className="flex justify-between">
              <div className="h-3 w-12 rounded bg-white/[0.07]" />
              <div className="h-3 w-28 rounded bg-white/[0.06]" />
            </div>
            <div className="h-28 w-full rounded-lg bg-gradient-to-t from-[#4edea3]/[0.06] to-transparent" />
            <div className="flex justify-between">
              <div className="h-3 w-16 rounded bg-white/[0.07]" />
              <div className="h-3 w-16 rounded bg-white/[0.07]" />
              <div className="h-3 w-16 rounded bg-white/[0.07]" />
            </div>
          </div>
        ) : chronological.length === 0 ? (
          <div className="h-[250px] rounded-xl bg-[#0b0e12]/55 border border-dashed border-white/[0.12] px-6 flex flex-col items-center justify-center text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#4edea3]/10 text-[#4edea3] mb-3">
              <ChartLineIcon />
            </span>
            <p className="font-display text-base font-semibold text-[#e1e2e8]">
              {entries.length === 0
                ? "No weight history recorded yet"
                : "No entries in this date window"}
            </p>
            <p className="mt-1.5 text-xs sm:text-sm text-[#86948a] max-w-sm">
              {entries.length === 0
                ? "Log your first body weight in the panel on the right to start building your timeline."
                : "Switch back to All Time to view your earlier recorded logs."}
            </p>
            {entries.length > 0 && range !== "all" && (
              <button
                type="button"
                onClick={() => onRangeChange("all")}
                className="mt-4 rounded-lg bg-white/[0.07] hover:bg-white/[0.12] px-3.5 py-1.5 text-xs font-semibold text-[#e1e2e8] transition-colors cursor-pointer"
              >
                Show All Time
              </button>
            )}
          </div>
        ) : chronological.length === 1 ? (
          <div className="h-[250px] rounded-xl bg-[#0b0e12]/55 border border-white/[0.08] px-6 flex flex-col items-center justify-center text-center">
            <div className="inline-flex items-baseline gap-1.5 rounded-2xl bg-[#4edea3]/10 border border-[#4edea3]/25 px-5 py-3 mb-3">
              <span className="font-display text-3xl font-extrabold text-[#4edea3]">
                {chronological[0].weight.toFixed(1)}
              </span>
              <span className="text-sm font-medium text-[#bbcabf]">kg</span>
            </div>
            <p className="text-sm font-medium text-[#e1e2e8]">
              Logged on {formatProgressDate(chronological[0].date)}
              {chronological[0].note ? ` — "${chronological[0].note}"` : ""}
            </p>
            <p className="mt-1.5 text-xs text-[#86948a] max-w-sm">
              Log at least 2 entries to plot your weight trajectory curve.
            </p>
          </div>
        ) : (
          <div className="rounded-xl bg-[#0b0e12]/60 border border-white/[0.06] p-3 sm:p-4">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-auto overflow-visible select-none"
              role="img"
              aria-label="Weight trajectory line chart"
            >
              <defs>
                <linearGradient
                  id="progressAreaGrad"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#4edea3" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#4edea3" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid Lines & Y Labels */}
              {yTicks.map((tick, idx) => (
                <g key={idx}>
                  <line
                    x1={padLeft}
                    y1={tick.y}
                    x2={chartWidth - padRight}
                    y2={tick.y}
                    stroke="rgba(255,255,255,0.08)"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={padLeft - 10}
                    y={tick.y + 4}
                    textAnchor="end"
                    fill="#86948a"
                    fontSize="11"
                    fontFamily="Inter, sans-serif"
                  >
                    {tick.value.toFixed(1)}
                  </text>
                </g>
              ))}

              {/* Area Under Curve */}
              <path d={areaPath} fill="url(#progressAreaGrad)" />

              {/* Trend Line */}
              <path
                d={linePath}
                fill="none"
                stroke="#4edea3"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data Nodes */}
              {points.map((pt) => {
                const isSelected = activeEntry?.id === pt.entry.id;
                return (
                  <g
                    key={pt.entry.id}
                    className="cursor-pointer"
                    onClick={() => setSelectedId(pt.entry.id)}
                    onMouseEnter={() => setSelectedId(pt.entry.id)}
                  >
                    {isSelected && (
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={10}
                        fill="#4edea3"
                        fillOpacity={0.22}
                      />
                    )}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isSelected ? 5.5 : 4}
                      fill={isSelected ? "#6ffbbe" : "#4edea3"}
                      stroke="#0b0e12"
                      strokeWidth="2"
                    />
                  </g>
                );
              })}

              {/* X-Axis Labels */}
              {xLabels.map((lbl, idx) => (
                <text
                  key={`${lbl.label}-${idx}`}
                  x={lbl.x}
                  y={chartHeight - 10}
                  textAnchor={
                    idx === 0
                      ? "start"
                      : idx === xLabels.length - 1
                        ? "end"
                        : "middle"
                  }
                  fill="#86948a"
                  fontSize="11"
                  fontFamily="Inter, sans-serif"
                >
                  {lbl.label}
                </text>
              ))}
            </svg>
          </div>
        )}

        {/* Real Computed Summary Strip */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 border-t border-white/[0.07]">
          <div className="rounded-xl bg-[#0b0e12]/50 border border-white/[0.05] px-3.5 py-3">
            <p className="text-[11px] font-medium uppercase tracking-wider text-[#86948a]">
              Starting
            </p>
            <p className="mt-1 font-display text-base font-bold text-[#e1e2e8]">
              {rangeStats.oldest
                ? `${rangeStats.oldest.weight.toFixed(1)} kg`
                : "—"}
            </p>
          </div>

          <div className="rounded-xl bg-[#0b0e12]/50 border border-white/[0.05] px-3.5 py-3">
            <p className="text-[11px] font-medium uppercase tracking-wider text-[#86948a]">
              Lowest Logged
            </p>
            <p className="mt-1 font-display text-base font-bold text-[#4edea3]">
              {rangeStats.minWeight !== null
                ? `${rangeStats.minWeight.toFixed(1)} kg`
                : "—"}
            </p>
          </div>

          <div className="rounded-xl bg-[#0b0e12]/50 border border-white/[0.05] px-3.5 py-3">
            <p className="text-[11px] font-medium uppercase tracking-wider text-[#86948a]">
              Peak Logged
            </p>
            <p className="mt-1 font-display text-base font-bold text-[#e1e2e8]">
              {rangeStats.maxWeight !== null
                ? `${rangeStats.maxWeight.toFixed(1)} kg`
                : "—"}
            </p>
          </div>

          <div className="rounded-xl bg-[#0b0e12]/50 border border-white/[0.05] px-3.5 py-3">
            <p className="text-[11px] font-medium uppercase tracking-wider text-[#86948a]">
              Window Change
            </p>
            <p className="mt-1 font-display text-base font-bold text-[#e1e2e8]">
              {rangeStats.change !== null
                ? `${rangeStats.change > 0 ? "+" : ""}${rangeStats.change.toFixed(1)} kg`
                : "—"}
            </p>
          </div>
        </div>
      </section>

      {/* Contextual Action Card -> Relevant FitStack Tools */}
      <section className="rounded-2xl bg-gradient-to-r from-[#191c20]/90 via-[#191c20]/80 to-[#10b981]/[0.1] backdrop-blur-xl border border-white/[0.08] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#4edea3]/12 border border-[#4edea3]/25 text-[#4edea3]">
            <SparkCoachIcon />
          </span>
          <div>
            <h3 className="font-display text-base font-bold text-[#e1e2e8]">
              Need training or nutrition adjustments?
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-[#bbcabf]/80">
              Review your logged weight trend with AI Coach or update your active workout split.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Link
            href="/bmi"
            className="rounded-xl bg-white/[0.06] hover:bg-white/[0.11] border border-white/[0.08] px-3.5 py-2 text-xs font-semibold text-[#e1e2e8] transition-colors"
          >
            BMI Check
          </Link>
          <Link
            href="/coach"
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#4edea3] hover:bg-[#6ffbbe] px-4 py-2 text-xs font-bold text-[#003824] shadow-[0_0_20px_rgba(78,222,163,0.22)] transition-all"
          >
            <span>Ask AI Coach</span>
            <ArrowRightIcon />
          </Link>
        </div>
      </section>
    </div>
  );
}
