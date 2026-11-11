"use client";

import { useCallback, useEffect, useState } from "react";

type ToastType = "error" | "success" | "info";

type ToastProps = {
  message: string;
  type?: ToastType;
  onClose: () => void;
};

function ToastIcon({ type }: { type: ToastType }) {
  if (type === "success") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4"
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
    );
  }

  if (type === "error") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4"
      >
        <circle cx="12" cy="12" r="9" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

export function Toast({ message, type = "error", onClose }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), 10);
    const hideTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, 4000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [onClose]);

  const containerStyles: Record<ToastType, string> = {
    error: "border-error/40 bg-surface-container-low/95 text-on-surface",
    success: "border-primary/40 bg-surface-container-low/95 text-on-surface",
    info: "border-outline-variant/45 bg-surface-container-low/95 text-on-surface",
  };

  const badgeStyles: Record<ToastType, string> = {
    error: "border-error/30 bg-error-container/40 text-error",
    success: "border-primary/30 bg-primary/15 text-primary",
    info: "border-outline-variant/40 bg-surface-container-high text-on-surface-variant",
  };

  return (
    <div
      role={type === "error" ? "alert" : "status"}
      aria-live={type === "error" ? "assertive" : "polite"}
      className={`fixed bottom-4 left-4 right-4 z-50 flex items-center gap-3 rounded-2xl border px-4 py-3 font-body-md text-body-md font-medium shadow-[0_16px_40px_rgba(0,0,0,0.65)] backdrop-blur-xl transition-all duration-300 sm:bottom-6 sm:left-auto sm:right-6 sm:max-w-sm ${
        containerStyles[type]
      } ${visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
    >
      <span
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border ${badgeStyles[type]}`}
      >
        <ToastIcon type={type} />
      </span>

      <span className="min-w-0 flex-1 break-words leading-snug text-on-surface [overflow-wrap:anywhere]">
        {message}
      </span>

      <button
        type="button"
        aria-label="Dismiss notification"
        onClick={() => {
          setVisible(false);
          setTimeout(onClose, 300);
        }}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface focus-visible:outline-2 focus-visible:outline-primary"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </button>
    </div>
  );
}

// ── Hook for easy usage ────────────────────────────────────────
export function useToast() {
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  const showToast = useCallback(
    (message: string, type: ToastType = "error") => {
      setToast({ message, type });
    },
    []
  );

  const ToastComponent = toast ? (
    <Toast
      message={toast.message}
      type={toast.type}
      onClose={() => setToast(null)}
    />
  ) : null;

  return { showToast, ToastComponent };
}
