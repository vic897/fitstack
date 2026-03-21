import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Workout Generator — FitStack",
  description: "Generate a personalized weekly workout plan.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}