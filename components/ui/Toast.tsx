"use client";

import { useEffect, useState } from "react";

type ToastProps = {
  message: string;
  type?: "error" | "success" | "info";
  onClose: () => void;
};

export function Toast({ message, type = "error", onClose }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Animate in
    const showTimer = setTimeout(() => setVisible(true), 10);
    // Auto-dismiss after 4s
    const hideTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, 4000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [onClose]);

  const styles = {
    error: "border-red-400/30 bg-gray-900 text-red-400",
    success: "border-green-400/30 bg-gray-900 text-green-400",
    info: "border-white/20 bg-gray-900 text-gray-300",
  };

  const icons = { error: "❌", success: "✅", info: "ℹ️" };

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border px-5 py-3.5 text-sm font-medium shadow-lg transition-all duration-300 ${styles[type]} ${
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-4 opacity-0"
      }`}
    >
      <span>{icons[type]}</span>
      <span>{message}</span>
      <button
        onClick={() => {
          setVisible(false);
          setTimeout(onClose, 300);
        }}
        className="ml-2 opacity-50 hover:opacity-100"
      >
        ✕
      </button>
    </div>
  );
}

// ── Hook for easy usage ────────────────────────────────────────
import { useCallback } from "react";

export function useToast() {
  const [toast, setToast] = useState<{
    message: string;
    type: "error" | "success" | "info";
  } | null>(null);

  const showToast = useCallback(
    (message: string, type: "error" | "success" | "info" = "error") => {
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