import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-950 text-white">
      <div className="mb-4 text-6xl">🏋️</div>
      <h1 className="mb-2 text-3xl font-black">Page not found</h1>
      <p className="mb-8 text-gray-400">That page doesn't exist — let's get you back on track.</p>
      <Link
        href="/"
        className="rounded-full bg-green-400 px-8 py-3 font-bold text-gray-950 hover:opacity-90"
      >
        Back to FitStack
      </Link>
    </div>
  );
}