"use client";

import { useState, type ReactNode } from "react";
import { SUGGESTED_PROMPTS, type ChatMessage } from "./coachConfig";

function renderInlineBold(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={idx} className="font-semibold text-primary">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={idx}>{part}</span>;
  });
}

function FormattedCoachText({ content }: { content: string }) {
  const blocks = content.split(/\n{2,}/);

  return (
    <div className="space-y-3 font-body-md text-body-md leading-relaxed text-on-surface">
      {blocks.map((block, bIdx) => {
        const lines = block
          .split("\n")
          .map((l) => l.trimEnd())
          .filter((l) => l.length > 0);

        const isList =
          lines.length > 0 &&
          lines.every(
            (l) =>
              l.trimStart().startsWith("- ") ||
              l.trimStart().startsWith("* ") ||
              /^\d+\.\s+/.test(l.trimStart())
          );

        if (isList) {
          return (
            <ul key={bIdx} className="space-y-2 pl-1">
              {lines.map((line, lIdx) => {
                const cleaned = line
                  .trimStart()
                  .replace(/^(?:[-*]|\d+\.)\s+/, "");
                return (
                  <li key={lIdx} className="flex items-start gap-2">
                    <span className="material-symbols-outlined mt-0.5 shrink-0 text-[18px] text-primary">
                      check_small
                    </span>
                    <span>{renderInlineBold(cleaned)}</span>
                  </li>
                );
              })}
            </ul>
          );
        }

        return (
          <p key={bIdx} className="whitespace-pre-wrap leading-relaxed">
            {lines.map((line, lIdx) => (
              <span key={lIdx}>
                {lIdx > 0 && <br />}
                {renderInlineBold(line)}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}

export function MessageBubble({
  message,
  userName,
  onRetry,
}: {
  message: ChatMessage;
  userName: string | null;
  onRetry?: (content: string) => void;
}) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard unavailable in restricted browser context
    }
  }

  if (isUser) {
    const initial = userName ? userName.charAt(0).toUpperCase() : "U";
    return (
      <div
        data-message-role="user"
        className="flex w-full max-w-2xl items-end justify-end gap-space-sm self-end"
      >
        <div className="flex flex-col items-end">
          <div className="rounded-2xl rounded-tr-sm border border-primary/40 bg-primary/15 px-5 py-3.5 font-body-lg text-body-lg text-on-surface shadow-[0_4px_24px_rgba(16,185,129,0.12)] backdrop-blur-md">
            <p className="whitespace-pre-wrap">{message.content}</p>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-container font-title-lg text-title-lg font-bold text-on-primary-container shadow-md"
        >
          {initial}
        </div>
      </div>
    );
  }

  return (
    <div
      data-message-role="assistant"
      data-message-error={message.isError ? "true" : undefined}
      className="flex w-full max-w-4xl items-start gap-space-sm"
    >
      {/* AI Avatar */}
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-surface-container-highest shadow-md ${
          message.isError
            ? "border-error/40 text-error"
            : "border-primary/35 text-primary shadow-[0_0_16px_rgba(16,185,129,0.15)]"
        }`}
      >
        <span className="material-symbols-outlined text-[22px]">
          {message.isError ? "error_outline" : "smart_toy"}
        </span>
      </div>

      {/* Assistant Payload Card */}
      <div
        className={`relative flex-1 overflow-hidden rounded-2xl rounded-tl-sm border p-5 shadow-xl backdrop-blur-2xl sm:p-6 ${
          message.isError
            ? "border-error/30 bg-error-container/20"
            : "border-outline-variant/25 bg-surface-container/90"
        }`}
      >
        {!message.isError && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-0 top-0 h-28 w-56 rounded-bl-full bg-primary/5"
          />
        )}

        {/* Bubble Meta Header */}
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-outline-variant/25 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="font-title-lg text-title-lg font-bold tracking-tight text-on-surface">
              AI Gym Coach
            </span>
            {message.isError ? (
              <span className="rounded border border-error/35 bg-error-container/40 px-2 py-0.5 font-label-sm text-label-sm font-semibold uppercase text-error">
                Request Failed
              </span>
            ) : (
              <span className="rounded border border-primary/25 bg-primary/10 px-2 py-0.5 font-label-sm text-label-sm font-semibold uppercase text-primary">
                Coach Response
              </span>
            )}
          </div>
        </div>

        {/* Body */}
        {message.isError ? (
          <p className="font-body-md text-body-md leading-relaxed text-error">
            {message.content}
          </p>
        ) : (
          <FormattedCoachText content={message.content} />
        )}

        {/* Bottom Utility Actions (only when non-welcome OR retryable error) */}
        {(message.id !== 0 || message.isError) && (
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-outline-variant/20 pt-3">
            {!message.isError && (
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 rounded-lg border border-outline-variant/30 bg-surface-container-high px-3 py-1.5 font-label-md text-label-md text-on-surface-variant transition-colors hover:bg-surface-bright hover:text-on-surface"
              >
                <span
                  className={`material-symbols-outlined text-[16px] ${
                    copied ? "text-primary" : ""
                  }`}
                >
                  {copied ? "done" : "content_copy"}
                </span>
                <span className={copied ? "font-semibold text-primary" : ""}>
                  {copied ? "Copied" : "Copy advice"}
                </span>
              </button>
            )}

            {message.isError && message.retryContent && onRetry && (
              <button
                type="button"
                id="retry-message-btn"
                onClick={() => onRetry(message.retryContent!)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-error/35 bg-error-container/35 px-3.5 py-1.5 font-label-md text-label-md font-semibold text-error transition-colors hover:bg-error-container/55"
              >
                <span className="material-symbols-outlined text-[16px]">
                  refresh
                </span>
                <span>Retry</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div
      id="coach-typing-indicator"
      className="flex w-full max-w-4xl items-start gap-space-sm"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/35 bg-surface-container-highest text-primary shadow-[0_0_16px_rgba(16,185,129,0.2)]">
        <span className="material-symbols-outlined text-[22px]">
          smart_toy
        </span>
      </div>
      <div className="flex items-center gap-3 rounded-2xl rounded-tl-sm border border-primary/25 bg-surface-container/90 px-5 py-4 shadow-lg backdrop-blur-xl">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:0ms]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:150ms]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:300ms]" />
        </div>
        <span className="font-label-md text-label-md text-on-surface-variant">
          Coach is thinking…
        </span>
      </div>
    </div>
  );
}

export function SuggestionGrid({
  onSelect,
}: {
  onSelect: (question: string) => void;
}) {
  return (
    <div id="suggested-prompts" className="mb-space-sm">
      <div className="mb-space-sm flex flex-wrap items-center justify-between gap-2 px-1">
        <span className="flex items-center gap-1.5 font-label-sm text-label-sm font-bold uppercase tracking-wider text-outline">
          <span className="material-symbols-outlined text-[14px] text-primary">
            bolt
          </span>
          Quick Focus Topics
        </span>
        <span className="font-label-sm text-label-sm text-on-surface-variant">
          Click a prompt or ask your own question below
        </span>
      </div>

      <div className="grid grid-cols-1 gap-space-sm sm:grid-cols-2 lg:grid-cols-3">
        {SUGGESTED_PROMPTS.map((item) => (
          <button
            key={item.question}
            type="button"
            data-suggested-prompt={item.question}
            onClick={() => onSelect(item.question)}
            className="group flex h-24 cursor-pointer flex-col justify-between rounded-xl border border-outline-variant/25 bg-surface-container/70 p-3.5 text-left shadow-md backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-surface-container-high"
          >
            <div className="flex w-full items-center justify-between">
              <span
                className={`font-label-sm text-label-sm font-semibold uppercase tracking-wider ${item.accentClass}`}
              >
                {item.category}
              </span>
              <span className="material-symbols-outlined text-[16px] text-on-surface-variant transition-all group-hover:translate-x-0.5 group-hover:text-primary">
                arrow_forward
              </span>
            </div>
            <p className="line-clamp-2 font-body-md text-body-md font-medium text-on-surface">
              {item.question}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
