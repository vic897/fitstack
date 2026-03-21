import Link from "next/link";
import Navbar from "@/components/layout/Navbar";

const features = [
  {
    icon: "🏋️",
    title: "Exercise Library",
    description:
      "Browse 20+ exercises filtered by muscle group and difficulty. Know exactly what to do and why.",
    href: "/exercises",
    cta: "Browse Exercises",
  },
  {
    icon: "📋",
    title: "Workout Generator",
    description:
      "Tell us your goal and level. Get a structured weekly plan built around you — no guesswork.",
    href: "/workout",
    cta: "Generate Plan",
  },
  {
    icon: "🥗",
    title: "Diet Guide",
    description:
      "Simple meal plans matched to your goal. Muscle gain or fat loss — see exactly what to eat.",
    href: "/diet",
    cta: "View Meal Plans",
  },
  {
    icon: "🤖",
    title: "AI Gym Coach",
    description:
      "Chat with an AI trained in fitness and nutrition. Ask anything — get clear, practical answers.",
    href: "/coach",
    cta: "Talk to Coach",
  },
];

const stats = [
  { value: "20+", label: "Exercises" },
  { value: "3", label: "Fitness Goals" },
  { value: "AI", label: "Powered Coach" },
  { value: "Free", label: "To Use" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      {/* Hero */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-16 text-center">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[500px] w-[500px] rounded-full bg-green-500/10 blur-[120px]" />
        </div>

        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-400/30 bg-green-400/10 px-4 py-1.5 text-sm font-medium text-green-400">
          <span className="h-2 w-2 rounded-full bg-green-400" />
          AI-Powered Fitness Platform
        </div>

        {/* Headline */}
        <h1 className="max-w-4xl text-5xl font-black leading-tight tracking-tight md:text-7xl">
          Train Smarter.
          <br />
          <span className="text-green-400">Eat Better.</span>
          <br />
          Get Results.
        </h1>

        <p className="mt-6 max-w-xl text-lg text-gray-400">
          FitStack gives you an exercise library, custom workout plans, diet
          guidance, and an AI coach — everything you need to hit your fitness
          goals.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/workout"
            className="rounded-full bg-green-400 px-8 py-4 text-base font-semibold text-gray-950 transition-opacity hover:opacity-90"
          >
            Generate My Workout
          </Link>
          <Link
            href="/exercises"
            className="rounded-full border border-white/20 bg-white/5 px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-white/10"
          >
            Browse Exercises
          </Link>
        </div>

        {/* Stats bar */}
        <div className="mt-20 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-black text-green-400">{s.value}</div>
              <div className="mt-1 text-sm text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-14 text-center">
          <h2 className="text-3xl font-black tracking-tight md:text-4xl">
            Everything you need.{" "}
            <span className="text-green-400">Nothing you don't.</span>
          </h2>
          <p className="mt-3 text-gray-400">
            Four tools. One goal. Your best shape.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {features.map((f) => (
            <Link
              key={f.href}
              href={f.href}
              className="group relative rounded-2xl border border-white/10 bg-white/5 p-8 transition-all hover:border-green-400/40 hover:bg-white/8"
            >
              <div className="mb-4 text-4xl">{f.icon}</div>
              <h3 className="mb-2 text-xl font-bold">{f.title}</h3>
              <p className="mb-6 text-sm leading-relaxed text-gray-400">
                {f.description}
              </p>
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-green-400 transition-gap group-hover:gap-3">
                {f.cta}
                <span>→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-white/10 px-6 py-24 text-center">
        <h2 className="text-3xl font-black md:text-4xl">
          Ready to start?
        </h2>
        <p className="mt-3 text-gray-400">
          Talk to your AI coach right now — no account needed.
        </p>
        <Link
          href="/coach"
          className="mt-8 inline-block rounded-full bg-green-400 px-10 py-4 text-base font-semibold text-gray-950 transition-opacity hover:opacity-90"
        >
          Chat with AI Coach →
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-gray-600">
        © {new Date().getFullYear()} FitStack. Built with Next.js + Groq AI.
      </footer>
    </div>
  );
}
