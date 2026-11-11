"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { logout } from "@/app/auth/actions";
import type { User } from "@supabase/supabase-js";

const links = [
  { href: "/exercises", label: "Exercises" },
  { href: "/workout", label: "Workout" },
  { href: "/diet", label: "Diet" },
  { href: "/coach", label: "AI Coach" },
  { href: "/bmi", label: "BMI" },
  { href: "/progress", label: "Progress" },
];

function UserAvatarIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-3.5 3.6-6 8-6s8 2.5 8 6" />
    </svg>
  );
}

function LogoutIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const supabase = createClient();

      // Get current session
      supabase.auth
        .getUser()
        .then(({ data }) => setUser(data.user))
        .catch(() => setUser(null));

      // Listen for auth changes
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_, session) =>
        setUser(session?.user ?? null)
      );

      return () => subscription.unsubscribe();
    } catch {
      // Allow UI rendering even when Supabase env vars are unset in isolated preview
      return;
    }
  }, []);

  const displayName =
    user?.user_metadata?.full_name?.split(" ")[0] ??
    user?.email?.split("@")[0] ??
    "Account";

  const isRouteActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-primary/10 bg-surface-container-lowest/85 backdrop-blur-xl shadow-[0_12px_32px_-8px_rgba(0,0,0,0.6)]">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-gutter px-margin-mobile sm:px-margin">
        {/* Brand Logo */}
        <div className="flex shrink-0 items-center gap-space-sm">
          <div className="relative flex h-3 w-3 items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </div>
          <Link
            href="/"
            className="flex items-center font-headline-md text-headline-md font-extrabold tracking-tight text-on-surface transition-colors hover:text-primary"
          >
            Fit<span className="text-primary">Stack</span>
          </Link>
          <span className="ml-1 rounded border border-primary/20 bg-surface-container-high px-1.5 py-0.5 font-label-sm text-label-sm uppercase tracking-widest text-primary">
            2.0
          </span>
        </div>

        {/* Desktop Pill Nav */}
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-space-xs rounded-full border border-outline-variant/30 bg-surface-container-low/70 p-1 lg:flex"
        >
          {links.map((l) => {
            const active = isRouteActive(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-full px-space-md py-space-xs font-label-md text-label-md transition-all ${
                  active
                    ? "bg-primary-container font-semibold text-on-primary-container shadow-[0_0_24px_rgba(16,185,129,0.35)]"
                    : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        {/* Auth & Account Controls — Desktop */}
        <div className="hidden shrink-0 items-center gap-space-md lg:flex">
          {user ? (
            <>
              <Link
                href="/my-workouts"
                aria-current={isRouteActive("/my-workouts") ? "page" : undefined}
                className={`inline-flex items-center rounded-full border px-space-md py-space-xs font-label-md text-label-md transition-all ${
                  isRouteActive("/my-workouts")
                    ? "border-primary bg-primary-container font-semibold text-on-primary-container shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                    : "border-outline-variant/40 bg-surface-container-high/60 text-on-surface hover:border-primary/40 hover:text-primary"
                }`}
              >
                My Workouts
              </Link>
              <div className="flex items-center gap-space-sm border-l border-outline-variant/40 pl-space-sm">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-on-primary ring-2 ring-primary/20">
                    <UserAvatarIcon className="h-[18px] w-[18px]" />
                  </div>
                  <div className="hidden flex-col xl:flex">
                    <span className="max-w-[110px] truncate font-label-md text-label-md font-semibold leading-none text-on-surface">
                      {displayName}
                    </span>
                  </div>
                </div>
                <form action={logout}>
                  <button
                    type="submit"
                    title="Sign out"
                    aria-label="Sign out"
                    className="rounded-lg p-1.5 font-label-md text-label-md text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-error focus-visible:outline-2 focus-visible:outline-primary"
                  >
                    <LogoutIcon className="block h-5 w-5" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-space-sm">
              <Link
                href="/login"
                className="rounded-full px-space-md py-1.5 font-label-md text-label-md font-medium text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-primary-container px-space-md py-2 font-label-md text-label-md font-semibold text-on-primary-container shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:bg-primary"
              >
                Get started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          type="button"
          className="flex flex-col gap-1.5 rounded-lg p-2 text-on-surface transition-colors hover:bg-surface-container-high lg:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span
            className={`block h-0.5 w-6 bg-on-surface transition-all ${
              open ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-on-surface transition-all ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-on-surface transition-all ${
              open ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="border-t border-outline-variant/30 bg-surface-container-lowest/95 px-margin-mobile pb-6 pt-4 backdrop-blur-xl sm:px-margin lg:hidden">
          <div className="flex flex-col gap-2">
            {links.map((l) => {
              const active = isRouteActive(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-xl px-4 py-2.5 font-body-md text-body-md font-medium transition-colors ${
                    active
                      ? "bg-primary-container font-semibold text-on-primary-container"
                      : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}

            <div className="my-2 border-t border-outline-variant/25 pt-3">
              {user ? (
                <div className="flex flex-col gap-2">
                  <Link
                    href="/my-workouts"
                    onClick={() => setOpen(false)}
                    className={`rounded-xl px-4 py-2.5 font-body-md text-body-md font-medium transition-colors ${
                      isRouteActive("/my-workouts")
                        ? "bg-primary-container font-semibold text-on-primary-container"
                        : "text-on-surface hover:bg-surface-container-high"
                    }`}
                  >
                    My Workouts
                  </Link>
                  <div className="flex items-center justify-between px-4 py-2">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-on-primary">
                        <UserAvatarIcon className="h-4 w-4" />
                      </div>
                      <span className="font-label-md text-label-md font-semibold text-on-surface">
                        {displayName}
                      </span>
                    </div>
                    <form action={logout}>
                      <button
                        type="submit"
                        onClick={() => setOpen(false)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-outline-variant/40 px-3 py-1.5 font-label-md text-label-md text-on-surface-variant transition-colors hover:border-error/40 hover:text-error focus-visible:outline-2 focus-visible:outline-primary"
                      >
                        <LogoutIcon className="h-4 w-4" />
                        Sign out
                      </button>
                    </form>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="rounded-xl border border-outline-variant/30 px-4 py-2.5 text-center font-body-md text-body-md font-medium text-on-surface transition-colors hover:bg-surface-container-high"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setOpen(false)}
                    className="rounded-full bg-primary-container px-4 py-2.5 text-center font-body-md text-body-md font-semibold text-on-primary-container shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                  >
                    Get started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
