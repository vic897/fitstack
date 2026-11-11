"use client";

import Link from "next/link";
import { useActionState, useState, type FormEvent } from "react";
import { login, signup, type AuthActionState } from "@/app/auth/actions";
import PasswordInput from "@/components/auth/PasswordInput";

type AuthMode = "login" | "signup";

interface AuthFormProps {
  mode: AuthMode;
  redirectTo: string;
  initialError?: string;
}

type FieldErrors = {
  name?: string;
  email?: string;
  password?: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const INITIAL_STATE: AuthActionState = {
  status: "idle",
};

export default function AuthForm({
  mode,
  redirectTo,
  initialError,
}: AuthFormProps) {
  const isSignup = mode === "signup";
  const action = isSignup ? signup : login;

  const [state, formAction, isPending] = useActionState(action, INITIAL_STATE);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [clientErrors, setClientErrors] = useState<FieldErrors>({});
  const [hasClientSubmitAttempt, setHasClientSubmitAttempt] = useState(false);
  const [dismissedConfirmation, setDismissedConfirmation] = useState(false);

  const mergedFieldErrors: FieldErrors = {
    ...(hasClientSubmitAttempt ? {} : state.fieldErrors),
    ...clientErrors,
  };

  const bannerError =
    hasClientSubmitAttempt && Object.keys(clientErrors).length > 0
      ? "Please fix the highlighted fields before continuing."
      : state.status === "error"
      ? state.message
      : !hasClientSubmitAttempt
      ? initialError
      : undefined;

  const showConfirmation =
    isSignup && state.status === "confirmation_required" && !dismissedConfirmation;

  const alternateHref = isSignup
    ? redirectTo !== "/"
      ? `/login?redirectTo=${encodeURIComponent(redirectTo)}`
      : "/login"
    : redirectTo !== "/"
    ? `/signup?redirectTo=${encodeURIComponent(redirectTo)}`
    : "/signup";

  function validate(): FieldErrors {
    const errors: FieldErrors = {};

    if (isSignup && name.trim().length < 2) {
      errors.name = "Enter your full name (at least 2 characters).";
    }

    if (!EMAIL_PATTERN.test(email.trim())) {
      errors.email = "Enter a valid email address.";
    }

    if (isSignup) {
      if (password.length < 6) {
        errors.password = "Password must be at least 6 characters.";
      }
    } else if (!password) {
      errors.password = "Enter your password.";
    }

    return errors;
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    setHasClientSubmitAttempt(true);
    setDismissedConfirmation(false);

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      e.preventDefault();
      setClientErrors(errors);
      return;
    }

    setClientErrors({});
  }

  function clearFieldError(field: keyof FieldErrors) {
    if (clientErrors[field]) {
      setClientErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  if (showConfirmation) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="space-y-5 rounded-2xl border border-primary/35 bg-primary/10 p-5"
      >
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-primary">
            <span className="material-symbols-outlined text-[22px]">
              mark_email_read
            </span>
          </div>
          <div className="space-y-1">
            <h3 className="font-title-lg text-title-lg font-bold text-on-surface">
              Confirm your email address
            </h3>
            <p className="font-body-md text-body-md leading-relaxed text-on-surface-variant">
              {state.message}
            </p>
            {state.email && (
              <p className="pt-1 font-label-md text-label-md font-semibold text-primary">
                Sent to {state.email}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2.5 pt-1 sm:flex-row">
          <Link
            href={
              redirectTo !== "/"
                ? `/login?redirectTo=${encodeURIComponent(redirectTo)}`
                : "/login"
            }
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-primary-container px-5 py-3 font-label-md text-body-md font-bold text-on-primary-container shadow-[0_0_24px_rgba(16,185,129,0.35)] transition-all hover:bg-primary"
          >
            <span>Go to Sign In</span>
            <span className="material-symbols-outlined text-[18px]">
              arrow_forward
            </span>
          </Link>
          <button
            type="button"
            onClick={() => {
              setDismissedConfirmation(true);
              setPassword("");
            }}
            className="inline-flex items-center justify-center rounded-full border border-outline-variant/40 bg-surface-container-high/60 px-4 py-3 font-label-md text-label-md font-semibold text-on-surface transition-colors hover:border-primary/40 hover:text-primary"
          >
            Use another email
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {bannerError && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-xl border border-error/35 bg-error-container/30 px-4 py-3 text-body-md text-error"
        >
          <span className="material-symbols-outlined mt-0.5 shrink-0 text-[18px]">
            error
          </span>
          <span className="leading-snug">{bannerError}</span>
        </div>
      )}

      <form
        action={formAction}
        onSubmit={handleSubmit}
        noValidate
        className="space-y-4"
      >
        <input type="hidden" name="redirectTo" value={redirectTo} />

        {isSignup && (
          <div className="space-y-1.5">
            <label
              htmlFor="auth-name"
              className="block font-label-md text-label-md font-semibold uppercase tracking-wider text-on-surface-variant"
            >
              Full Name
            </label>
            <div className="relative">
              <span
                aria-hidden="true"
                className="material-symbols-outlined pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px] text-outline"
              >
                person
              </span>
              <input
                id="auth-name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  clearFieldError("name");
                }}
                disabled={isPending}
                placeholder="Alex Mercer"
                aria-invalid={Boolean(mergedFieldErrors.name)}
                aria-describedby={
                  mergedFieldErrors.name ? "auth-name-error" : undefined
                }
                className={`h-12 w-full rounded-xl border bg-surface-container-lowest/90 pl-10 pr-4 font-body-md text-body-md text-on-surface shadow-inner outline-none transition placeholder:text-outline/70 disabled:cursor-not-allowed disabled:opacity-60 ${
                  mergedFieldErrors.name
                    ? "border-error/70 focus:border-error focus:ring-2 focus:ring-error/25"
                    : "border-outline-variant/35 focus:border-primary focus:ring-2 focus:ring-primary/25"
                }`}
              />
            </div>
            {mergedFieldErrors.name && (
              <p
                id="auth-name-error"
                role="alert"
                className="flex items-center gap-1.5 font-label-md text-label-md text-error"
              >
                <span className="material-symbols-outlined text-[15px]">
                  error
                </span>
                <span>{mergedFieldErrors.name}</span>
              </p>
            )}
          </div>
        )}

        <div className="space-y-1.5">
          <label
            htmlFor="auth-email"
            className="block font-label-md text-label-md font-semibold uppercase tracking-wider text-on-surface-variant"
          >
            Email Address
          </label>
          <div className="relative">
            <span
              aria-hidden="true"
              className="material-symbols-outlined pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px] text-outline"
            >
              mail
            </span>
            <input
              id="auth-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                clearFieldError("email");
              }}
              disabled={isPending}
              placeholder="you@example.com"
              aria-invalid={Boolean(mergedFieldErrors.email)}
              aria-describedby={
                mergedFieldErrors.email ? "auth-email-error" : undefined
              }
              className={`h-12 w-full rounded-xl border bg-surface-container-lowest/90 pl-10 pr-4 font-body-md text-body-md text-on-surface shadow-inner outline-none transition placeholder:text-outline/70 disabled:cursor-not-allowed disabled:opacity-60 ${
                mergedFieldErrors.email
                  ? "border-error/70 focus:border-error focus:ring-2 focus:ring-error/25"
                  : "border-outline-variant/35 focus:border-primary focus:ring-2 focus:ring-primary/25"
              }`}
            />
          </div>
          {mergedFieldErrors.email && (
            <p
              id="auth-email-error"
              role="alert"
              className="flex items-center gap-1.5 font-label-md text-label-md text-error"
            >
              <span className="material-symbols-outlined text-[15px]">
                error
              </span>
              <span>{mergedFieldErrors.email}</span>
            </p>
          )}
        </div>

        <PasswordInput
          id="auth-password"
          name="password"
          label="Password"
          value={password}
          onChange={(val) => {
            setPassword(val);
            clearFieldError("password");
          }}
          placeholder={isSignup ? "Minimum 6 characters" : "Enter your password"}
          autoComplete={isSignup ? "new-password" : "current-password"}
          minLength={isSignup ? 6 : undefined}
          hint={isSignup ? "6+ characters" : undefined}
          disabled={isPending}
          error={mergedFieldErrors.password}
        />

        <button
          type="submit"
          disabled={isPending}
          aria-busy={isPending}
          className="group relative mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary via-primary-container to-secondary-container px-6 font-title-lg text-[0.95rem] font-bold text-on-primary shadow-[0_0_28px_rgba(16,185,129,0.38)] transition-all duration-200 hover:shadow-[0_0_36px_rgba(78,222,163,0.55)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPending ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-on-primary/30 border-t-on-primary" />
              <span>{isSignup ? "Creating account..." : "Signing in..."}</span>
            </>
          ) : (
            <>
              <span>{isSignup ? "Create Free Account" : "Sign In"}</span>
              <span className="material-symbols-outlined text-[19px] transition-transform duration-200 group-hover:translate-x-1">
                arrow_forward
              </span>
            </>
          )}
        </button>
      </form>

      <div className="border-t border-outline-variant/25 pt-4 text-center">
        <p className="font-body-md text-body-md text-on-surface-variant">
          {isSignup ? "Already have an account?" : "New to FitStack?"}{" "}
          <Link
            href={alternateHref}
            className="font-semibold text-primary transition-colors hover:text-secondary-fixed hover:underline"
          >
            {isSignup ? "Sign in" : "Create an account"}
          </Link>
        </p>
      </div>
    </div>
  );
}
