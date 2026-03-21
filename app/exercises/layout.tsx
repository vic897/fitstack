import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Exercise Library — FitStack",
  description: "Browse exercises by muscle group and difficulty.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}