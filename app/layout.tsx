import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FitStack — AI Fitness Platform",
  description: "Workouts, diet plans, and AI coaching powered by Groq AI",
  keywords: ["fitness", "workout", "diet", "AI coach", "gym"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-white antialiased">
        {children}
      </body>
    </html>
  );
}