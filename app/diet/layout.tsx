import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Diet Guide — FitStack",
  description: "Simple meal plans for muscle gain and fat loss.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}