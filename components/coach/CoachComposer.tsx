"use client";

import type { KeyboardEvent, RefObject } from "react";

interface CoachComposerProps {
  input: string;
  loading: boolean;
  userName: string | null;
  inputRef: RefObject<HTMLTextAreaElement | null>;
  onChange: (value: string) => void;
  onSend: () => void;
  onKeyDown: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
}

export default function CoachComposer({
  input,
  loading,
  userName,
  inputRef,
  onChange,
  onSend,
  onKeyDown,
}: CoachComposerProps) {
  return (
    <div className="sticky bottom-0 z-30 w-full bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/95 to-transparent px-margin-mobile pb-space-md pt-space-sm sm:px-margin">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-2xl border border-outline-variant/30 bg-surface/90 p-2 shadow-[0_20px_50px_rgba(0,0,0,0.75)] backdrop-blur-2xl transition-all hover:border-primary/40 focus-within:border-primary/60 focus-within:shadow-[0_0_30px_rgba(16,185,129,0.2)]">
          <div className="flex items-end gap-2 pl-2">
            <div className="flex-1 py-1">
              <textarea
                ref={inputRef}
                id="coach-user-input"
                aria-label="Message AI Gym Coach"
                value={input}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder={
                  userName
                    ? `Ask your coach anything, ${userName}…`
                    : "Ask about workouts, diet, recovery, or supplements…"
                }
                rows={1}
                style={{ maxHeight: "128px" }}
                onInput={(e) => {
                  const t = e.currentTarget;
                  t.style.height = "auto";
                  t.style.height = `${Math.min(t.scrollHeight, 128)}px`;
                }}
                className="w-full resize-none border-0 bg-transparent py-1.5 font-body-md text-body-md leading-relaxed text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none"
              />
            </div>

            <div className="flex shrink-0 items-center gap-2 pb-0.5">
              <div className="mr-2 hidden select-none items-center gap-1.5 font-label-sm text-label-sm text-outline md:flex">
                <span>Enter to send</span>
                <span>·</span>
                <span>Shift+Enter newline</span>
              </div>
              <button
                id="send-coach-msg"
                type="button"
                onClick={onSend}
                disabled={!input.trim() || loading}
                aria-label="Send"
                className="group flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-primary to-primary-container text-on-primary-container shadow-[0_0_20px_rgba(16,185,129,0.35)] transition-all hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-35 disabled:shadow-none disabled:hover:scale-100"
              >
                <span className="material-symbols-outlined text-[20px] font-bold transition-transform group-hover:-translate-y-0.5">
                  arrow_upward
                </span>
              </button>
            </div>
          </div>

          <div className="mt-1 flex flex-wrap items-center justify-between gap-2 border-t border-outline-variant/20 px-2 pb-0.5 pt-2">
            <span className="flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant">
              <span className="material-symbols-outlined text-[14px] text-primary">
                tune
              </span>
              Model:{" "}
              <strong className="font-semibold text-on-surface">
                openai/gpt-oss-120b
              </strong>{" "}
              via Groq AI
            </span>
            <span className="hidden font-label-sm text-label-sm text-outline sm:inline">
              Fitness, nutrition &amp; recovery guidance
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
