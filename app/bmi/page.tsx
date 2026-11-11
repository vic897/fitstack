"use client";

import Link from "next/link";
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  buildBmiCoachUrl,
  getCategory,
  type UnitSystem,
} from "@/components/bmi/bmiConfig";
import BmiInputCard from "@/components/bmi/BmiInputCard";
import BmiResultCard from "@/components/bmi/BmiResultCard";
import BmiInfoSection from "@/components/bmi/BmiInfoSection";

export default function BmiPage() {
  const [unit, setUnit] = useState<UnitSystem>("metric");
  const [heightCm, setHeightCm] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  function handleUnitChange(nextUnit: UnitSystem) {
    setUnit(nextUnit);
    reset();
  }

  const category = bmi !== null ? getCategory(bmi) : null;
  const coachCtaHref =
    bmi !== null && category
      ? buildBmiCoachUrl({
          bmi,
          categoryLabel: category.label,
          unit,
          heightCm,
          heightFt,
          heightIn,
          weight,
        })
      : "/coach";

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-clip bg-surface-container-lowest text-on-surface">
      <Navbar />

      {/* Ambient Atmospheric Backlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        <div className="absolute -top-32 left-1/2 h-[340px] w-[720px] -translate-x-1/2 rounded-full bg-primary/10 blur-[128px]" />
        <div className="absolute -left-32 top-96 h-80 w-80 rounded-full bg-secondary-container/10 blur-[96px]" />
        <div className="absolute -right-32 top-[560px] h-96 w-96 rounded-full bg-primary-container/10 blur-[110px]" />
      </div>

      <main className="relative z-10 w-full flex-1 pt-16">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-space-xl px-margin-mobile py-space-xl sm:px-margin">
          {/* Hero Header */}
          <section className="mx-auto flex max-w-4xl flex-col items-center text-center">
            <div className="mb-space-md inline-flex items-center gap-2 rounded-full border border-outline-variant/25 bg-surface-container/75 px-3.5 py-1.5 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              <span className="font-label-sm text-label-sm font-bold uppercase tracking-wider text-primary">
                Body Mass Index Screening • FitStack 2.0
              </span>
            </div>

            <h1 className="mb-space-sm font-headline-xl text-headline-xl-mobile tracking-tight text-on-surface sm:text-headline-xl">
              BMI{" "}
              <span className="bg-gradient-to-r from-primary via-secondary to-tertiary bg-clip-text text-transparent">
                Calculator
              </span>
            </h1>

            <p className="max-w-2xl font-body-lg text-body-lg leading-relaxed text-on-surface-variant">
              Body Mass Index — a simple screening indicator of healthy weight
              range comparing mass and height.
            </p>
          </section>

          {/* 2-Column Main Calculator + Results Grid */}
          <div className="grid grid-cols-1 items-stretch gap-gutter lg:grid-cols-12">
            <div className="lg:col-span-6">
              <BmiInputCard
                unit={unit}
                heightCm={heightCm}
                heightFt={heightFt}
                heightIn={heightIn}
                weight={weight}
                error={error}
                onChangeUnit={handleUnitChange}
                onChangeHeightCm={setHeightCm}
                onChangeHeightFt={setHeightFt}
                onChangeHeightIn={setHeightIn}
                onChangeWeight={setWeight}
                onCalculate={calculate}
              />
            </div>

            <div className="lg:col-span-6">
              <BmiResultCard
                bmi={bmi}
                category={category}
                unit={unit}
                heightCm={heightCm}
                heightFt={heightFt}
                heightIn={heightIn}
                weight={weight}
                onReset={reset}
              />
            </div>
          </div>

          {/* Lower 2-Column Ranges & Screening Info */}
          <BmiInfoSection activeCategory={category} />

          {/* AI Coach Contextual Banner */}
          <section className="relative flex flex-col items-center justify-between gap-space-md overflow-hidden rounded-2xl border border-outline-variant/25 bg-gradient-to-r from-surface-container via-surface-container-high to-surface-container p-space-md shadow-xl sm:flex-row lg:p-space-lg">
            <div className="flex items-center gap-space-md">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-container/20 text-primary shadow-[0_0_16px_rgba(16,185,129,0.2)]">
                <span className="material-symbols-outlined text-[28px]">
                  psychology
                </span>
              </div>
              <div>
                <h4 className="mb-0.5 font-title-lg text-title-lg text-on-surface">
                  Have questions about your BMI result?
                </h4>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Your AI Gym Coach can discuss training and nutrition focus
                  around your goals.
                </p>
              </div>
            </div>

            <div className="w-full shrink-0 sm:w-auto">
              <Link
                href={coachCtaHref}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary-container px-6 py-3 font-label-md text-label-md font-bold text-on-primary-container shadow-[0_0_18px_rgba(16,185,129,0.3)] transition-all hover:bg-primary sm:w-auto"
              >
                <span>Consult AI Coach</span>
                <span className="material-symbols-outlined text-[18px]">
                  smart_toy
                </span>
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
