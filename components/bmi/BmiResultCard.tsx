"use client";

import Link from "next/link";
import {
  BMI_RANGES,
  buildBmiCoachUrl,
  getNeedlePercent,
  type BmiCategory,
  type UnitSystem,
} from "./bmiConfig";

interface BmiResultCardProps {
  bmi: number | null;
  category: BmiCategory | null;
  unit: UnitSystem;
  heightCm: string;
  heightFt: string;
  heightIn: string;
  weight: string;
  onReset: () => void;
}

export default function BmiResultCard({
  bmi,
  category,
  unit,
  heightCm,
  heightFt,
  heightIn,
  weight,
  onReset,
}: BmiResultCardProps) {
  // Pre-calculation empty state balancing the 2-column desktop card grid
  if (bmi === null || category === null) {
    return (
      <div
        id="bmi-empty-panel"
        className="flex h-full flex-col justify-between gap-space-lg rounded-2xl border border-dashed border-outline-variant/40 bg-surface-container/60 p-space-lg shadow-xl backdrop-blur-xl"
      >
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-container-high text-primary shadow-md">
            <span className="material-symbols-outlined text-[28px]">
              monitor_weight
            </span>
          </div>
          <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
            Your BMI Assessment
          </h2>
          <p className="mt-2 max-w-md font-body-md text-body-md leading-relaxed text-on-surface-variant">
            Enter your height and weight on the left and click{" "}
            <strong className="font-semibold text-on-surface">
              Calculate BMI
            </strong>{" "}
            to see your calculated score, scale position, and guidance.
          </p>
        </div>

        {/* Scale Preview */}
        <div className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest/75 p-space-md">
          <div className="mb-3 flex items-center justify-between font-label-sm text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">
            <span>BMI Spectrum Scale</span>
            <span>Range 10 – 40</span>
          </div>
          <div className="flex h-3 overflow-hidden rounded-full bg-surface-container-highest">
            <div className="w-[28%] bg-cyan-400/75" />
            <div className="w-[22%] bg-primary/75" />
            <div className="w-[17%] bg-amber-400/75" />
            <div className="flex-1 bg-rose-400/75" />
          </div>
          <div className="mt-3 grid grid-cols-4 gap-1 text-center">
            {BMI_RANGES.map((r) => (
              <div key={r.key}>
                <div className="font-label-sm text-label-sm font-semibold text-on-surface">
                  {r.label}
                </div>
                <div className="font-label-sm text-label-sm text-outline">
                  {r.range}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const needlePercent = getNeedlePercent(bmi);
  const coachUrl = buildBmiCoachUrl({
    bmi,
    categoryLabel: category.label,
    unit,
    heightCm,
    heightFt,
    heightIn,
    weight,
  });

  return (
    <div
      id="bmi-result-panel"
      className="relative flex flex-col gap-space-lg overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container/90 p-space-lg shadow-2xl backdrop-blur-xl"
    >
      {/* Result Status Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="inline-flex items-center gap-2 rounded-full bg-surface-container-high px-3 py-1">
          <span className="h-2 w-2 rounded-full bg-primary" />
          <span className="font-label-sm text-label-sm font-bold uppercase tracking-wider text-primary">
            Calculated Result: {category.label}
          </span>
        </div>
        <button
          id="bmi-recalculate-btn"
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1 rounded-full border border-outline-variant/35 px-3 py-1 font-label-md text-label-md font-medium text-on-surface-variant transition-colors hover:border-primary/40 hover:text-primary"
        >
          <span className="material-symbols-outlined text-[15px]">
            refresh
          </span>
          <span>Recalculate</span>
        </button>
      </div>

      {/* Big Score & Category Summary */}
      <div
        className={`rounded-2xl border p-6 text-center ${category.ring} ${category.bg}`}
      >
        <div
          id="bmi-score-value"
          className={`font-headline-xl text-[64px] leading-none font-black tracking-tight ${category.color}`}
        >
          {bmi}
        </div>
        <div
          id="bmi-category-label"
          className={`mt-2 font-headline-md text-headline-md font-bold ${category.color}`}
        >
          {category.label}
        </div>
        <div className="mt-1 font-body-md text-body-md text-on-surface-variant">
          {category.desc}
        </div>
      </div>

      {/* Visual Gauge */}
      <div className="flex flex-col gap-3 rounded-xl border border-outline-variant/20 bg-surface-container-lowest/65 p-space-md">
        <div className="flex items-center justify-between font-label-sm text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">
          <span>Where you sit on the scale</span>
          <span className="font-mono text-on-surface">BMI {bmi}</span>
        </div>

        <div className="relative py-3">
          <div className="flex h-3 overflow-hidden rounded-full bg-surface-container-highest shadow-inner">
            <div className="h-full w-[28%] bg-cyan-400" />
            <div className="h-full w-[22%] bg-primary" />
            <div className="h-full w-[17%] bg-amber-400" />
            <div className="h-full flex-1 bg-rose-400" />
          </div>

          {/* Dynamic Needle Marker */}
          <div
            id="bmi-gauge-needle"
            className="pointer-events-none absolute -top-0.5 flex flex-col items-center transition-all duration-300"
            style={{
              left: `${needlePercent}%`,
              transform: "translateX(-50%)",
            }}
          >
            <div className="mb-0.5 rounded-full bg-on-surface px-2 py-0.5 font-label-sm text-label-sm font-bold text-surface-container-lowest shadow">
              {bmi}
            </div>
            <div className="h-4 w-0.5 bg-on-surface" />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-1 text-center">
          {BMI_RANGES.map((r) => (
            <div key={r.key}>
              <div
                className={`mx-auto mb-1 h-2 w-2 rounded-full ${r.color}`}
              />
              <div className="font-label-sm text-label-sm font-semibold text-on-surface">
                {r.label}
              </div>
              <div className="font-label-sm text-label-sm text-outline">
                {r.range}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Tip Box */}
      <div className="rounded-xl border border-outline-variant/20 bg-surface-container-low/80 p-space-md">
        <p className="mb-1.5 flex items-center gap-1.5 font-label-md text-label-md font-bold text-primary">
          <span className="material-symbols-outlined text-[18px]">
            lightbulb
          </span>
          <span>What this means for you</span>
        </p>
        <p className="font-body-md text-body-md leading-relaxed text-on-surface-variant">
          {category.tip}
        </p>
      </div>

      {/* CTA Row */}
      <div className="grid gap-3 sm:grid-cols-2">
        <Link
          id="bmi-ask-coach-link"
          href={coachUrl}
          className="flex items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3.5 text-center font-label-md text-label-md font-semibold text-primary transition-colors hover:bg-primary/20"
        >
          <span className="material-symbols-outlined text-[18px]">
            smart_toy
          </span>
          <span>Ask AI Coach about your BMI</span>
        </Link>
        <Link
          href="/diet"
          className="flex items-center justify-center gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-high px-4 py-3.5 text-center font-label-md text-label-md font-semibold text-on-surface transition-colors hover:border-outline/50 hover:bg-surface-bright"
        >
          <span className="material-symbols-outlined text-[18px] text-primary">
            restaurant
          </span>
          <span>View diet plan for your goal</span>
        </Link>
      </div>

      {/* Disclaimer */}
      <p className="text-center font-label-md text-label-md text-outline">
        BMI is a general screening tool, not a medical diagnosis. It does not
        account for muscle mass, bone density, or body composition. Consult a
        healthcare professional for personalised advice.
      </p>
    </div>
  );
}
