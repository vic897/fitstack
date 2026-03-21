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
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-950 px-4 text-white">
      <div className="mb-4 text-6xl">⚠️</div>
      <h1 className="mb-2 text-2xl font-black">Something went wrong</h1>
      <p className="mb-8 max-w-sm text-center text-sm text-gray-400">
        {error.message || "An unexpected error occurred. Please try again."}
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="rounded-full bg-green-400 px-6 py-3 text-sm font-bold text-gray-950 hover:opacity-90"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-full border border-white/10 px-6 py-3 text-sm font-semibold text-gray-300 hover:border-white/20"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}