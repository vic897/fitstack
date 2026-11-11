"use client";

import { getMealVisualMeta } from "./dietConfig";

export interface DietMeal {
  name: string;
  items: string[];
}

export interface DietPlan {
  label: string;
  tip: string;
  meals: DietMeal[];
}

interface MealPlanSectionProps {
  goal: string | null;
  plan: DietPlan | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

export default function MealPlanSection({
  goal,
  plan,
  loading,
  error,
  onRetry,
}: MealPlanSectionProps) {
  // Loading State (Skeleton Cards)
  if (loading) {
    return (
      <section aria-label="Loading meal plan" className="flex flex-col gap-space-lg">
        <div className="flex items-center gap-3 rounded-xl border border-primary/20 bg-surface-container-low/85 px-4 py-3 font-body-md text-body-md text-primary">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span>Loading your meal plan…</span>
        </div>

        <div className="grid grid-cols-1 gap-space-lg md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col overflow-hidden rounded-2xl border border-outline-variant/20 bg-surface-container/70 shadow-lg"
            >
              <div className="h-20 animate-pulse bg-surface-container-high/60" />
              <div className="space-y-3 p-space-lg">
                <div className="h-5 w-1/3 animate-pulse rounded-full bg-surface-container-high" />
                <div className="space-y-2 pt-2">
                  <div className="h-3.5 w-4/5 animate-pulse rounded-full bg-surface-container-highest" />
                  <div className="h-3.5 w-3/4 animate-pulse rounded-full bg-surface-container-highest" />
                  <div className="h-3.5 w-2/3 animate-pulse rounded-full bg-surface-container-highest" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Error State with Retry
  if (error) {
    return (
      <div
        role="alert"
        className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-error/30 bg-error-container/25 p-space-md font-body-md text-body-md text-error"
      >
        <span>{error}</span>
        {goal && (
          <button
            type="button"
            onClick={onRetry}
            className="rounded-full border border-error/35 px-4 py-1.5 font-label-md text-label-md font-semibold text-error transition-colors hover:bg-error-container/40"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  // Empty State (no goal selected yet)
  if (!goal || !plan) {
    return (
      <div
        id="diet-empty-state"
        className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-outline-variant/40 bg-surface-container-low/65 px-6 py-16 text-center shadow-inner"
      >
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-container-high text-primary shadow-md">
          <span className="material-symbols-outlined text-[32px]">
            restaurant_menu
          </span>
        </div>
        <h3 className="mb-1.5 font-headline-md text-headline-md font-bold text-on-surface">
          Choose your goal above
        </h3>
        <p className="max-w-md font-body-md text-body-md text-on-surface-variant">
          Your meal plan will appear here with structured ideas for Breakfast,
          Lunch, Dinner, and Snacks.
        </p>
      </div>
    );
  }

  // Populated Meal Plan Section
  return (
    <section className="flex flex-col gap-space-lg">
      {/* Section Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-label-sm text-label-sm font-bold uppercase tracking-widest text-primary">
              Daily Meal Structure
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-outline-variant" />
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
              Goal: {plan.label}
            </span>
          </div>
          <h2 className="mt-1 font-headline-md text-headline-md font-bold tracking-tight text-on-surface">
            Sample Daily Meals
          </h2>
        </div>

        <div className="flex items-center gap-2 font-label-md text-label-md text-on-surface-variant">
          <span className="material-symbols-outlined text-[18px] text-primary">
            restaurant
          </span>
          <span>
            {plan.meals.length}{" "}
            {plan.meals.length === 1 ? "Meal Plan" : "Daily Meals"}
          </span>
        </div>
      </div>

      {/* 2x2 Meal Cards */}
      <div
        id="diet-meals-grid"
        className="grid grid-cols-1 gap-space-lg md:grid-cols-2"
      >
        {plan.meals.map((meal) => {
          const meta = getMealVisualMeta(meal.name);

          return (
            <article
              key={meal.name}
              data-meal-card={meal.name}
              className="flex flex-col overflow-hidden rounded-2xl border border-outline-variant/25 bg-surface-container shadow-xl transition-all duration-300 hover:border-primary/35 hover:shadow-2xl"
            >
              {/* Atmospheric Header Band (replaces fabricated photos with clean typography + gradient) */}
              <div
                className={`relative flex items-center justify-between border-b border-outline-variant/15 bg-gradient-to-br px-space-lg py-4 ${meta.gradientClass}`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-container-lowest/85 text-primary shadow-sm">
                    <span className="material-symbols-outlined text-[22px]">
                      {meta.icon}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-title-lg text-title-lg font-bold text-on-surface">
                      {meal.name}
                    </h3>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1.5 rounded-full border border-outline-variant/25 bg-surface-container-lowest/80 px-2.5 py-1 font-label-sm text-label-sm font-semibold tracking-wide text-primary">
                  <span className="material-symbols-outlined text-[13px]">
                    {meta.headerIcon}
                  </span>
                  <span>{meta.slotTag}</span>
                </span>
              </div>

              {/* Meal Food Items */}
              <div className="flex flex-1 flex-col justify-between gap-space-md p-space-lg">
                <ul className="space-y-2.5 font-body-md text-body-md text-on-surface">
                  {meal.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex items-center justify-between rounded-lg bg-surface-container-high/45 px-3 py-2 font-label-sm text-label-sm text-on-surface-variant">
                  <span className="flex items-center gap-1.5 text-primary">
                    <span className="material-symbols-outlined text-[14px]">
                      check_circle
                    </span>
                    <span>Whole-Food Selection</span>
                  </span>
                  <span className="font-medium text-on-surface-variant">
                    {meal.items.length}{" "}
                    {meal.items.length === 1 ? "item" : "items"}
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Preserved Disclaimer */}
      <p className="mx-auto max-w-3xl text-center font-label-md text-label-md italic text-on-surface-variant/85">
        * These are sample meal ideas, not a personalised nutrition plan. Adjust
        portions to your body size and hunger levels. Consult a nutritionist for
        tailored advice.
      </p>
    </section>
  );
}
