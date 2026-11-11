import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-clip bg-surface-container-lowest text-on-surface">
      {/* Ambient Emerald Lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        <div className="absolute -top-32 left-1/2 h-[440px] w-[820px] -translate-x-1/2 rounded-full bg-primary/10 blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[-8%] h-[380px] w-[460px] rounded-full bg-secondary-container/8 blur-[150px]" />
      </div>

      <Navbar />

      <main className="relative z-10 flex w-full flex-1 items-center justify-center px-margin-mobile pb-space-xl pt-24 sm:px-margin">
        <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-outline-variant/30 bg-surface-container-low/80 p-6 text-center shadow-[0_24px_60px_-12px_rgba(0,0,0,0.7)] backdrop-blur-2xl sm:p-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"
          />

          <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-surface-container-high/80 px-3.5 py-1.5">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <span className="font-label-sm text-label-sm font-bold uppercase tracking-widest text-primary">
              Error 404
            </span>
          </div>

          <p className="mt-5 font-display text-6xl font-extrabold tracking-tight text-on-surface sm:text-7xl">
            4<span className="text-primary">0</span>4
          </p>

          <h1 className="mt-3 font-headline-md text-headline-lg-mobile font-bold tracking-tight text-on-surface sm:text-[1.75rem]">
            Page not found
          </h1>

          <p className="mx-auto mt-2.5 max-w-md font-body-md text-body-md leading-relaxed text-on-surface-variant">
            The route you requested doesn&apos;t exist or may have moved. Head
            back to the homepage or build a custom training split.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary via-primary-container to-secondary-container px-6 py-3 font-title-lg text-[0.95rem] font-bold text-on-primary shadow-[0_0_28px_rgba(16,185,129,0.35)] transition-all hover:shadow-[0_0_36px_rgba(78,222,163,0.55)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <span>Back to FitStack</span>
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>

            <Link
              href="/workout"
              className="inline-flex items-center justify-center rounded-full border border-outline-variant/40 bg-surface-container-high/60 px-6 py-3 font-label-md text-[0.95rem] font-semibold text-on-surface transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Workout Generator
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
