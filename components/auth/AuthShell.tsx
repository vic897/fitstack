import type { ReactNode } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

type AuthMode = "login" | "signup";

interface AuthShellProps {
  mode: AuthMode;
  title: string;
  subtitle: string;
  children: ReactNode;
}

const HIGHLIGHTS = [
  {
    icon: "bookmark_added",
    title: "Saved Workout Library",
    desc: "Store AI-generated 7-day training splits and access them anytime.",
  },
  {
    icon: "monitoring",
    title: "Progress Telemetry",
    desc: "Log body weight trends and track momentum across training blocks.",
  },
  {
    icon: "neurology",
    title: "Context-Aware AI Coach",
    desc: "Sync your latest goal, training level, and weight with Groq AI.",
  },
];

export default function AuthShell({
  mode,
  title,
  subtitle,
  children,
}: AuthShellProps) {
  const isLogin = mode === "login";

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-clip bg-surface-container-lowest text-on-surface">
      {/* Ambient Emerald Lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        <div className="absolute -top-[18%] left-1/2 h-[480px] w-[900px] -translate-x-1/2 rounded-full bg-primary/10 blur-[140px]" />
        <div className="absolute right-[-10%] top-[35%] h-[420px] w-[520px] rounded-full bg-secondary-container/8 blur-[150px]" />
        <div className="absolute bottom-[-12%] left-[-8%] h-[460px] w-[560px] rounded-full bg-primary-container/8 blur-[160px]" />
      </div>

      <Navbar />

      <main className="relative z-10 flex w-full flex-1 items-center pt-20">
        <div className="mx-auto w-full max-w-[1200px] px-margin-mobile py-space-lg sm:px-margin lg:py-space-xl">
          <div className="grid grid-cols-1 items-center gap-gutter lg:grid-cols-12 lg:gap-12">
            {/* Desktop Split-Screen Brand & Telemetry Panel */}
            <aside className="hidden flex-col gap-space-lg lg:col-span-6 lg:flex">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/25 bg-surface-container-high/80 px-3.5 py-1.5 shadow-[0_0_20px_rgba(78,222,163,0.12)] backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
                <span className="font-label-sm text-label-sm font-bold uppercase tracking-widest text-primary">
                  {isLogin
                    ? "Athletic Portal — FitStack 2.0"
                    : "Create Profile — FitStack 2.0"}
                </span>
              </div>

              <div className="space-y-space-sm">
                <h1 className="font-headline-xl text-headline-lg font-extrabold leading-[1.1] tracking-tight text-on-surface xl:text-[3rem] xl:leading-[3.4rem]">
                  {isLogin ? (
                    <>
                      Resume Your{" "}
                      <span className="bg-gradient-to-r from-primary via-secondary-fixed to-secondary-container bg-clip-text text-transparent">
                        Training Stack.
                      </span>
                    </>
                  ) : (
                    <>
                      Build Your{" "}
                      <span className="bg-gradient-to-r from-primary via-secondary-fixed to-secondary-container bg-clip-text text-transparent">
                        Performance Core.
                      </span>
                    </>
                  )}
                </h1>
                <p className="max-w-lg font-body-lg text-body-lg leading-relaxed text-on-surface-variant">
                  {isLogin
                    ? "Sign in to unlock your saved weekly splits, body weight telemetry, and personalized AI coach context."
                    : "Create a free FitStack account to save AI-generated workout programs, log progress metrics, and personalize coaching."}
                </p>
              </div>

              <div className="grid gap-space-sm">
                {HIGHLIGHTS.map((item) => (
                  <div
                    key={item.title}
                    className="flex items-start gap-space-md rounded-2xl border border-outline-variant/25 bg-surface-container-low/65 p-space-md backdrop-blur-xl transition-colors hover:border-primary/35"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                      <span className="material-symbols-outlined text-[20px]">
                        {item.icon}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <h2 className="font-title-lg text-[1rem] font-semibold text-on-surface">
                        {item.title}
                      </h2>
                      <p className="mt-0.5 font-body-md text-body-md text-on-surface-variant">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-x-space-md gap-y-2 pt-1 font-label-md text-label-md text-outline">
                <span className="flex items-center gap-1.5 text-on-surface-variant">
                  <span className="material-symbols-outlined text-[17px] text-primary">
                    verified_user
                  </span>
                  Supabase Encrypted Auth
                </span>
                <span className="text-outline-variant">•</span>
                <span className="flex items-center gap-1.5 text-on-surface-variant">
                  <span className="material-symbols-outlined text-[17px] text-primary">
                    bolt
                  </span>
                  Free Forever Core
                </span>
              </div>
            </aside>

            {/* Auth Form Card (Single-column centered on mobile, right column on desktop) */}
            <section className="w-full lg:col-span-6">
              <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-3xl border border-outline-variant/30 bg-surface-container-low/80 p-6 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.7)] backdrop-blur-2xl sm:p-8">
                {/* Subtle Top Emerald Accent Line */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"
                />

                {/* Mobile Context Pill */}
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-surface-container-high/80 px-3 py-1 lg:hidden">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span className="font-label-sm text-label-sm font-bold uppercase tracking-wider text-primary">
                    FitStack 2.0
                  </span>
                </div>

                <div className="mb-6">
                  <h2 className="font-headline-md text-headline-lg-mobile font-bold tracking-tight text-on-surface sm:text-[1.75rem]">
                    {title}
                  </h2>
                  <p className="mt-1.5 font-body-md text-body-md text-on-surface-variant">
                    {subtitle}
                  </p>
                </div>

                {children}
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
