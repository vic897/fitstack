"use client";

import type { UnitSystem } from "./bmiConfig";

interface BmiInputCardProps {
  unit: UnitSystem;
  heightCm: string;
  heightFt: string;
  heightIn: string;
  weight: string;
  error: string | null;
  onChangeUnit: (nextUnit: UnitSystem) => void;
  onChangeHeightCm: (val: string) => void;
  onChangeHeightFt: (val: string) => void;
  onChangeHeightIn: (val: string) => void;
  onChangeWeight: (val: string) => void;
  onCalculate: () => void;
}

export default function BmiInputCard({
  unit,
  heightCm,
  heightFt,
  heightIn,
  weight,
  error,
  onChangeUnit,
  onChangeHeightCm,
  onChangeHeightFt,
  onChangeHeightIn,
  onChangeWeight,
  onCalculate,
}: BmiInputCardProps) {
  const metricHeightVal = Math.min(
    250,
    Math.max(50, parseFloat(heightCm) || 175)
  );
  const weightSliderMin = unit === "metric" ? 20 : 44;
  const weightSliderMax = unit === "metric" ? 300 : 660;
  const defaultWeightNum = unit === "metric" ? 70 : 154;
  const weightSliderVal = Math.min(
    weightSliderMax,
    Math.max(weightSliderMin, parseFloat(weight) || defaultWeightNum)
  );

  function stepMetricHeight(delta: number) {
    const base = parseFloat(heightCm) || 175;
    const next = Math.min(250, Math.max(50, base + delta));
    onChangeHeightCm(String(next));
  }

  function stepWeight(delta: number) {
    const base = parseFloat(weight) || defaultWeightNum;
    const next = Math.min(
      weightSliderMax,
      Math.max(weightSliderMin, Math.round((base + delta) * 10) / 10)
    );
    onChangeWeight(String(next));
  }

  return (
    <div className="relative flex flex-col gap-space-lg overflow-hidden rounded-2xl border border-outline-variant/25 bg-surface-container-low/90 p-space-lg shadow-xl backdrop-blur-xl">
      {/* Header & Unit Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-space-sm">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container-high text-primary">
            <span className="material-symbols-outlined text-[20px]">
              straighten
            </span>
          </div>
          <div>
            <h2 className="font-title-lg text-title-lg font-bold text-on-surface">
              Measurements
            </h2>
            <p className="font-label-md text-label-md text-on-surface-variant">
              Enter height and weight
            </p>
          </div>
        </div>

        {/* Unit Toggle */}
        <div
          role="group"
          aria-label="Measurement system"
          className="flex items-center rounded-full border border-outline-variant/25 bg-surface-container-lowest p-1 shadow-inner"
        >
          {(["metric", "imperial"] as const).map((u) => {
            const active = unit === u;
            return (
              <button
                key={u}
                type="button"
                data-unit-toggle={u}
                aria-pressed={active}
                onClick={() => onChangeUnit(u)}
                className={`rounded-full px-3.5 py-1.5 font-label-md text-label-md font-semibold capitalize transition-all ${
                  active
                    ? "bg-primary-container text-on-primary-container shadow-md"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {u === "metric" ? "Metric (cm / kg)" : "Imperial (ft+in / lbs)"}
              </button>
            );
          })}
        </div>
      </div>

      {/* Form */}
      <form
        id="bmi-form"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          onCalculate();
        }}
        className="flex flex-col gap-space-md"
      >
        {/* Height Box */}
        <div className="flex flex-col gap-space-sm rounded-xl border border-outline-variant/20 bg-surface-container/60 p-space-md">
          <div className="flex items-center justify-between">
            <label
              htmlFor={unit === "metric" ? "bmi-height-cm" : "bmi-height-ft"}
              className="flex items-center gap-1.5 font-label-md text-label-md font-semibold uppercase tracking-wider text-on-surface"
            >
              <span className="material-symbols-outlined text-[16px] text-primary">
                height
              </span>
              Height
            </label>
            <span className="rounded bg-surface-container-high px-2 py-0.5 font-label-sm text-label-sm font-bold text-primary">
              {unit === "metric" ? "cm" : "ft / in"}
            </span>
          </div>

          {unit === "metric" ? (
            <>
              <div className="flex items-center gap-space-sm">
                <div className="relative flex-1">
                  <input
                    id="bmi-height-cm"
                    type="number"
                    inputMode="decimal"
                    value={heightCm}
                    onChange={(e) => onChangeHeightCm(e.target.value)}
                    placeholder="175"
                    min={50}
                    max={250}
                    className="w-full rounded-xl border border-outline-variant/20 bg-surface-container-lowest px-4 py-2.5 font-stat-display text-stat-display text-on-surface shadow-inner outline-none transition placeholder:text-on-surface-variant/40 focus:border-primary focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    aria-label="Increase height"
                    onClick={() => stepMetricHeight(1)}
                    className="flex h-6 w-8 items-center justify-center rounded bg-surface-container-high text-on-surface transition-colors hover:bg-surface-bright"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      expand_less
                    </span>
                  </button>
                  <button
                    type="button"
                    aria-label="Decrease height"
                    onClick={() => stepMetricHeight(-1)}
                    className="flex h-6 w-8 items-center justify-center rounded bg-surface-container-high text-on-surface transition-colors hover:bg-surface-bright"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      expand_more
                    </span>
                  </button>
                </div>
              </div>

              <input
                type="range"
                aria-label="Height in centimetres slider"
                min={50}
                max={250}
                value={metricHeightVal}
                onChange={(e) => onChangeHeightCm(e.target.value)}
                className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-surface-container-highest accent-primary"
              />
              <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
                <span>Valid range: 50 – 250 cm</span>
                <span>{heightCm ? `${heightCm} cm` : "e.g. 175 cm"}</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <div className="relative flex flex-1 items-center gap-2">
                  <input
                    id="bmi-height-ft"
                    type="number"
                    inputMode="numeric"
                    value={heightFt}
                    onChange={(e) => onChangeHeightFt(e.target.value)}
                    placeholder="5"
                    min={1}
                    max={8}
                    className="w-full rounded-xl border border-outline-variant/20 bg-surface-container-lowest px-3 py-2.5 pr-9 font-stat-display text-stat-display text-on-surface shadow-inner outline-none transition placeholder:text-on-surface-variant/40 focus:border-primary focus:ring-2 focus:ring-primary/30"
                  />
                  <span className="pointer-events-none absolute right-3 font-label-md text-label-md font-semibold text-on-surface-variant">
                    ft
                  </span>
                </div>
                <div className="relative flex flex-1 items-center gap-2">
                  <input
                    id="bmi-height-in"
                    type="number"
                    inputMode="numeric"
                    aria-label="Height inches"
                    value={heightIn}
                    onChange={(e) => onChangeHeightIn(e.target.value)}
                    placeholder="9"
                    min={0}
                    max={11}
                    className="w-full rounded-xl border border-outline-variant/20 bg-surface-container-lowest px-3 py-2.5 pr-9 font-stat-display text-stat-display text-on-surface shadow-inner outline-none transition placeholder:text-on-surface-variant/40 focus:border-primary focus:ring-2 focus:ring-primary/30"
                  />
                  <span className="pointer-events-none absolute right-3 font-label-md text-label-md font-semibold text-on-surface-variant">
                    in
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
                <span>Feet &amp; inches (valid metric equiv: 50–250 cm)</span>
              </div>
            </>
          )}
        </div>

        {/* Weight Box */}
        <div className="flex flex-col gap-space-sm rounded-xl border border-outline-variant/20 bg-surface-container/60 p-space-md">
          <div className="flex items-center justify-between">
            <label
              htmlFor="bmi-weight-input"
              className="flex items-center gap-1.5 font-label-md text-label-md font-semibold uppercase tracking-wider text-on-surface"
            >
              <span className="material-symbols-outlined text-[16px] text-primary">
                fitness_center
              </span>
              Weight
            </label>
            <span className="rounded bg-surface-container-high px-2 py-0.5 font-label-sm text-label-sm font-bold text-primary">
              {unit === "metric" ? "kg" : "lbs"}
            </span>
          </div>

          <div className="flex items-center gap-space-sm">
            <div className="relative flex-1">
              <input
                id="bmi-weight-input"
                type="number"
                inputMode="decimal"
                value={weight}
                onChange={(e) => onChangeWeight(e.target.value)}
                placeholder={unit === "metric" ? "70" : "154"}
                min={weightSliderMin}
                max={weightSliderMax}
                className="w-full rounded-xl border border-outline-variant/20 bg-surface-container-lowest px-4 py-2.5 font-stat-display text-stat-display text-on-surface shadow-inner outline-none transition placeholder:text-on-surface-variant/40 focus:border-primary focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div className="flex flex-col gap-1">
              <button
                type="button"
                aria-label="Increase weight"
                onClick={() => stepWeight(unit === "metric" ? 0.5 : 1)}
                className="flex h-6 w-8 items-center justify-center rounded bg-surface-container-high text-on-surface transition-colors hover:bg-surface-bright"
              >
                <span className="material-symbols-outlined text-[16px]">
                  expand_less
                </span>
              </button>
              <button
                type="button"
                aria-label="Decrease weight"
                onClick={() => stepWeight(unit === "metric" ? -0.5 : -1)}
                className="flex h-6 w-8 items-center justify-center rounded bg-surface-container-high text-on-surface transition-colors hover:bg-surface-bright"
              >
                <span className="material-symbols-outlined text-[16px]">
                  expand_more
                </span>
              </button>
            </div>
          </div>

          <input
            type="range"
            aria-label="Weight slider"
            min={weightSliderMin}
            max={weightSliderMax}
            value={weightSliderVal}
            onChange={(e) => onChangeWeight(e.target.value)}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-surface-container-highest accent-primary"
          />
          <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
            <span>
              Valid range:{" "}
              {unit === "metric" ? "20 – 300 kg" : "44 – 660 lbs"}
            </span>
            <span>
              {weight
                ? `${weight} ${unit === "metric" ? "kg" : "lbs"}`
                : `e.g. ${defaultWeightNum} ${unit === "metric" ? "kg" : "lbs"}`}
            </span>
          </div>
        </div>

        {/* Validation Error */}
        {error && (
          <div
            id="bmi-error-alert"
            role="alert"
            className="flex items-center gap-2 rounded-xl border border-error/35 bg-error-container/25 px-4 py-2.5 font-body-md text-body-md text-error"
          >
            <span className="material-symbols-outlined text-[18px]">
              error_outline
            </span>
            <span>{error}</span>
          </div>
        )}

        {/* Calculate Button */}
        <button
          id="calculate-bmi-btn"
          type="submit"
          className="mt-space-xs flex w-full items-center justify-center gap-2 rounded-full bg-primary-container px-6 py-3.5 font-title-lg text-title-lg font-bold text-on-primary-container shadow-[0_0_24px_rgba(16,185,129,0.35)] transition-all hover:bg-primary active:scale-[0.99]"
        >
          <span>Calculate BMI</span>
          <span className="material-symbols-outlined text-[20px] font-bold">
            arrow_forward
          </span>
        </button>
      </form>
    </div>
  );
}
