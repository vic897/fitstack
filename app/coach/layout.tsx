import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "AI Gym Coach — FitStack",
  description: "Chat with your AI fitness and nutrition coach.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <Suspense>{children}</Suspense>;
}