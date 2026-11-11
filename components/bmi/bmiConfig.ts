export type UnitSystem = "metric" | "imperial";

export type CategoryKey = "underweight" | "normal" | "overweight" | "obese";

export interface BmiCategory {
  key: CategoryKey;
  label: string;
  desc: string;
  color: string;
  ring: string;
  bg: string;
  badgeBg: string;
  highlightRowBg: string;
  tip: string;
}

export interface BmiRangeItem {
  key: CategoryKey;
  label: string;
  range: string;
  color: string;
  widthClass: string;
}

export const BMI_RANGES: BmiRangeItem[] = [
  {
    key: "underweight",
    label: "Underweight",
    range: "< 18.5",
    color: "bg-cyan-400",
    widthClass: "w-[28%]",
  },
  {
    key: "normal",
    label: "Normal",
    range: "18.5–25",
    color: "bg-primary",
    widthClass: "w-[22%]",
  },
  {
    key: "overweight",
    label: "Overweight",
    range: "25–30",
    color: "bg-amber-400",
    widthClass: "w-[17%]",
  },
  {
    key: "obese",
    label: "Obese",
    range: "≥ 30",
    color: "bg-rose-400",
    widthClass: "w-[33%]",
  },
];

// Preserved exact BMI category thresholds and guidance text
export function getCategory(bmi: number): BmiCategory {
  if (bmi < 18.5) {
    return {
      key: "underweight",
      label: "Underweight",
      desc: "BMI below 18.5",
      color: "text-cyan-400",
      ring: "border-cyan-400/50",
      bg: "bg-cyan-400/10",
      badgeBg: "bg-cyan-400/15 text-cyan-300",
      highlightRowBg: "bg-cyan-400/15 border border-cyan-400/30",
      tip: "Focus on a calorie surplus with high protein intake. Prioritise compound lifts to build muscle mass alongside healthy weight gain.",
    };
  }
  if (bmi < 25) {
    return {
      key: "normal",
      label: "Normal weight",
      desc: "BMI 18.5 – 24.9",
      color: "text-primary",
      ring: "border-primary/50",
      bg: "bg-primary/10",
      badgeBg: "bg-primary-container/20 text-primary",
      highlightRowBg:
        "bg-primary-container/20 border border-primary/30 shadow-[0_0_16px_rgba(16,185,129,0.12)]",
      tip: "You're in a healthy range. Maintain it with balanced nutrition and regular training. Focus on performance goals rather than weight.",
    };
  }
  if (bmi < 30) {
    return {
      key: "overweight",
      label: "Overweight",
      desc: "BMI 25 – 29.9",
      color: "text-amber-400",
      ring: "border-amber-400/50",
      bg: "bg-amber-400/10",
      badgeBg: "bg-amber-400/15 text-amber-300",
      highlightRowBg: "bg-amber-400/15 border border-amber-400/30",
      tip: "A moderate calorie deficit (300–500 kcal/day) with strength training will help. Avoid crash dieting — preserve muscle while losing fat.",
    };
  }
  return {
    key: "obese",
    label: "Obese",
    desc: "BMI 30 and above",
    color: "text-rose-400",
    ring: "border-rose-400/50",
    bg: "bg-rose-400/10",
    badgeBg: "bg-rose-500/20 text-rose-300",
    highlightRowBg: "bg-rose-500/15 border border-rose-400/30",
    tip: "Start with low-impact cardio (walking, cycling) and a moderate deficit. Consult a doctor or nutritionist for a personalised plan.",
  };
}

// Preserved exact 10–40 scale mapping
export function getNeedlePercent(bmi: number): number {
  const min = 10;
  const max = 40;
  const clamped = Math.min(Math.max(bmi, min), max);
  return ((clamped - min) / (max - min)) * 100;
}

export function buildBmiCoachUrl({
  bmi,
  categoryLabel,
  unit,
  heightCm,
  heightFt,
  heightIn,
  weight,
}: {
  bmi: number;
  categoryLabel: string;
  unit: UnitSystem;
  heightCm: string;
  heightFt: string;
  heightIn: string;
  weight: string;
}): string {
  const heightParam =
    unit === "metric" ? heightCm : `${heightFt}ft ${heightIn}in`;
  return `/coach?bmi=${bmi}&category=${encodeURIComponent(
    categoryLabel
  )}&height=${encodeURIComponent(heightParam)}&weight=${encodeURIComponent(
    weight
  )}&unit=${unit}`;
}
