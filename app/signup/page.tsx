import Link from "next/link";
import { signup } from "@/app/auth/actions";

export default function SignupPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link href="/" className="text-2xl font-black text-white">
            Fit<span className="text-green-400">Stack</span>
          </Link>
          <p className="mt-2 text-sm text-gray-400">
            Create your free account
          </p>
        </div>

        {/* Error */}
        {searchParams.error && (
          <div className="mb-4 rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm text-red-400">
            {decodeURIComponent(searchParams.error)}
          </div>
        )}

        {/* Form */}
        <form action={signup} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-300">
              Full name
            </label>
            <input
              name="name"
              type="text"
              required
              placeholder="Vinay Kumar"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition focus:border-green-400/50 focus:ring-1 focus:ring-green-400/20"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition focus:border-green-400/50 focus:ring-1 focus:ring-green-400/20"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              placeholder="At least 6 characters"
              minLength={6}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition focus:border-green-400/50 focus:ring-1 focus:ring-green-400/20"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-green-400 py-3 text-sm font-bold text-gray-950 transition-opacity hover:opacity-90"
          >
            Create account →
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-green-400 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}