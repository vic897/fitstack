import type { Metadata } from "next";
import AuthForm from "@/components/auth/AuthForm";
import AuthShell from "@/components/auth/AuthShell";
import {
  resolveAuthPageProps,
  type AuthSearchParams,
} from "@/lib/auth/authPage";

export const metadata: Metadata = {
  title: "Create Account — FitStack",
  description:
    "Create your free FitStack account to save workouts and track progress.",
};

export default async function SignupPage({
  searchParams,
}: {
  searchParams: AuthSearchParams;
}) {
  const { redirectTo, initialError } = await resolveAuthPageProps(searchParams);

  return (
    <AuthShell
      mode="signup"
      title="Create your account"
      subtitle="Start saving workouts and logging progress in under a minute."
    >
      <AuthForm
        mode="signup"
        redirectTo={redirectTo}
        initialError={initialError}
      />
    </AuthShell>
  );
}
