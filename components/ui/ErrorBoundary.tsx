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
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-red-400/20 bg-red-400/5 p-10 text-center">
          <div className="mb-4 text-5xl">⚠️</div>
          <h2 className="mb-2 text-lg font-bold text-red-400">
            Something went wrong
          </h2>
          <p className="mb-6 max-w-sm text-sm text-gray-500">
            {this.state.message || "An unexpected error occurred."}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, message: "" })}
            className="rounded-full border border-red-400/30 px-5 py-2 text-sm font-semibold text-red-400 transition-colors hover:bg-red-400/10"
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}