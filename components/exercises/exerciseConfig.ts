export const ALL_FILTER = "All" as const;

export const PAGE_SIZE = 12;

export const MUSCLE_GROUPS = [
  ALL_FILTER,
  "Chest",
  "Back",
  "Legs",
  "Shoulders",
  "Arms",
  "Core",
  "Cardio",
] as const;

export interface DifficultyOption {
  value: string;
  label: string;
  dotClass?: string;
}

export const DIFFICULTY_OPTIONS: DifficultyOption[] = [
  { value: ALL_FILTER, label: "All Levels" },
  { value: "Beginner", label: "Beginner", dotClass: "bg-primary" },
  {
    value: "Intermediate",
    label: "Intermediate",
    dotClass: "bg-secondary-fixed",
  },
  { value: "Advanced", label: "Advanced", dotClass: "bg-error" },
];

export function getMuscleIcon(muscleGroup: string): string {
  const key = muscleGroup.toLowerCase();
  if (key === "legs") return "directions_run";
  if (key === "back") return "rowing";
  if (key === "chest") return "fitness_center";
  if (key === "shoulders") return "accessibility_new";
  if (key === "arms") return "exercise";
  if (key === "core") return "sports_gymnastics";
  if (key === "cardio") return "directions_bike";
  return "fitness_center";
}

export function getDifficultyBadgeStyle(difficulty: string): string {
  const key = difficulty.toLowerCase();
  if (key === "beginner") {
    return "bg-primary-container/20 text-primary-fixed border border-primary/25";
  }
  if (key === "intermediate") {
    return "bg-secondary-fixed/15 text-secondary-fixed border border-secondary-fixed/25";
  }
  if (key === "advanced") {
    return "bg-error-container/75 text-error border border-error/25";
  }
  return "bg-surface-container-highest text-on-surface-variant border border-outline-variant/30";
}

export function formatDifficultyLabel(difficulty: string): string {
  if (!difficulty) return "";
  return difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase();
}
