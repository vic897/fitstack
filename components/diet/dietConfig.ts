export interface DietGoalOption {
  value: "muscle-gain" | "fat-loss";
  label: string;
  tag: string;
  desc: string;
  materialIcon: string;
  accentKind: "emerald" | "ember";
}

export interface NutritionPrinciple {
  title: string;
  desc: string;
  icon: string;
  iconColorClass: string;
}

export interface MealVisualMeta {
  icon: string;
  headerIcon: string;
  slotTag: string;
  gradientClass: string;
}

export const DIET_GOALS: DietGoalOption[] = [
  {
    value: "muscle-gain",
    label: "Muscle Gain",
    tag: "Calorie Surplus",
    desc: "Eat more to grow more",
    materialIcon: "fitness_center",
    accentKind: "emerald",
  },
  {
    value: "fat-loss",
    label: "Fat Loss",
    tag: "Moderate Deficit",
    desc: "Eat smart, stay lean",
    materialIcon: "local_fire_department",
    accentKind: "ember",
  },
];

export const NUTRITION_PRINCIPLES: NutritionPrinciple[] = [
  {
    title: "Prioritise protein",
    desc: "Aim for protein in every meal. It keeps you full and preserves muscle.",
    icon: "set_meal",
    iconColorClass: "text-primary",
  },
  {
    title: "Stay hydrated",
    desc: "Drink at least 2–3 litres of water daily. More on training days.",
    icon: "water_drop",
    iconColorClass: "text-secondary-container",
  },
  {
    title: "Limit processed food",
    desc: "Cut out ultra-processed snacks. Whole foods give better energy.",
    icon: "do_not_disturb_on",
    iconColorClass: "text-error",
  },
  {
    title: "Sleep to recover",
    desc: "Nutrition works best with 7–9 hours of sleep. Don't skip recovery.",
    icon: "bedtime",
    iconColorClass: "text-tertiary",
  },
];

export function getMealVisualMeta(mealName: string): MealVisualMeta {
  const key = mealName.toLowerCase();
  if (key === "breakfast") {
    return {
      icon: "light_mode",
      headerIcon: "wb_twilight",
      slotTag: "Morning Meal",
      gradientClass: "from-primary/15 via-surface-container-high/70 to-surface-container",
    };
  }
  if (key === "lunch") {
    return {
      icon: "restaurant_menu",
      headerIcon: "wb_sunny",
      slotTag: "Midday Meal",
      gradientClass: "from-secondary/15 via-surface-container-high/70 to-surface-container",
    };
  }
  if (key === "dinner") {
    return {
      icon: "nights_stay",
      headerIcon: "dark_mode",
      slotTag: "Evening Meal",
      gradientClass: "from-tertiary/15 via-surface-container-high/70 to-surface-container",
    };
  }
  return {
    icon: "nutrition",
    headerIcon: "bolt",
    slotTag: "Daily Snack",
    gradientClass: "from-primary-container/15 via-surface-container-high/70 to-surface-container",
  };
}
