"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";

// ── BMI logic ──────────────────────────────────────────────────
type Category = {
  label: string;
  desc: string;
  color: string;
  ring: string;
  bg: string;
  tip: string;
};

function getCategory(bmi: number): Category {
  if (bmi < 18.5) return {
    label: "Underweight",
    desc: "BMI below 18.5",
    color: "text-blue-400",
    ring: "border-blue-400",
    bg: "bg-blue-400/10",
    tip: "Focus on a calorie surplus with high protein intake. Prioritise compound lifts to build muscle mass alongside healthy weight gain.",
  };
  if (bmi < 25) return {
    label: "Normal weight",
    desc: "BMI 18.5 – 24.9",
    color: "text-green-400",
    ring: "border-green-400",
    bg: "bg-green-400/10",
    tip: "You're in a healthy range. Maintain it with balanced nutrition and regular training. Focus on performance goals rather than weight.",
  };
  if (bmi < 30) return {
    label: "Overweight",
    desc: "BMI 25 – 29.9",
    color: "text-yellow-400",
    ring: "border-yellow-400",
    bg: "bg-yellow-400/10",
    tip: "A moderate calorie deficit (300–500 kcal/day) with strength training will help. Avoid crash dieting — preserve muscle while losing fat.",
  };
  return {
    label: "Obese",
    desc: "BMI 30 and above",
    color: "text-red-400",
    ring: "border-red-400",
    bg: "bg-red-400/10",
    tip: "Start with low-impact cardio (walking, cycling) and a moderate deficit. Consult a doctor or nutritionist for a personalised plan.",
  };
}

// Position the needle on a 0–100 scale (BMI 10–40 range)
function getNeedlePercent(bmi: number): number {
  const min = 10;
  const max = 40;
  const clamped = Math.min(Math.max(bmi, min), max);
  return ((clamped - min) / (max - min)) * 100;
}

const BMI_RANGES = [
  { label: "Underweight", range: "< 18.5", color: "bg-blue-400",   width: "w-[28%]" },
  { label: "Normal",      range: "18.5–25", color: "bg-green-400", width: "w-[22%]" },
  { label: "Overweight",  range: "25–30",  color: "bg-yellow-400", width: "w-[17%]" },
  { label: "Obese",       range: "≥ 30",   color: "bg-red-400",    width: "w-[33%]" },
];

export default function BmiPage() {
  const [unit, setUnit]         = useState<"metric" | "imperial">("metric");
  const [heightCm, setHeightCm] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [weight, setWeight]     = useState("");
  const [bmi, setBmi]           = useState<number | null>(null);
  const [error, setError]       = useState<string | null>(null);

  function calculate() {
    setError(null);
    setBmi(null);

    let heightM = 0;
    let weightKg = 0;

    if (unit === "metric") {
      heightM = parseFloat(heightCm) / 100;
      weightKg = parseFloat(weight);
    } else {
      const ft = parseFloat(heightFt) || 0;
      const inches = parseFloat(heightIn) || 0;
      const totalInches = ft * 12 + inches;
      heightM = totalInches * 0.0254;
      weightKg = parseFloat(weight) * 0.453592;
    }

    if (!heightM || heightM < 0.5 || heightM > 2.5) {
      setError("Enter a valid height.");
      return;
    }
    if (!weightKg || weightKg < 20 || weightKg > 300) {
      setError("Enter a valid weight.");
      return;
    }

    const result = weightKg / (heightM * heightM);
    setBmi(Math.round(result * 10) / 10);
  }

  function reset() {
    setBmi(null);
    setError(null);
    setHeightCm("");
    setHeightFt("");
    setHeightIn("");
    setWeight("");
  }

  const category = bmi !== null ? getCategory(bmi) : null;
  const needlePercent = bmi !== null ? getNeedlePercent(bmi) : null;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      <div className="mx-auto max-w-2xl px-6 pt-28 pb-24">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-black tracking-tight md:text-5xl">
            BMI <span className="text-green-400">Calculator</span>
          </h1>
          <p className="mt-2 text-gray-400">
            Body Mass Index — a simple indicator of healthy weight range.
          </p>
        </div>

        {/* Unit toggle */}
        <div className="mb-8 flex gap-1 self-start rounded-xl border border-white/10 bg-white/5 p-1">
          {(["metric", "imperial"] as const).map((u) => (
            <button
              key={u}
              onClick={() => { setUnit(u); reset(); }}
              className={`rounded-lg px-5 py-2 text-sm font-semibold capitalize transition-all ${
                unit === u
                  ? "bg-green-400 text-gray-950"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {u}
            </button>
          ))}
        </div>

        {/* Input form */}
        <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="mb-5 grid gap-4 sm:grid-cols-2">
            {/* Height */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">
                Height
              </label>
              {unit === "metric" ? (
                <div className="relative">
                  <input
                    type="number"
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value)}
                    placeholder="175"
                    min={50}
                    max={250}
                    className="w-full rounded-xl border border-white/10 bg-gray-950 px-4 py-3 pr-12 text-sm text-white placeholder-gray-500 outline-none transition focus:border-green-400/50 focus:ring-1 focus:ring-green-400/20"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                    cm
                  </span>
                </div>
              ) : (
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      value={heightFt}
                      onChange={(e) => setHeightFt(e.target.value)}
                      placeholder="5"
                      min={1}
                      max={8}
                      className="w-full rounded-xl border border-white/10 bg-gray-950 px-4 py-3 pr-10 text-sm text-white placeholder-gray-500 outline-none transition focus:border-green-400/50 focus:ring-1 focus:ring-green-400/20"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                      ft
                    </span>
                  </div>
                  <div className="relative flex-1">
                    <input
                      type="number"
                      value={heightIn}
                      onChange={(e) => setHeightIn(e.target.value)}
                      placeholder="9"
                      min={0}
                      max={11}
                      className="w-full rounded-xl border border-white/10 bg-gray-950 px-4 py-3 pr-10 text-sm text-white placeholder-gray-500 outline-none transition focus:border-green-400/50 focus:ring-1 focus:ring-green-400/20"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                      in
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Weight */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">
                Weight
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder={unit === "metric" ? "70" : "154"}
                  min={unit === "metric" ? 20 : 44}
                  max={unit === "metric" ? 300 : 660}
                  className="w-full rounded-xl border border-white/10 bg-gray-950 px-4 py-3 pr-12 text-sm text-white placeholder-gray-500 outline-none transition focus:border-green-400/50 focus:ring-1 focus:ring-green-400/20"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                  {unit === "metric" ? "kg" : "lbs"}
                </span>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="mb-4 text-sm text-red-400">{error}</p>
          )}

          <button
            onClick={calculate}
            className="w-full rounded-full bg-green-400 py-3 text-sm font-bold text-gray-950 transition-opacity hover:opacity-90"
          >
            Calculate BMI →
          </button>
        </div>

        {/* Result */}
        {bmi !== null && category !== null && (
          <div className="space-y-6">
            {/* Score card */}
            <div className={`rounded-2xl border p-8 text-center ${category.ring} ${category.bg}`}>
              <div className={`text-7xl font-black ${category.color}`}>
                {bmi}
              </div>
              <div className={`mt-2 text-xl font-bold ${category.color}`}>
                {category.label}
              </div>
              <div className="mt-1 text-sm text-gray-400">
                {category.desc}
              </div>
            </div>

            {/* Visual gauge */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="mb-4 text-sm font-semibold text-gray-400">
                Where you sit on the scale
              </p>

              {/* Colour bar */}
              <div className="relative mb-6">
                <div className="flex h-3 overflow-hidden rounded-full">
                  <div className="bg-blue-400 w-[28%]" />
                  <div className="bg-green-400 w-[22%]" />
                  <div className="bg-yellow-400 w-[17%]" />
                  <div className="bg-red-400 flex-1" />
                </div>

                {/* Needle */}
                {needlePercent !== null && (
                  <div
                    className="absolute -top-1 flex flex-col items-center"
                    style={{ left: `${needlePercent}%`, transform: "translateX(-50%)" }}
                  >
                    <div className="h-5 w-0.5 bg-white" />
                    <div className="h-2 w-2 rounded-full bg-white" />
                  </div>
                )}
              </div>

              {/* Labels */}
              <div className="grid grid-cols-4 gap-1 text-center">
                {BMI_RANGES.map((r) => (
                  <div key={r.label}>
                    <div className={`mx-auto mb-1 h-2 w-2 rounded-full ${r.color}`} />
                    <div className="text-xs font-semibold text-gray-300">
                      {r.label}
                    </div>
                    <div className="text-xs text-gray-600">{r.range}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Coach tip */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="mb-2 text-sm font-bold text-green-400">
                💡 What this means for you
              </p>
              <p className="text-sm leading-relaxed text-gray-300">
                {category.tip}
              </p>
            </div>

            {/* BMI context note */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="mb-3 text-sm font-bold text-gray-300">
                📊 Healthy BMI ranges by category
              </p>
              <div className="space-y-2">
                {BMI_RANGES.map((r) => (
                  <div
                    key={r.label}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${r.color}`} />
                      <span className="text-gray-300">{r.label}</span>
                    </div>
                    <span className="font-semibold text-gray-400">
                      {r.range}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA row */}
            <div className="grid gap-3 sm:grid-cols-2">
              <a
                href={`/coach?bmi=${bmi}&category=${encodeURIComponent(category.label)}&height=${unit === "metric" ? heightCm : `${heightFt}ft ${heightIn}in`}&weight=${weight}&unit=${unit}`}
                className="flex items-center justify-center gap-2 rounded-2xl border border-green-400/20 bg-green-400/5 px-5 py-4 text-sm font-semibold text-green-400 transition-colors hover:bg-green-400/10"
                >
                🤖 Ask the AI Coach about your BMI
              </a>
              <a
                href="/diet"
                className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-semibold text-gray-300 transition-colors hover:border-white/20"
              >
                🥗 View diet plan for your goal
              </a>
            </div>

            {/* Recalculate */}
            <button
              onClick={reset}
              className="w-full rounded-full border border-white/10 py-3 text-sm font-semibold text-gray-400 transition-colors hover:border-green-400/40 hover:text-green-400"
            >
              ← Recalculate
            </button>

            {/* Disclaimer */}
            <p className="text-center text-xs text-gray-600">
              BMI is a general screening tool, not a medical diagnosis. It does
              not account for muscle mass, bone density, or body composition.
              Consult a healthcare professional for personalised advice.
            </p>
          </div>
        )}

        {/* Info section — always visible before result */}
        {bmi === null && (
          <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="mb-4 text-sm font-bold text-gray-300">
              📊 BMI ranges at a glance
            </p>
            <div className="space-y-3">
              {BMI_RANGES.map((r) => (
                <div
                  key={r.label}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-2.5 w-2.5 rounded-full ${r.color}`} />
                    <span className="text-gray-300">{r.label}</span>
                  </div>
                  <span className="font-semibold text-gray-400">{r.range}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}