import type { UserContext } from "@/lib/db/userContext";

export interface ChatMessage {
  id: number;
  role: "user" | "assistant";
  content: string;
  isError?: boolean;
  retryContent?: string;
}

export interface SuggestedPrompt {
  category: string;
  accentClass: string;
  question: string;
}

export const GOAL_LABELS: Record<string, string> = {
  "muscle-gain": "Muscle Gain",
  "fat-loss": "Fat Loss",
  endurance: "Endurance",
};

export const SUGGESTED_PROMPTS: SuggestedPrompt[] = [
  {
    category: "Nutrition",
    accentClass: "text-primary",
    question: "How much protein do I need daily?",
  },
  {
    category: "Training",
    accentClass: "text-secondary",
    question: "What's the best workout for my goal?",
  },
  {
    category: "Fat Loss",
    accentClass: "text-primary-fixed",
    question: "How do I lose fat without losing muscle?",
  },
  {
    category: "Hypertrophy",
    accentClass: "text-tertiary",
    question: "Is cardio necessary for muscle gain?",
  },
  {
    category: "Pre-Workout",
    accentClass: "text-primary",
    question: "What should I eat before a workout?",
  },
  {
    category: "Recovery",
    accentClass: "text-secondary",
    question: "How important is sleep for fitness?",
  },
];

export function buildWelcomeMessage(
  ctx: UserContext | null,
  isReset = false
): ChatMessage {
  const name = ctx?.name ? `, ${ctx.name}` : "";
  const goalPart = ctx?.latestGoal
    ? ` I can see your goal is **${GOAL_LABELS[ctx.latestGoal] ?? ctx.latestGoal}**${
        ctx.latestLevel ? ` at **${ctx.latestLevel}** level` : ""
      }.`
    : "";

  const suffix = isReset
    ? " Ask me anything about workouts, diet, recovery, or supplements."
    : " Ask me anything about workouts, diet, recovery, or supplements — I'll give you straight, practical answers.";

  return {
    id: 0,
    role: "assistant",
    content: `Hey${name}! I'm your AI gym coach.${goalPart}${suffix}`,
  };
}
