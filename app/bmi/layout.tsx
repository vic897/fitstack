import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BMI Calculator — FitStack",
  description: "Calculate your Body Mass Index and get personalised fitness tips.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}