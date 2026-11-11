import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative z-10 mt-space-xl w-full border-t border-outline-variant/20 bg-surface-container-lowest/90">
      <div className="mx-auto max-w-[1200px] px-margin-mobile py-space-xl sm:px-margin">
        <div className="grid grid-cols-1 items-start gap-gutter border-b border-outline-variant/15 pb-space-xl md:grid-cols-12">
          <div className="flex flex-col gap-space-xs md:col-span-4">
            <div className="flex items-center gap-space-sm">
              <div className="h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_12px_#4edea3]" />
              <span className="font-headline-md text-headline-md font-extrabold tracking-tight text-on-surface">
                Fit<span className="text-primary">Stack</span>
              </span>
            </div>
            <p className="max-w-sm font-body-md text-body-md text-on-surface-variant">
              Engineered for Peak Human Performance. Biometric precision,
              adaptive periodization, and neural training telemetry.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-gutter sm:grid-cols-3 md:col-span-8">
            <div className="flex flex-col gap-space-sm">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">
                Training Engine
              </span>
              <nav className="flex flex-col gap-space-xs">
                <Link
                  href="/exercises"
                  className="font-body-md text-body-md text-on-surface-variant transition-colors hover:text-primary"
                >
                  Exercises
                </Link>
                <Link
                  href="/workout"
                  className="font-body-md text-body-md text-on-surface-variant transition-colors hover:text-primary"
                >
                  Workout Generator
                </Link>
                <Link
                  href="/my-workouts"
                  className="font-body-md text-body-md text-on-surface-variant transition-colors hover:text-primary"
                >
                  My Workouts
                </Link>
              </nav>
            </div>

            <div className="flex flex-col gap-space-sm">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">
                Intelligence
              </span>
              <nav className="flex flex-col gap-space-xs">
                <Link
                  href="/coach"
                  className="font-body-md text-body-md text-on-surface-variant transition-colors hover:text-primary"
                >
                  AI Gym Coach
                </Link>
                <Link
                  href="/diet"
                  className="font-body-md text-body-md text-on-surface-variant transition-colors hover:text-primary"
                >
                  Diet Guide
                </Link>
                <Link
                  href="/bmi"
                  className="font-body-md text-body-md text-on-surface-variant transition-colors hover:text-primary"
                >
                  BMI Calculator
                </Link>
              </nav>
            </div>

            <div className="flex flex-col gap-space-sm">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">
                Telemetry
              </span>
              <nav className="flex flex-col gap-space-xs">
                <Link
                  href="/progress"
                  className="font-body-md text-body-md text-on-surface-variant transition-colors hover:text-primary"
                >
                  Progress Tracking
                </Link>
                <Link
                  href="/login"
                  className="font-body-md text-body-md text-on-surface-variant transition-colors hover:text-primary"
                >
                  Sign In
                </Link>
                <span className="flex items-center gap-1.5 font-body-md text-body-md text-on-surface-variant">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  System Operational
                </span>
              </nav>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-space-md pt-space-lg sm:flex-row">
          <p className="font-body-md text-body-md text-on-surface-variant/80">
            © {new Date().getFullYear()} FitStack Technologies. Built for peak
            athletics.
          </p>
          <div className="flex items-center gap-space-md">
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-outline">
              FitStack Architecture v2.0
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
