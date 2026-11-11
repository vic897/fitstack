import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroCanvas from "@/components/home/HeroCanvas";

const stats = [
  {
    value: "20+",
    icon: "fitness_center",
    title: "Curated Exercises",
    desc: "Targeted muscle group biomechanics",
  },
  {
    value: "3",
    icon: "track_changes",
    title: "Core Fitness Goals",
    desc: "Muscle Gain, Fat Loss, Endurance",
  },
  {
    value: "AI",
    icon: "smart_toy",
    title: "Powered Coach",
    desc: "Trained on sports nutrition & kinematics",
  },
  {
    value: "Free",
    icon: "lock_open",
    title: "To Use",
    desc: "Instant access, no credit card needed",
  },
];

export default function HomePage() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-clip bg-surface-container-lowest text-on-surface">
      {/* Ambient Lighting Effects */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        <div className="absolute -top-[20%] left-1/2 h-[550px] w-[1000px] -translate-x-1/2 rounded-full bg-primary/10 blur-[140px]" />
        <div className="absolute right-[-10%] top-[40%] h-[500px] w-[600px] rounded-full bg-secondary-container/10 blur-[160px]" />
        <div className="absolute bottom-[-10%] left-[-10%] h-[600px] w-[700px] rounded-full bg-surface-container-high/40 blur-[180px]" />
      </div>

      <Navbar />

      <main className="relative z-10 w-full flex-1 pt-20">
        <div className="flex w-full flex-col">
          {/* Hero Section */}
          <section className="relative mx-auto w-full max-w-[1200px] px-margin-mobile pb-space-xl pt-space-lg sm:px-margin">
            <div className="grid grid-cols-1 items-center gap-gutter lg:grid-cols-12">
              {/* Left Column: Copy & Actions */}
              <div className="z-10 flex flex-col items-start gap-space-lg lg:col-span-6">
                {/* Top Tech Pill Badge */}
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-surface-container-high/80 px-3 py-1.5 shadow-[0_0_20px_rgba(78,222,163,0.12)] backdrop-blur-md">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                  </span>
                  <span className="font-label-sm text-label-sm font-bold uppercase tracking-wider text-primary sm:tracking-widest">
                    Next-Gen AI Athletic Intelligence — FitStack 2.0
                  </span>
                </div>

                {/* Headline */}
                <div className="flex flex-col tracking-tight">
                  <h1 className="select-none font-headline-xl text-headline-xl-mobile leading-[1.08] text-on-surface sm:text-headline-xl">
                    Train Smarter.
                    <br />
                    <span className="bg-gradient-to-r from-primary via-secondary-fixed to-secondary-fixed-dim bg-clip-text text-transparent">
                      Eat Better.
                    </span>
                    <br />
                    <span className="bg-gradient-to-r from-primary to-secondary-container bg-clip-text text-transparent">
                      Get Results.
                    </span>
                  </h1>
                </div>

                {/* Subheading */}
                <p className="max-w-xl font-body-lg text-body-lg leading-relaxed text-on-surface-variant">
                  FitStack gives you an exercise library, custom workout plans,
                  diet guidance, and an AI coach — everything you need to hit
                  your fitness goals.
                </p>

                {/* CTA Actions */}
                <div className="flex w-full flex-wrap items-center gap-space-md pt-space-xs sm:w-auto">
                  <Link
                    href="/workout"
                    className="group relative inline-flex items-center justify-center gap-2 rounded-full bg-primary-container px-space-lg py-3.5 font-title-lg text-title-lg font-bold text-on-primary shadow-[0_0_28px_rgba(16,185,129,0.38)] transition-all duration-300 hover:bg-primary hover:shadow-[0_0_36px_rgba(78,222,163,0.55)] active:scale-95"
                  >
                    <span>Generate My Workout</span>
                    <span className="material-symbols-outlined text-[20px] transition-transform duration-300 group-hover:translate-x-1">
                      arrow_forward
                    </span>
                  </Link>
                  <Link
                    href="/exercises"
                    className="group inline-flex items-center justify-center gap-2 rounded-full border border-outline-variant/35 bg-surface-container-high/50 px-space-lg py-3.5 font-title-lg text-title-lg text-on-surface backdrop-blur-md transition-all duration-300 hover:border-primary/50 hover:bg-surface-container-high"
                  >
                    <span>Browse Exercises</span>
                    <span className="material-symbols-outlined text-[20px] text-primary transition-transform duration-300 group-hover:rotate-45">
                      adjust
                    </span>
                  </Link>
                </div>

                {/* Trust Micro Metrics */}
                <div className="flex flex-wrap items-center gap-x-space-md gap-y-2 pt-2 font-label-md text-label-md text-outline">
                  <div className="flex items-center gap-1.5 text-on-surface-variant">
                    <span className="material-symbols-outlined text-[18px] text-primary">
                      verified
                    </span>
                    <span>Science-Backed Protocols</span>
                  </div>
                  <span className="hidden text-outline-variant sm:inline">•</span>
                  <div className="flex items-center gap-1.5 text-on-surface-variant">
                    <span className="material-symbols-outlined text-[18px] text-primary">
                      bolt
                    </span>
                    <span>Zero Paywall Obstacles</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive 3D Athletic Model & Glass Telemetry */}
              <div className="relative flex min-h-[380px] items-center justify-center sm:min-h-[460px] lg:col-span-6 lg:min-h-[540px]">
                {/* Ambient Radial Backlight Glow */}
                <div className="pointer-events-none absolute h-[320px] w-[320px] rounded-full bg-primary/15 blur-[110px] sm:h-[360px] sm:w-[360px]" />

                {/* 3D Athletic Kinematics Canvas Card */}
                <div className="relative flex h-[380px] w-full items-center justify-center overflow-hidden rounded-2xl border border-outline-variant/20 bg-surface-container-low/40 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-sm sm:h-[460px] lg:h-[520px]">
                  <HeroCanvas />

                  {/* Floating Ambient Biometrics Badge 1 (Top Left) */}
                  <div className="absolute left-4 top-4 z-20 flex items-center gap-2.5 rounded-xl border border-outline-variant/40 bg-surface-container-highest/80 px-3.5 py-2 shadow-lg backdrop-blur-xl sm:left-6 sm:top-6">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/20 text-primary">
                      <span className="material-symbols-outlined text-[17px]">
                        accessibility_new
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label-sm text-label-sm font-semibold uppercase text-outline">
                        Biomechanics Engine
                      </span>
                      <span className="font-label-md text-label-md font-bold text-primary">
                        99.4% Form Precision
                      </span>
                    </div>
                  </div>

                  {/* Floating Ambient Biometrics Badge 2 (Bottom Right) */}
                  <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2.5 rounded-xl border border-outline-variant/40 bg-surface-container-highest/80 px-3.5 py-2 shadow-lg backdrop-blur-xl sm:bottom-6 sm:right-6">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary/20 text-secondary">
                      <span className="material-symbols-outlined text-[17px]">
                        model_training
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label-sm text-label-sm font-semibold uppercase text-outline">
                        Real-time Macro Adaptation
                      </span>
                      <span className="flex items-center gap-1 font-label-md text-label-md font-bold text-secondary-fixed">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-secondary-fixed" />
                        Instant Vector
                      </span>
                    </div>
                  </div>

                  {/* Grid Reticle Matrix Accent */}
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#4edea3_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
                </div>
              </div>
            </div>
          </section>

          {/* Statistics Bar (Executive Metric Pillars) */}
          <section className="mx-auto my-space-lg w-full max-w-[1200px] px-margin-mobile sm:px-margin">
            <div className="w-full rounded-2xl border border-outline-variant/30 bg-surface-container-low/70 p-space-md shadow-[0_16px_40px_-10px_rgba(0,0,0,0.5)] backdrop-blur-xl lg:p-space-lg">
              <div className="grid grid-cols-2 items-center gap-gutter md:grid-cols-4">
                {stats.map((stat, idx) => (
                  <div
                    key={stat.title}
                    className={`flex flex-col gap-1 ${
                      idx === 0
                        ? "pl-2"
                        : idx === 1
                        ? "border-l border-outline-variant/25 pl-4 sm:pl-6"
                        : idx === 2
                        ? "border-t border-outline-variant/25 pl-2 pt-4 md:border-l md:border-t-0 md:pl-6 md:pt-0"
                        : "border-l border-t border-outline-variant/25 pl-4 pt-4 sm:pl-6 md:border-t-0 md:pt-0"
                    }`}
                  >
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-stat-display text-stat-display font-extrabold tracking-tight text-primary">
                        {stat.value}
                      </span>
                      <span className="material-symbols-outlined text-[18px] text-primary">
                        {stat.icon}
                      </span>
                    </div>
                    <span className="font-title-lg text-title-lg font-semibold text-on-surface">
                      {stat.title}
                    </span>
                    <p className="font-label-md text-label-md text-on-surface-variant">
                      {stat.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Live Interactive AI Gym Coach Demonstration Card */}
          <section className="mx-auto w-full max-w-[1200px] px-margin-mobile py-space-md sm:px-margin">
            <div className="relative w-full overflow-hidden rounded-2xl border border-primary/20 bg-surface-container/60 p-space-md shadow-[0_16px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-space-lg">
              {/* Glow Refraction */}
              <div className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-primary/10 blur-[90px]" />

              <div className="relative flex flex-col gap-space-md">
                {/* Live Pill Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                    <span className="font-label-sm text-label-sm font-bold uppercase tracking-wider text-primary">
                      Interactive Telemetry Preview
                    </span>
                  </div>
                  <span className="font-label-sm text-label-sm text-outline">
                    Powered by Groq AI
                  </span>
                </div>

                {/* Sample Conversation Exchange */}
                <div className="flex flex-col gap-space-sm pt-space-xs">
                  {/* Athlete Query */}
                  <div className="flex items-start justify-end gap-3">
                    <div className="max-w-xl rounded-2xl rounded-tr-none border border-outline-variant/30 bg-surface-container-high px-4 py-2.5 font-body-md text-body-md text-on-surface">
                      <p className="leading-snug text-on-surface">
                        &ldquo;Need a high-protein breakfast under 500 kcal for
                        post-leg day recovery&rdquo;
                      </p>
                    </div>
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-outline-variant/40 bg-surface-container-highest">
                      <span className="material-symbols-outlined text-[17px] text-on-surface-variant">
                        person
                      </span>
                    </div>
                  </div>

                  {/* FitStack Coach Response */}
                  <div className="flex items-start justify-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary shadow-[0_0_12px_rgba(78,222,163,0.4)]">
                      <span className="material-symbols-outlined text-[18px]">
                        bolt
                      </span>
                    </div>
                    <div className="max-w-2xl rounded-2xl rounded-tl-none border border-primary/30 bg-surface-container-lowest/80 px-space-md py-space-sm text-on-surface shadow-md">
                      <div className="mb-1.5 flex items-center gap-2">
                        <span className="font-label-sm text-label-sm font-extrabold uppercase tracking-widest text-primary">
                          FitStack Coach
                        </span>
                        <span className="font-label-sm text-label-sm text-outline">
                          • Macro Optimized
                        </span>
                      </div>
                      <p className="font-body-md text-body-md leading-relaxed text-on-surface">
                        Egg white spinach scramble with smashed avocado on
                        sourdough toast —{" "}
                        <strong className="font-semibold text-primary">
                          38g protein
                        </strong>
                        ,{" "}
                        <strong className="font-semibold text-primary">
                          420 kcal
                        </strong>
                        ,{" "}
                        <strong className="font-semibold text-primary">
                          14g healthy fats
                        </strong>
                        . Ready in 8 mins.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Footer */}
                <div className="mt-1 flex flex-wrap items-center justify-between gap-space-sm border-t border-outline-variant/20 pt-2">
                  <div className="flex items-center gap-2 font-label-md text-label-md text-outline">
                    <span className="material-symbols-outlined text-[16px]">
                      tune
                    </span>
                    <span>
                      Adaptive to your fitness profile, workout history &amp;
                      progress logs
                    </span>
                  </div>
                  <Link
                    href="/coach"
                    className="group inline-flex items-center gap-1.5 rounded-full border border-primary/35 bg-primary/15 px-3.5 py-1.5 font-label-md text-label-md font-semibold text-primary transition-all duration-200 hover:bg-primary hover:text-on-primary"
                  >
                    <span>Ask Coach another question</span>
                    <span className="material-symbols-outlined text-[16px] transition-transform group-hover:translate-x-1">
                      arrow_forward
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Core Platform Capabilities & Feature Showcase */}
          <section className="mx-auto w-full max-w-[1200px] px-margin-mobile py-space-xl sm:px-margin">
            {/* Section Heading */}
            <div className="mb-space-xl flex flex-col items-start gap-space-xs">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                <span className="font-label-sm text-label-sm font-bold uppercase tracking-widest text-primary">
                  Integrated Ecosystem
                </span>
              </div>
              <h2 className="font-headline-lg text-headline-lg-mobile tracking-tight text-on-surface sm:text-headline-lg">
                Everything you need.{" "}
                <span className="text-primary">Nothing you don&apos;t.</span>
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant">
                Four tools. One goal. Your best shape.
              </p>
            </div>

            {/* Bento Grid (4 Feature Cards) */}
            <div className="grid grid-cols-1 gap-gutter md:grid-cols-2">
              {/* Card A: Exercise Library */}
              <div className="group relative flex flex-col justify-between rounded-2xl border border-outline-variant/30 bg-surface-container-low/60 p-space-lg backdrop-blur-xl transition-all duration-300 hover:border-primary/40 hover:shadow-[0_16px_36px_rgba(0,0,0,0.5)]">
                <div>
                  <div className="mb-space-md flex items-center justify-between">
                    <span className="rounded-full border border-outline-variant/40 bg-surface-container-high px-2.5 py-1 font-label-sm text-label-sm font-bold uppercase tracking-wider text-primary">
                      Form Analysis
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-outline-variant/30 bg-surface-container-high text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-on-primary">
                      <span className="material-symbols-outlined text-[22px]">
                        fitness_center
                      </span>
                    </div>
                  </div>

                  {/* Feature Graphic: Biomechanical Joint Vector */}
                  <div className="relative mb-space-md flex h-36 w-full items-center justify-center overflow-hidden rounded-xl border border-outline-variant/20 bg-surface-container-highest/40">
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-secondary-container/10" />
                    <svg
                      className="relative h-24 w-48 text-primary/70"
                      fill="none"
                      viewBox="0 0 200 100"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <circle cx="30" cy="50" fill="currentColor" r="6" />
                      <line
                        stroke="currentColor"
                        strokeDasharray="4 2"
                        strokeWidth="2.5"
                        x1="30"
                        x2="80"
                        y1="50"
                        y2="30"
                      />
                      <circle cx="80" cy="30" fill="#68fcbf" r="5" />
                      <line
                        stroke="currentColor"
                        strokeWidth="3"
                        x1="80"
                        x2="140"
                        y1="30"
                        y2="70"
                      />
                      <circle cx="140" cy="70" fill="currentColor" r="7" />
                      <line
                        stroke="currentColor"
                        strokeWidth="2"
                        x1="140"
                        x2="180"
                        y1="70"
                        y2="40"
                      />
                      <circle cx="180" cy="40" fill="#68fcbf" r="5" />
                      <text
                        fill="#bbcabf"
                        fontFamily="var(--font-inter), Inter, sans-serif"
                        fontSize="9"
                        textAnchor="middle"
                        x="140"
                        y="92"
                      >
                        Primary Lever Axis
                      </text>
                    </svg>
                  </div>

                  <h3 className="mb-space-xs font-headline-md text-headline-md font-bold text-on-surface">
                    Exercise Library
                  </h3>
                  <p className="mb-space-md font-body-md text-body-md leading-relaxed text-on-surface-variant">
                    Browse 20+ exercises filtered by muscle group and
                    difficulty. Know exactly what to do, how to execute, and
                    why.
                  </p>
                </div>

                <Link
                  href="/exercises"
                  className="group/link inline-flex items-center gap-1.5 font-title-lg text-title-lg font-semibold text-primary transition-colors hover:text-secondary-fixed"
                >
                  <span>Browse Exercises</span>
                  <span className="material-symbols-outlined text-[18px] transition-transform duration-200 group-hover/link:translate-x-1.5">
                    arrow_forward
                  </span>
                </Link>
              </div>

              {/* Card B: Workout Generator */}
              <div className="group relative flex flex-col justify-between rounded-2xl border border-outline-variant/30 bg-surface-container-low/60 p-space-lg backdrop-blur-xl transition-all duration-300 hover:border-primary/40 hover:shadow-[0_16px_36px_rgba(0,0,0,0.5)]">
                <div>
                  <div className="mb-space-md flex items-center justify-between">
                    <span className="rounded-full border border-outline-variant/40 bg-surface-container-high px-2.5 py-1 font-label-sm text-label-sm font-bold uppercase tracking-wider text-primary">
                      Auto-Periodization
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-outline-variant/30 bg-surface-container-high text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-on-primary">
                      <span className="material-symbols-outlined text-[22px]">
                        auto_schedule
                      </span>
                    </div>
                  </div>

                  {/* Feature Graphic: Telemetry Overload Bars */}
                  <div className="relative mb-space-md flex h-36 w-full items-center justify-center overflow-hidden rounded-xl border border-outline-variant/20 bg-surface-container-highest/40 p-3">
                    <div className="absolute inset-0 bg-gradient-to-tr from-secondary-container/10 via-transparent to-primary/10" />
                    <svg
                      className="relative h-full w-full max-w-[240px]"
                      fill="none"
                      viewBox="0 0 240 80"
                      aria-hidden="true"
                    >
                      <rect
                        fill="#32353a"
                        height="30"
                        rx="3"
                        width="20"
                        x="15"
                        y="45"
                      />
                      <rect
                        fill="#3c4a42"
                        height="40"
                        rx="3"
                        width="20"
                        x="55"
                        y="35"
                      />
                      <rect
                        fill="#10b981"
                        fillOpacity="0.6"
                        height="50"
                        rx="3"
                        width="20"
                        x="95"
                        y="25"
                      />
                      <rect
                        fill="#4edea3"
                        height="60"
                        rx="3"
                        width="20"
                        x="135"
                        y="15"
                      />
                      <rect
                        fill="#68fcbf"
                        height="67"
                        rx="3"
                        width="20"
                        x="175"
                        y="8"
                      />
                      <path
                        d="M 25 40 Q 95 15 185 5"
                        fill="none"
                        stroke="#4edea3"
                        strokeDasharray="3 3"
                        strokeWidth="2"
                      />
                      <circle cx="185" cy="5" fill="#4edea3" r="4" />
                    </svg>
                  </div>

                  <h3 className="mb-space-xs font-headline-md text-headline-md font-bold text-on-surface">
                    Workout Generator
                  </h3>
                  <p className="mb-space-md font-body-md text-body-md leading-relaxed text-on-surface-variant">
                    Tell us your goal and level. Get a structured weekly plan
                    built around you — no guesswork, pure progression.
                  </p>
                </div>

                <Link
                  href="/workout"
                  className="group/link inline-flex items-center gap-1.5 font-title-lg text-title-lg font-semibold text-primary transition-colors hover:text-secondary-fixed"
                >
                  <span>Generate Plan</span>
                  <span className="material-symbols-outlined text-[18px] transition-transform duration-200 group-hover/link:translate-x-1.5">
                    arrow_forward
                  </span>
                </Link>
              </div>

              {/* Card C: Diet Guide */}
              <div className="group relative flex flex-col justify-between rounded-2xl border border-outline-variant/30 bg-surface-container-low/60 p-space-lg backdrop-blur-xl transition-all duration-300 hover:border-primary/40 hover:shadow-[0_16px_36px_rgba(0,0,0,0.5)]">
                <div>
                  <div className="mb-space-md flex items-center justify-between">
                    <span className="rounded-full border border-outline-variant/40 bg-surface-container-high px-2.5 py-1 font-label-sm text-label-sm font-bold uppercase tracking-wider text-primary">
                      Macro Targeted
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-outline-variant/30 bg-surface-container-high text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-on-primary">
                      <span className="material-symbols-outlined text-[22px]">
                        restaurant
                      </span>
                    </div>
                  </div>

                  {/* Feature Graphic: Macro Donut Ring */}
                  <div className="relative mb-space-md flex h-36 w-full items-center justify-center overflow-hidden rounded-xl border border-outline-variant/20 bg-surface-container-highest/40">
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-surface-container-high" />
                    <div className="relative flex items-center gap-6">
                      <svg
                        className="h-24 w-24 -rotate-90"
                        viewBox="0 0 36 36"
                        aria-hidden="true"
                      >
                        <circle
                          cx="18"
                          cy="18"
                          fill="none"
                          r="14"
                          stroke="#272a2f"
                          strokeWidth="4"
                        />
                        <circle
                          cx="18"
                          cy="18"
                          fill="none"
                          r="14"
                          stroke="#4edea3"
                          strokeDasharray="35 100"
                          strokeLinecap="round"
                          strokeWidth="4"
                        />
                        <circle
                          cx="18"
                          cy="18"
                          fill="none"
                          r="14"
                          stroke="#00bd85"
                          strokeDasharray="30 100"
                          strokeDashoffset="-38"
                          strokeLinecap="round"
                          strokeWidth="4"
                        />
                        <circle
                          cx="18"
                          cy="18"
                          fill="none"
                          r="14"
                          stroke="#68dba9"
                          strokeDasharray="20 100"
                          strokeDashoffset="-71"
                          strokeLinecap="round"
                          strokeWidth="4"
                        />
                      </svg>
                      <div className="flex flex-col gap-1 font-label-sm text-label-sm">
                        <span className="flex items-center gap-1.5 font-semibold text-primary">
                          <span className="h-2 w-2 rounded-full bg-primary" />
                          40% Protein
                        </span>
                        <span className="flex items-center gap-1.5 font-semibold text-secondary">
                          <span className="h-2 w-2 rounded-full bg-secondary" />
                          35% Carbs
                        </span>
                        <span className="flex items-center gap-1.5 font-semibold text-tertiary">
                          <span className="h-2 w-2 rounded-full bg-tertiary" />
                          25% Lipids
                        </span>
                      </div>
                    </div>
                  </div>

                  <h3 className="mb-space-xs font-headline-md text-headline-md font-bold text-on-surface">
                    Diet Guide
                  </h3>
                  <p className="mb-space-md font-body-md text-body-md leading-relaxed text-on-surface-variant">
                    Simple meal plans matched to your goal. Muscle gain or fat
                    loss — see exactly what to eat with clear structure.
                  </p>
                </div>

                <Link
                  href="/diet"
                  className="group/link inline-flex items-center gap-1.5 font-title-lg text-title-lg font-semibold text-primary transition-colors hover:text-secondary-fixed"
                >
                  <span>View Meal Plans</span>
                  <span className="material-symbols-outlined text-[18px] transition-transform duration-200 group-hover/link:translate-x-1.5">
                    arrow_forward
                  </span>
                </Link>
              </div>

              {/* Card D: AI Gym Coach */}
              <div className="group relative flex flex-col justify-between rounded-2xl border border-outline-variant/30 bg-surface-container-low/60 p-space-lg backdrop-blur-xl transition-all duration-300 hover:border-primary/40 hover:shadow-[0_16px_36px_rgba(0,0,0,0.5)]">
                <div>
                  <div className="mb-space-md flex items-center justify-between">
                    <span className="rounded-full border border-outline-variant/40 bg-surface-container-high px-2.5 py-1 font-label-sm text-label-sm font-bold uppercase tracking-wider text-primary">
                      24/7 Intelligence
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-outline-variant/30 bg-surface-container-high text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-on-primary">
                      <span className="material-symbols-outlined text-[22px]">
                        smart_toy
                      </span>
                    </div>
                  </div>

                  {/* Feature Graphic: Neural Node Visualization */}
                  <div className="relative mb-space-md flex h-36 w-full items-center justify-center overflow-hidden rounded-xl border border-outline-variant/20 bg-surface-container-highest/40">
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/15 via-transparent to-surface-container" />
                    <div className="relative flex items-center justify-center">
                      <div className="absolute h-16 w-16 animate-ping rounded-full bg-primary/20" />
                      <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-primary bg-surface-container-high text-primary shadow-[0_0_24px_rgba(78,222,163,0.5)]">
                        <span className="material-symbols-outlined text-[24px]">
                          neurology
                        </span>
                      </div>
                      <div className="absolute -left-20 top-0 rounded border border-primary/20 bg-surface-container px-2 py-0.5 font-label-sm text-label-sm text-primary shadow-sm">
                        Hypertrophy
                      </div>
                      <div className="absolute -right-20 bottom-0 rounded border border-secondary/20 bg-surface-container px-2 py-0.5 font-label-sm text-label-sm text-secondary shadow-sm">
                        Metabolism
                      </div>
                    </div>
                  </div>

                  <h3 className="mb-space-xs font-headline-md text-headline-md font-bold text-on-surface">
                    AI Gym Coach
                  </h3>
                  <p className="mb-space-md font-body-md text-body-md leading-relaxed text-on-surface-variant">
                    Chat with an AI trained in fitness and nutrition. Ask
                    anything — get clear, practical answers in seconds.
                  </p>
                </div>

                <Link
                  href="/coach"
                  className="group/link inline-flex items-center gap-1.5 font-title-lg text-title-lg font-semibold text-primary transition-colors hover:text-secondary-fixed"
                >
                  <span>Talk to Coach</span>
                  <span className="material-symbols-outlined text-[18px] transition-transform duration-200 group-hover/link:translate-x-1.5">
                    arrow_forward
                  </span>
                </Link>
              </div>
            </div>
          </section>

          {/* Final High-Impact Conversion Section */}
          <section className="mx-auto w-full max-w-[1200px] px-margin-mobile pb-space-xl pt-space-md sm:px-margin">
            <div className="relative w-full overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-b from-surface-container-high/90 to-surface-container-low/90 p-space-lg text-center shadow-[0_24px_60px_-12px_rgba(0,0,0,0.7)] backdrop-blur-2xl sm:p-space-xl">
              {/* Radial Emerald Spotlight Glow */}
              <div className="pointer-events-none absolute -top-32 left-1/2 h-[350px] w-[550px] -translate-x-1/2 rounded-full bg-primary/20 blur-[110px]" />

              <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center gap-space-md">
                {/* Glowing Barbell Icon Badge */}
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/40 bg-surface-container-highest/90 text-primary shadow-[0_0_30px_rgba(78,222,163,0.3)]">
                  <span className="material-symbols-outlined text-[32px]">
                    exercise
                  </span>
                </div>

                {/* Headline */}
                <h2 className="font-headline-xl text-headline-lg font-extrabold leading-tight tracking-tight text-on-surface sm:text-headline-xl">
                  Ready to start?
                </h2>

                {/* Subtitle */}
                <p className="max-w-lg font-body-lg text-body-lg text-on-surface-variant">
                  Talk to your AI coach right now — no account needed. Experience
                  biometric precision and tailored programming instantly.
                </p>

                {/* Primary CTA Button */}
                <div className="pt-space-xs">
                  <Link
                    href="/coach"
                    className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-primary via-primary-container to-secondary-container px-8 py-4 font-title-lg text-title-lg font-extrabold text-on-primary shadow-[0_0_36px_rgba(16,185,129,0.45)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_48px_rgba(78,222,163,0.7)] active:scale-[0.98]"
                  >
                    <span>Chat with AI Coach</span>
                    <span className="material-symbols-outlined text-[22px] transition-transform duration-300 group-hover:translate-x-1.5">
                      arrow_forward
                    </span>
                  </Link>
                </div>

                {/* Footnote Badges */}
                <div className="flex flex-wrap items-center justify-center gap-space-md pt-space-xs font-label-sm text-label-sm text-outline">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px] text-primary">
                      check_circle
                    </span>
                    Instant Start
                  </span>
                  <span className="hidden text-outline-variant sm:inline">•</span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px] text-primary">
                      check_circle
                    </span>
                    No Credit Card
                  </span>
                  <span className="hidden text-outline-variant sm:inline">•</span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px] text-primary">
                      check_circle
                    </span>
                    Free To Use
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
