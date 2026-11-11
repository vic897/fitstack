"use client";

interface SynthesisLoadingViewProps {
  elapsed: number;
  goalLabel?: string;
  levelLabel?: string;
  levelDays?: string;
}

interface PhaseDefinition {
  title: string;
  description: string;
  tag: string;
}

function getLoadingStepIndex(elapsed: number): number {
  if (elapsed < 2000) return 0;
  if (elapsed < 4000) return 1;
  if (elapsed < 6000) return 2;
  return 3;
}

function getProgressPercentage(elapsed: number): number {
  // Never report 100% until the real API response arrives
  if (elapsed < 2000) {
    return Math.round(18 + (elapsed / 2000) * 24);
  }
  if (elapsed < 4000) {
    return Math.round(42 + ((elapsed - 2000) / 2000) * 24);
  }
  if (elapsed < 6000) {
    return Math.round(66 + ((elapsed - 4000) / 2000) * 18);
  }
  const extra = Math.min(8, Math.floor((elapsed - 6000) / 1000) * 2);
  return Math.min(92, 84 + extra);
}

export default function SynthesisLoadingView({
  elapsed,
  goalLabel,
  levelLabel,
  levelDays,
}: SynthesisLoadingViewProps) {
  const currentIdx = getLoadingStepIndex(elapsed);
  const progressPct = getProgressPercentage(elapsed);

  const phases: PhaseDefinition[] = [
    {
      title: "Fetching exercises from database…",
      description:
        "Querying curated exercises filtered by your goal muscle groups and difficulty.",
      tag: "Supabase DB",
    },
    {
      title: "AI is selecting exercises for your goal…",
      description:
        "Choosing complementary compound and accessory movements with target sets and reps.",
      tag: goalLabel ? `Goal: ${goalLabel}` : "Target Profile",
    },
    {
      title: "Building your weekly schedule…",
      description:
        "Distributing muscle groups across training days so the same muscles never repeat back-to-back.",
      tag: levelDays ?? (levelLabel || "7-Day Split"),
    },
    {
      title: "Almost done — finalising your plan…",
      description:
        "Validating structured 7-day schedule output and saving workout structure.",
      tag: "Groq GPT-OSS 120B",
    },
  ];

  const activePhase = phases[currentIdx];

  return (
    <div className="flex w-full flex-col items-center">
      {/* Central AI Generation Progress Glass Panel */}
      <div className="relative mb-space-xl w-full max-w-3xl overflow-hidden rounded-2xl border border-primary/20 bg-surface-container/65 p-space-lg shadow-xl backdrop-blur-2xl sm:p-space-xl">
        <div className="pointer-events-none absolute right-0 top-0 h-32 w-64 rounded-full bg-primary/10 blur-3xl" />

        {/* Header Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-space-lg">
          <div className="flex items-center gap-space-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container-highest text-primary shadow-inner">
              <span className="material-symbols-outlined animate-spin text-[22px]">
                progress_activity
              </span>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-title-lg text-title-lg font-bold text-on-surface">
                  {activePhase.title}
                </span>
                <span className="rounded-full bg-primary-container/20 px-2.5 py-0.5 font-label-md text-label-md font-bold text-primary">
                  Phase {currentIdx + 1}/4
                </span>
              </div>
              <p className="font-label-md text-label-md text-on-surface-variant">
                Waiting for live API response…
              </p>
            </div>
          </div>

          <div className="text-right">
            <span
              id="progress-percentage-display"
              className="font-stat-display text-stat-display font-bold tracking-tight text-primary"
            >
              {progressPct}%
            </span>
          </div>
        </div>

        {/* 4-Phase Stepper */}
        <div className="space-y-space-sm py-space-xs">
          {phases.map((phase, idx) => {
            const isCompleted = idx < currentIdx;
            const isActive = idx === currentIdx;
            const isPending = idx > currentIdx;

            return (
              <div
                key={phase.title}
                data-phase-state={
                  isCompleted ? "done" : isActive ? "active" : "pending"
                }
                className={`relative flex items-start gap-space-md overflow-hidden rounded-xl p-space-sm transition-all duration-300 sm:p-3 ${
                  isActive
                    ? "border border-primary/30 bg-surface-container-high/70 shadow-sm"
                    : isCompleted
                    ? "bg-surface-container-low/50"
                    : "bg-surface-container-low/20 opacity-45"
                }`}
              >
                {isCompleted && (
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-container text-on-primary-container shadow-sm">
                    <span className="material-symbols-outlined text-[16px] font-bold">
                      check
                    </span>
                  </div>
                )}

                {isActive && (
                  <div className="relative mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                    <span className="absolute inline-flex h-3.5 w-3.5 animate-ping rounded-full bg-primary opacity-60" />
                    <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                  </div>
                )}

                {isPending && (
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-container-highest text-outline">
                    <span className="material-symbols-outlined text-[14px]">
                      lock
                    </span>
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-1.5">
                    <span
                      className={`font-body-md text-body-md ${
                        isActive
                          ? "font-semibold text-primary"
                          : isCompleted
                          ? "font-semibold text-on-surface"
                          : "font-medium text-outline"
                      }`}
                    >
                      {phase.title}
                    </span>

                    {isActive ? (
                      <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-2 py-0.5 text-primary">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                        <span className="font-label-sm text-label-sm">
                          In Progress
                        </span>
                      </div>
                    ) : isCompleted ? (
                      <span className="rounded-full bg-surface-container-highest px-2 py-0.5 font-label-sm text-label-sm text-primary">
                        {phase.tag}
                      </span>
                    ) : (
                      <span className="font-label-sm text-label-sm text-outline">
                        Queued
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 font-label-md text-label-md text-outline">
                    {phase.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="mt-space-lg pt-space-sm">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container-lowest">
            <div
              id="progress-bar-fill"
              className="h-full rounded-full bg-gradient-to-r from-secondary to-primary shadow-[0_0_12px_rgba(78,222,163,0.5)] transition-all duration-500 ease-out"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 font-label-sm text-label-sm text-outline">
            <span>Engine: Groq GPT-OSS 120B</span>
            <span>Elapsed: {(elapsed / 1000).toFixed(1)}s</span>
          </div>
        </div>
      </div>

      {/* Preview Wireframe / Skeleton Workout Cards Header */}
      <div className="mb-space-md flex w-full max-w-5xl flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-space-xs">
          <span className="material-symbols-outlined text-[20px] text-primary">
            view_timeline
          </span>
          <span className="font-title-lg text-title-lg text-on-surface">
            Weekly Architecture Preview
          </span>
          <span className="shrink-0 whitespace-nowrap rounded-full bg-surface-container-high px-2 py-0.5 font-label-sm text-label-sm font-bold uppercase text-on-surface-variant">
            7-Day Split
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
          <span className="font-label-sm text-label-sm text-on-surface-variant">
            Generating Plan Wireframe
          </span>
        </div>
      </div>

      {/* Top Row: Days 1–4 Skeletons */}
      <div className="mb-space-md grid w-full max-w-5xl grid-cols-1 gap-space-md sm:grid-cols-2 lg:grid-cols-4">
        {["Day 01", "Day 02", "Day 03"].map((dayLabel, i) => (
          <div
            key={dayLabel}
            className="relative flex flex-col justify-between overflow-hidden rounded-xl border border-outline-variant/25 bg-surface-container-low/70 p-space-md shadow-md backdrop-blur-md"
          >
            <div className="workout-shimmer pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-surface-container-highest/25 to-transparent" />
            <div>
              <div className="mb-space-sm flex items-center justify-between">
                <span className="font-label-sm text-label-sm font-bold uppercase text-primary">
                  {dayLabel}
                </span>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 font-label-sm text-label-sm text-primary">
                  Training Slot
                </span>
              </div>
              <div className="mb-3 h-4 w-3/4 animate-pulse rounded-full bg-surface-container-high" />
              <div className="mt-4 space-y-2">
                {[0, 1, 2].map((row) => (
                  <div
                    key={row}
                    className="flex items-center justify-between rounded bg-surface-container/60 px-2 py-1.5"
                  >
                    <div
                      className={`h-3 rounded-full bg-surface-container-highest ${
                        (i + row) % 2 === 0 ? "w-28" : "w-24"
                      }`}
                    />
                    <div className="h-3 w-10 rounded-full bg-primary/20" />
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between pt-3">
              <div className="h-2.5 w-16 rounded-full bg-surface-container-highest" />
              <span className="font-label-sm text-label-sm text-outline">
                Pending Sets
              </span>
            </div>
          </div>
        ))}

        {/* Day 4 Wireframe: Recovery Slot */}
        <div className="flex flex-col justify-between rounded-xl border-2 border-dashed border-surface-container-high bg-surface-container-lowest/80 p-space-md shadow-md backdrop-blur-md">
          <div>
            <div className="mb-space-sm flex items-center justify-between">
              <span className="font-label-sm text-label-sm font-bold uppercase text-outline">
                Day 04
              </span>
              <span className="rounded-full bg-surface-container px-2 py-0.5 font-label-sm text-label-sm text-outline">
                Recovery
              </span>
            </div>
            <div className="mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-secondary">
                spa
              </span>
              <span className="font-title-lg text-title-lg text-on-surface">
                Recovery Window
              </span>
            </div>
            <p className="font-label-md text-label-md text-outline">
              AI allocates rest days dynamically based on your selected weekly
              frequency.
            </p>
          </div>
          <div className="mt-6 flex items-center justify-between pt-3">
            <span className="font-label-sm text-label-sm text-secondary">
              Adaptive Slot
            </span>
            <span className="font-label-sm text-label-sm text-outline">
              Rest Day
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Row: Days 5–7 Compact Strip */}
      <div className="mb-space-xl grid w-full max-w-5xl grid-cols-1 gap-space-md md:grid-cols-3">
        {[
          { day: "Day 05", icon: "fitness_center", tag: "Training" },
          { day: "Day 06", icon: "directions_run", tag: "Conditioning" },
        ].map((item) => (
          <div
            key={item.day}
            className="relative flex items-center justify-between overflow-hidden rounded-xl border border-outline-variant/20 bg-surface-container-low/70 p-space-md shadow-md backdrop-blur-md"
          >
            <div className="workout-shimmer pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-surface-container-highest/25 to-transparent" />
            <div className="flex items-center gap-space-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container-high text-primary">
                <span className="material-symbols-outlined text-[20px]">
                  {item.icon}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-label-sm text-label-sm font-bold uppercase text-primary">
                    {item.day}
                  </span>
                  <span className="font-label-sm text-label-sm font-medium text-on-surface-variant">
                    Awaiting exercises
                  </span>
                </div>
                <div className="mt-1.5 h-3 w-32 animate-pulse rounded-full bg-surface-container-high" />
              </div>
            </div>
            <span className="rounded bg-surface-container-highest px-2 py-0.5 font-label-sm text-label-sm text-outline">
              {item.tag}
            </span>
          </div>
        ))}

        <div className="flex items-center justify-between rounded-xl border border-outline-variant/20 bg-surface-container-lowest/80 p-space-md shadow-md backdrop-blur-md">
          <div className="flex items-center gap-space-md">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container-highest text-outline">
              <span className="material-symbols-outlined text-[20px]">
                hotel
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-label-sm text-label-sm font-bold uppercase text-outline">
                  Day 07
                </span>
                <span className="font-label-sm text-label-sm font-medium text-on-surface-variant">
                  Split Completion
                </span>
              </div>
              <span className="font-label-sm text-label-sm text-outline">
                Training or rest slot
              </span>
            </div>
          </div>
          <span className="rounded bg-surface-container px-2 py-0.5 font-label-sm text-label-sm text-outline">
            Day 7
          </span>
        </div>
      </div>

      {/* Live Telemetry Micro-Bar */}
      <div className="flex w-full max-w-3xl flex-wrap items-center justify-center gap-x-space-md gap-y-2 rounded-full border border-outline-variant/25 bg-surface-container-lowest/90 px-space-md py-2 font-label-md text-label-md text-on-surface-variant shadow-sm backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-secondary" />
          </span>
          <span className="font-semibold text-on-surface">
            Generating via /api/workout
          </span>
        </div>
        {goalLabel && (
          <>
            <span className="hidden text-outline sm:inline">·</span>
            <span>Goal: {goalLabel}</span>
          </>
        )}
        {levelLabel && (
          <>
            <span className="hidden text-outline sm:inline">·</span>
            <span className="font-medium text-primary">
              Level: {levelLabel}
              {levelDays ? ` (${levelDays})` : ""}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
