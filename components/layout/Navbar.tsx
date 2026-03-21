"use client";
import Link from "next/link";
import { useState } from "react";

const links = [
  { href: "/exercises", label: "Exercises" },
  { href: "/workout", label: "Workout" },
  { href: "/diet", label: "Diet" },
  { href: "/coach", label: "AI Coach" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-gray-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-black tracking-tight text-white">
            Fit<span className="text-green-400">Stack</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-gray-400 transition-colors hover:text-white"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/coach"
            className="rounded-full bg-green-400 px-4 py-2 text-sm font-semibold text-gray-950 transition-opacity hover:opacity-90"
          >
            Start Free
          </Link>
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
            <Link
              href="/coach"
              className="mt-2 rounded-full bg-green-400 px-4 py-2 text-center text-sm font-semibold text-gray-950"
              onClick={() => setOpen(false)}
            >
              Start Free
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}