"use client";

import { Component, ReactNode } from "react";

type Props = { children: ReactNode };
type State = { hasError: boolean; message: string };

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error) {
    console.error("ErrorBoundary caught:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          className="relative flex min-h-[340px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-error/30 bg-surface-container-low/85 p-6 text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:p-10"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-error/50 to-transparent"
          />

          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-error/30 bg-error-container/35 text-error">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>

          <h2 className="mb-1.5 font-headline-md text-[1.25rem] font-bold tracking-tight text-on-surface">
            Something went wrong
          </h2>

          <p className="mb-6 max-w-sm font-body-md text-body-md leading-relaxed text-on-surface-variant">
            {this.state.message || "An unexpected error occurred."}
          </p>

          <button
            type="button"
            onClick={() => this.setState({ hasError: false, message: "" })}
            className="inline-flex items-center justify-center rounded-full border border-primary/40 bg-primary/10 px-6 py-2.5 font-label-md text-label-md font-semibold text-primary transition-colors hover:bg-primary/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
