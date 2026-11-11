"use client";

import { DIET_GOALS, type DietGoalOption } from "./dietConfig";

interface DietGoalSelectorProps {
  activeGoal: string | null;
  loading: boolean;
  tip?: string;
  planLabel?: string;
  onSelectGoal: (goalValue: string) => void;
}

export default function DietGoalSelector({
  activeGoal,
  loading,
  tip,
  planLabel,
  onSelectGoal,
}: DietGoalSelectorProps) {
  const activeOption: DietGoalOption | undefined = DIET_GOALS.find(
    (g) => g.value === activeGoal
  );

  return (
    <section className="flex flex-col gap-space-md">
      <div
        id="goal-selector-group"
        className="grid grid-cols-1 gap-space-md md:grid-cols-2"
      >
        {DIET_GOALS.map((g) => {
          const isActive = activeGoal === g.value;
          const isEmber = g.accentKind === "ember";

          const ringStyle = isActive
            ? isEmber
              ? "bg-surface-container-high ring-2 ring-orange-400/80 shadow-xl"
              : "bg-surface-container-high ring-2 ring-primary shadow-xl"
            : "border border-outline-variant/25 bg-surface-container-low/85 hover:border-outline-variant/50 hover:bg-surface-container shadow-md";

          const iconColor = isEmber ? "text-orange-400" : "text-primary";
          const chipStyle = isActive
            ? isEmber
              ? "bg-surface-container-lowest text-orange-300"
              : "bg-surface-container-lowest text-primary"
            : "bg-surface-container-high text-on-surface-variant";

          const statusPill = isActive
            ? isEmber
              ? "bg-orange-400 text-gray-950 font-semibold shadow-sm"
              : "bg-primary text-on-primary font-semibold shadow-sm"
            : "bg-surface-container-high text-on-surface-variant font-medium";

          return (
            <button
              key={g.value}
              type="button"
              data-diet-goal={g.value}
              aria-pressed={isActive}
              disabled={loading && isActive}
              onClick={() => onSelectGoal(g.value)}
              className={`group relative cursor-pointer overflow-hidden rounded-2xl p-space-md text-left transition-all duration-300 focus:outline-none md:p-space-lg ${ringStyle}`}
            >
              {isActive && (
                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${
                    isEmber ? "from-orange-400/10" : "from-primary/10"
                  } via-transparent to-transparent`}
                />
              )}

              <div className="relative z-10 flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-space-md">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-surface-container-lowest shadow-md transition-transform group-hover:scale-105 ${iconColor}`}
                  >
                    <span className="material-symbols-outlined text-[24px]">
                      {g.materialIcon}
                    </span>
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-title-lg text-title-lg font-bold text-on-surface">
                        {g.label}
                      </h2>
                      <span
                        className={`rounded-full px-2 py-0.5 font-label-sm text-label-sm font-semibold uppercase tracking-wider ${chipStyle}`}
                      >
                        {g.tag}
                      </span>
                    </div>
                    <p className="mt-0.5 font-body-md text-body-md text-on-surface-variant">
                      {g.desc}
                    </p>
                  </div>
                </div>

                <span
                  className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 font-label-sm text-label-sm tracking-wide ${statusPill}`}
                >
                  <span>{isActive ? "Selected" : "Select Plan"}</span>
                  {isActive && (
                    <span className="material-symbols-outlined text-[14px]">
                      check
                    </span>
                  )}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Strategy Tip Banner (renders from actual /api/diet response) */}
      {tip && planLabel && activeOption && !loading && (
        <div
          id="diet-tip-panel"
          className={`relative overflow-hidden rounded-xl border bg-surface-container-low/90 p-space-md shadow-md transition-all duration-300 ${
            activeOption.accentKind === "ember"
              ? "border-orange-400/30"
              : "border-primary/25"
          }`}
        >
          <div className="relative z-10 flex items-start gap-space-md">
            <div
              className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-container shadow-sm ${
                activeOption.accentKind === "ember"
                  ? "text-orange-400"
                  : "text-primary"
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {activeOption.accentKind === "ember"
                  ? "local_fire_department"
                  : "bolt"}
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3
                  className={`font-label-md text-label-md font-bold uppercase tracking-wider ${
                    activeOption.accentKind === "ember"
                      ? "text-orange-400"
                      : "text-primary"
                  }`}
                >
                  {planLabel} Tip
                </h3>
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  • Nutrition Guidance
                </span>
              </div>
              <p className="font-body-md text-body-md leading-relaxed text-on-surface">
                {tip}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
