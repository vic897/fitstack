"use client";

import { useState } from "react";

interface PasswordInputProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  autoComplete: "current-password" | "new-password";
  minLength?: number;
  disabled?: boolean;
  error?: string;
  hint?: string;
}

export default function PasswordInput({
  id,
  name,
  label,
  value,
  onChange,
  placeholder,
  autoComplete,
  minLength,
  disabled = false,
  error,
  hint,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  const describedBy = error
    ? `${id}-error`
    : hint
    ? `${id}-hint`
    : undefined;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <label
          htmlFor={id}
          className="block font-label-md text-label-md font-semibold uppercase tracking-wider text-on-surface-variant"
        >
          {label}
        </label>
        {hint && !error && (
          <span
            id={`${id}-hint`}
            className="font-label-sm text-label-sm text-outline"
          >
            {hint}
          </span>
        )}
      </div>

      <div className="relative">
        <span
          aria-hidden="true"
          className="material-symbols-outlined pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px] text-outline"
        >
          lock
        </span>

        <input
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required
          minLength={minLength}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={`h-12 w-full rounded-xl border bg-surface-container-lowest/90 pl-10 pr-12 font-body-md text-body-md text-on-surface shadow-inner outline-none transition placeholder:text-outline/70 disabled:cursor-not-allowed disabled:opacity-60 ${
            error
              ? "border-error/70 focus:border-error focus:ring-2 focus:ring-error/25"
              : "border-outline-variant/35 focus:border-primary focus:ring-2 focus:ring-primary/25"
          }`}
        />

        <button
          type="button"
          onClick={() => setVisible((prev) => !prev)}
          disabled={disabled}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface focus-visible:outline-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-[19px]">
            {visible ? "visibility_off" : "visibility"}
          </span>
        </button>
      </div>

      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="flex items-center gap-1.5 font-label-md text-label-md text-error"
        >
          <span className="material-symbols-outlined text-[15px]">error</span>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
