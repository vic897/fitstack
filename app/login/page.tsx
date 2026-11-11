import type { Metadata } from "next";
import AuthForm from "@/components/auth/AuthForm";
import AuthShell from "@/components/auth/AuthShell";
import {
  resolveAuthPageProps,
  type AuthSearchParams,
} from "@/lib/auth/authPage";

export const metadata: Metadata = {
  title: "Sign In — FitStack",
  description: "Sign in to access your saved workouts, progress, and AI coach.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: AuthSearchParams;
}) {
  const { redirectTo, initialError } = await resolveAuthPageProps(searchParams);

  return (
    <AuthShell
      mode="login"
      title="Welcome back"
      subtitle="Sign in with your email and password to continue."
    >
      <AuthForm
        mode="login"
        redirectTo={redirectTo}
        initialError={initialError}
      />
    </AuthShell>
  );
}
