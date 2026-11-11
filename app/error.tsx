"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-x-clip bg-surface-container-lowest px-margin-mobile py-space-xl text-on-surface sm:px-margin">
      {/* Ambient Emerald & Subtle Alert Lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        <div className="absolute -top-32 left-1/2 h-[420px] w-[780px] -translate-x-1/2 rounded-full bg-primary/10 blur-[140px]" />
        <div className="absolute bottom-[-15%] right-[-10%] h-[380px] w-[480px] rounded-full bg-error-container/15 blur-[150px]" />
      </div>

      <main className="relative z-10 w-full max-w-md">
        <div
          role="alert"
          className="relative overflow-hidden rounded-3xl border border-outline-variant/30 bg-surface-container-low/85 p-6 text-center shadow-[0_24px_60px_-12px_rgba(0,0,0,0.7)] backdrop-blur-2xl sm:p-8"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-error/60 to-transparent"
          />

          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-error/30 bg-error-container/35 text-error shadow-[0_0_24px_rgba(255,180,171,0.15)]">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-7 w-7"
            >
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-error/25 bg-error-container/25 px-3 py-1 font-label-sm text-label-sm font-bold uppercase tracking-widest text-error">
            System Interrupted
          </span>

          <h1 className="mt-4 font-headline-md text-headline-lg-mobile font-bold tracking-tight text-on-surface sm:text-[1.75rem]">
            Something went wrong
          </h1>

          <p className="mt-2 font-body-md text-body-md leading-relaxed text-on-surface-variant">
            {error.message ||
              "An unexpected error occurred while rendering this view. Please try again."}
          </p>

          {error.digest && (
            <p className="mt-3 font-label-sm text-label-sm uppercase tracking-wider text-outline">
              Ref: {error.digest}
            </p>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={reset}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary via-primary-container to-secondary-container px-6 py-3 font-title-lg text-[0.95rem] font-bold text-on-primary shadow-[0_0_28px_rgba(16,185,129,0.35)] transition-all hover:shadow-[0_0_36px_rgba(78,222,163,0.55)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-[0.99]"
            >
              Try again
            </button>
            <Link
              href="/"
              className="inline-flex flex-1 items-center justify-center rounded-full border border-outline-variant/40 bg-surface-container-high/60 px-6 py-3 font-label-md text-[0.95rem] font-semibold text-on-surface transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Go home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
