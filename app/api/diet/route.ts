import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

export async function POST(req: NextRequest) {
  try {
    const { goal } = await req.json();

    if (!goal) {
      return NextResponse.json(
        { error: "goal is required" },
        { status: 400 }
      );
    }

    // Read JSON from filesystem — more reliable in API routes
    const filePath = join(process.cwd(), "data", "dietPlans.json");
    const raw = readFileSync(filePath, "utf-8");
    const dietPlans = JSON.parse(raw);

    const plan = dietPlans[goal];

    if (!plan) {
      return NextResponse.json(
        { error: `No diet plan found for goal: ${goal}` },
        { status: 404 }
      );
    }

    return NextResponse.json({ plan });
  } catch (err) {
    console.error("Diet API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch diet plan" },
      { status: 500 }
    );
  }
}