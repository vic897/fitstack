import { NextRequest, NextResponse } from "next/server";


type DayPlan = { day: string; focus: string; exercises: string[] };

const workoutPlans: Record<string, Record<string, DayPlan[]>> = {
  "muscle-gain": {
    beginner: [
      { day: "Monday",    focus: "Full Body A",       exercises: ["Barbell Squat 3×8", "Bench Press 3×8", "Dumbbell Row 3×10", "Plank 3×30s"] },
      { day: "Tuesday",   focus: "Rest / Walk",        exercises: ["Light 20-min walk", "Stretching"] },
      { day: "Wednesday", focus: "Full Body B",        exercises: ["Deadlift 3×6", "Overhead Press 3×8", "Lat Pulldown 3×10", "Dumbbell Curl 3×12"] },
      { day: "Thursday",  focus: "Rest",               exercises: ["Active recovery", "Foam rolling"] },
      { day: "Friday",    focus: "Full Body A",        exercises: ["Barbell Squat 3×10", "Bench Press 3×10", "Cable Row 3×10", "Plank 3×40s"] },
      { day: "Saturday",  focus: "Optional Cardio",    exercises: ["20-min jog or cycling"] },
      { day: "Sunday",    focus: "Rest",               exercises: ["Full rest day"] },
    ],
    intermediate: [
      { day: "Monday",    focus: "Chest & Triceps",    exercises: ["Bench Press 4×8", "Incline DB Press 3×10", "Cable Fly 3×12", "Tricep Dip 3×12"] },
      { day: "Tuesday",   focus: "Back & Biceps",      exercises: ["Deadlift 4×5", "Pull-Up 4×8", "Cable Row 3×10", "Dumbbell Curl 3×12"] },
      { day: "Wednesday", focus: "Rest",               exercises: ["Active recovery"] },
      { day: "Thursday",  focus: "Legs",               exercises: ["Barbell Squat 4×8", "Romanian Deadlift 3×10", "Leg Press 3×12", "Leg Curl 3×12"] },
      { day: "Friday",    focus: "Shoulders & Core",   exercises: ["Overhead Press 4×8", "Lateral Raise 3×15", "Face Pull 3×15", "Plank 3×45s"] },
      { day: "Saturday",  focus: "Arms",               exercises: ["Dumbbell Curl 4×12", "Tricep Dip 4×12", "Hammer Curl 3×12"] },
      { day: "Sunday",    focus: "Rest",               exercises: ["Full rest day"] },
    ],
    advanced: [
      { day: "Monday",    focus: "Heavy Chest",        exercises: ["Bench Press 5×5", "Weighted Dip 4×8", "Incline DB Press 4×10", "Cable Fly 3×15"] },
      { day: "Tuesday",   focus: "Heavy Back",         exercises: ["Deadlift 5×3", "Weighted Pull-Up 4×6", "Barbell Row 4×8", "Face Pull 3×15"] },
      { day: "Wednesday", focus: "Legs",               exercises: ["Barbell Squat 5×5", "Hip Thrust 4×8", "Romanian Deadlift 4×8", "Leg Curl 3×12"] },
      { day: "Thursday",  focus: "Rest",               exercises: ["Active recovery", "Mobility work"] },
      { day: "Friday",    focus: "Shoulders",          exercises: ["Overhead Press 5×5", "Arnold Press 3×10", "Lateral Raise 4×15", "Rear Delt Fly 3×15"] },
      { day: "Saturday",  focus: "Arms & Core",        exercises: ["Barbell Curl 4×8", "Skull Crusher 4×10", "Russian Twist 3×20", "Hanging Leg Raise 3×15"] },
      { day: "Sunday",    focus: "Rest",               exercises: ["Full rest day"] },
    ],
  },
  "fat-loss": {
    beginner: [
      { day: "Monday",    focus: "Full Body + Cardio", exercises: ["Push-Up 3×12", "Bodyweight Squat 3×15", "Dumbbell Row 3×12", "20-min jog"] },
      { day: "Tuesday",   focus: "Cardio",             exercises: ["30-min brisk walk or cycling"] },
      { day: "Wednesday", focus: "Full Body Circuit",  exercises: ["Plank 3×40s", "Leg Press 3×15", "Lat Pulldown 3×12", "15-min HIIT"] },
      { day: "Thursday",  focus: "Rest",               exercises: ["Light stretching"] },
      { day: "Friday",    focus: "Full Body + Cardio", exercises: ["Barbell Squat 3×10", "Overhead Press 3×10", "Cable Row 3×12", "20-min jog"] },
      { day: "Saturday",  focus: "Cardio",             exercises: ["45-min walk or swim"] },
      { day: "Sunday",    focus: "Rest",               exercises: ["Full rest day"] },
    ],
    intermediate: [
      { day: "Monday",    focus: "Upper Body + HIIT",  exercises: ["Bench Press 4×10", "Pull-Up 3×8", "Overhead Press 3×10", "20-min HIIT"] },
      { day: "Tuesday",   focus: "Lower Body",         exercises: ["Barbell Squat 4×10", "Romanian Deadlift 3×12", "Leg Curl 3×15", "25-min jog"] },
      { day: "Wednesday", focus: "Cardio",             exercises: ["30-min steady-state cardio"] },
      { day: "Thursday",  focus: "Full Body Circuit",  exercises: ["Deadlift 3×8", "Push-Up 3×15", "Dumbbell Row 3×12", "Plank 3×45s"] },
      { day: "Friday",    focus: "Upper Body",         exercises: ["Incline DB Press 4×10", "Cable Row 4×12", "Lateral Raise 3×15", "Tricep Dip 3×12"] },
      { day: "Saturday",  focus: "HIIT Cardio",        exercises: ["30-min HIIT session"] },
      { day: "Sunday",    focus: "Rest",               exercises: ["Full rest day"] },
    ],
    advanced: [
      { day: "Monday",    focus: "Heavy Upper + HIIT", exercises: ["Bench Press 5×5", "Weighted Pull-Up 4×6", "Overhead Press 4×8", "20-min HIIT"] },
      { day: "Tuesday",   focus: "Heavy Lower",        exercises: ["Barbell Squat 5×5", "Romanian Deadlift 4×8", "Hip Thrust 4×10", "30-min jog"] },
      { day: "Wednesday", focus: "Cardio",             exercises: ["40-min steady-state cardio"] },
      { day: "Thursday",  focus: "Full Body Power",    exercises: ["Deadlift 5×3", "Push-Up 4×20", "Cable Row 4×10", "Plank 4×60s"] },
      { day: "Friday",    focus: "Hypertrophy",        exercises: ["Incline DB Press 4×12", "Lat Pulldown 4×12", "Lateral Raise 4×15", "Face Pull 3×15"] },
      { day: "Saturday",  focus: "HIIT + Core",        exercises: ["30-min HIIT", "Russian Twist 4×20", "Hanging Leg Raise 3×15"] },
      { day: "Sunday",    focus: "Rest",               exercises: ["Full rest day"] },
    ],
  },
  endurance: {
    beginner: [
      { day: "Monday",    focus: "Easy Run",           exercises: ["20-min easy jog", "Dynamic stretching"] },
      { day: "Tuesday",   focus: "Strength",           exercises: ["Bodyweight Squat 3×15", "Push-Up 3×12", "Plank 3×30s"] },
      { day: "Wednesday", focus: "Cross-train",        exercises: ["30-min cycling or swimming"] },
      { day: "Thursday",  focus: "Rest",               exercises: ["Light walk", "Stretching"] },
      { day: "Friday",    focus: "Tempo Run",          exercises: ["25-min moderate-pace run"] },
      { day: "Saturday",  focus: "Long Run",           exercises: ["35-min easy long run"] },
      { day: "Sunday",    focus: "Rest",               exercises: ["Full rest day"] },
    ],
    intermediate: [
      { day: "Monday",    focus: "Interval Run",       exercises: ["6×400m at fast pace", "2-min rest between sets"] },
      { day: "Tuesday",   focus: "Strength",           exercises: ["Barbell Squat 3×10", "Pull-Up 3×8", "Plank 3×45s", "Leg Curl 3×12"] },
      { day: "Wednesday", focus: "Easy Run",           exercises: ["30-min easy jog"] },
      { day: "Thursday",  focus: "Cross-train",        exercises: ["45-min cycling or rowing"] },
      { day: "Friday",    focus: "Tempo Run",          exercises: ["30-min tempo run at race pace"] },
      { day: "Saturday",  focus: "Long Run",           exercises: ["50-min easy long run"] },
      { day: "Sunday",    focus: "Rest",               exercises: ["Full rest day"] },
    ],
    advanced: [
      { day: "Monday",    focus: "Speed Work",         exercises: ["8×400m at max pace", "90s rest between sets"] },
      { day: "Tuesday",   focus: "Strength",           exercises: ["Deadlift 4×6", "Weighted Pull-Up 4×6", "Hip Thrust 3×10", "Hanging Leg Raise 3×15"] },
      { day: "Wednesday", focus: "Moderate Run",       exercises: ["40-min moderate run"] },
      { day: "Thursday",  focus: "Cross-train",        exercises: ["60-min cycling or rowing"] },
      { day: "Friday",    focus: "Tempo Run",          exercises: ["40-min tempo run at race pace"] },
      { day: "Saturday",  focus: "Long Run",           exercises: ["70-min easy long run"] },
      { day: "Sunday",    focus: "Rest",               exercises: ["Full rest day"] },
    ],
  },
};

export async function POST(req: NextRequest) {
  try {
    const { goal, level } = await req.json();

    if (!goal || !level) {
      return NextResponse.json(
        { error: "goal and level are required" },
        { status: 400 }
      );
    }

    const plan = workoutPlans[goal]?.[level];

    if (!plan) {
      return NextResponse.json(
        { error: "No plan found for this goal and level combination" },
        { status: 404 }
      );
    }

    return NextResponse.json({ plan });
  } catch {
    return NextResponse.json(
      { error: "Failed to generate workout plan" },
      { status: 500 }
    );
  }
}
