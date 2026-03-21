"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { logout } from "@/app/auth/actions";
import type { User } from "@supabase/supabase-js";

const links = [
  { href: "/exercises", label: "Exercises" },
  { href: "/workout",   label: "Workout" },
  { href: "/diet",      label: "Diet" },
  { href: "/coach",     label: "AI Coach" },
  { href: "/bmi",       label: "BMI" },
  { href: "/progress",  label: "Progress" },  
];

export default function Navbar() {
  const [open, setOpen]   = useState(false);
  const [user, setUser]   = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();

    // Get current session
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_, session) => setUser(session?.user ?? null)
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-gray-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="text-xl font-black tracking-tight text-white">
          Fit<span className="text-green-400">Stack</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-gray-400 transition-colors hover:text-white"
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Auth buttons — desktop */}
        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Link
                href="/my-workouts"
                className="text-sm font-medium text-gray-400 transition-colors hover:text-white"
              >
                My Workouts
              </Link>
              <span className="text-xs text-gray-600">
                {user.user_metadata?.full_name?.split(" ")[0] ?? user.email}
              </span>
              <form action={logout}>
                <button
                  type="submit"
                  className="rounded-full border border-white/10 px-4 py-1.5 text-sm font-semibold text-gray-300 transition-colors hover:border-white/20 hover:text-white"
                >
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-gray-400 transition-colors hover:text-white"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-green-400 px-4 py-2 text-sm font-semibold text-gray-950 transition-opacity hover:opacity-90"
              >
                Get started
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="flex flex-col gap-1.5 md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <span className={`block h-0.5 w-6 bg-white transition-all ${open ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`block h-0.5 w-6 bg-white transition-all ${open ? "opacity-0" : ""}`} />
          <span className={`block h-0.5 w-6 bg-white transition-all ${open ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-white/10 bg-gray-950 px-6 pb-6 md:hidden">
          <div className="mt-4 flex flex-col gap-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-gray-400 hover:text-white"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link href="/my-workouts" className="text-sm font-medium text-gray-400 hover:text-white" onClick={() => setOpen(false)}>
                  My Workouts
                </Link>
                <form action={logout}>
                  <button type="submit" className="text-sm font-medium text-gray-400 hover:text-white">
                    Sign out
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-gray-400 hover:text-white" onClick={() => setOpen(false)}>
                  Sign in
                </Link>
                <Link href="/signup" className="mt-2 rounded-full bg-green-400 px-4 py-2 text-center text-sm font-semibold text-gray-950" onClick={() => setOpen(false)}>
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}