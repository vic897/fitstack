# FitStack 🏋️‍♂️

> An AI-powered fitness web app that helps you train smarter, eat better, and track your progress.

**Live Demo:** [fitstack-delta.vercel.app](https://fitstack-delta.vercel.app)

---

## Overview

FitStack is a full-stack fitness platform built with Next.js, Supabase, and Groq AI. It combines a real exercise database, AI-generated workout plans, diet guidance, BMI tracking, and a personalised AI coach — all without requiring a gym membership or a personal trainer.

---

## Features

### 🏋️ Exercise Library
- Browse 149 exercises stored in Supabase
- Filter by muscle group, difficulty, and equipment
- Live search with debounced queries
- Fully dynamic — no static JSON

### 📋 AI Workout Generator
- Select your goal (Muscle Gain / Fat Loss / Endurance) and level (Beginner / Intermediate / Advanced)
- Groq AI generates a unique 7-day plan using real exercises from the database
- Every generation is different — no two plans are the same
- Plans are automatically saved to your account
- One-click to ask the AI Coach about your generated plan

### 🥗 Diet Guide
- Simple meal plans matched to your fitness goal
- Muscle gain and fat loss plans with breakfast, lunch, dinner, and snacks
- No calorie counting — just clear, practical food choices
- Powered by a clean API route backed by static JSON

### ⚖️ BMI Calculator
- Supports both metric (cm/kg) and imperial (ft/in/lbs)
- Visual gauge showing your position across four BMI categories
- Category-specific fitness and diet tips
- One-click to send your BMI result directly to the AI Coach

### 🤖 AI Gym Coach
- Chat interface powered by Groq (llama-3.3-70b-versatile)
- Knows your goal, training level, and latest logged weight
- Pre-filled queries from BMI calculator and workout generator
- Suggested questions for new users
- Full conversation history within the session

### 👤 Authentication
- Email and password signup and login via Supabase Auth
- Session management with middleware-based route protection
- Auth state reflected in navbar in real time

### 📊 Progress Tracker
- Log your weight over time with an optional note
- See your latest weight, total change, and number of entries
- Delete individual entries
- Protected route — requires login

### 💾 My Workouts
- All generated plans saved automatically when logged in
- Expand any plan to view the full weekly schedule
- Delete plans you no longer need
- Protected route — requires login

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| AI | Groq API — llama-3.3-70b-versatile |
| Deployment | Vercel |

---

## Project Structure
```
fitstack/
├── app/
│   ├── api/
│   │   ├── chat/route.ts          # Groq AI chat with user context
│   │   ├── diet/route.ts          # Diet plan API
│   │   └── workout/route.ts       # AI workout generation with caching
│   ├── auth/
│   │   └── actions.ts             # Supabase server actions (login, signup, logout)
│   ├── bmi/                       # BMI calculator
│   ├── coach/                     # AI chat interface
│   ├── diet/                      # Diet guide
│   ├── exercises/                 # Exercise library
│   ├── login/                     # Login page
│   ├── my-workouts/               # Saved workout plans
│   ├── progress/                  # Weight progress tracker
│   ├── signup/                    # Signup page
│   ├── workout/                   # AI workout generator
│   ├── globals.css                # Global styles
│   ├── layout.tsx                 # Root layout with metadata
│   ├── loading.tsx                # Global loading state
│   ├── not-found.tsx              # Custom 404 page
│   └── page.tsx                   # Landing page
├── components/
│   ├── layout/
│   │   └── Navbar.tsx             # Responsive navbar with auth state
│   └── ui/
│       ├── EmptyState.tsx         # Reusable empty state
│       ├── ErrorBoundary.tsx      # React error boundary
│       ├── ExerciseCard.tsx       # Exercise display card
│       ├── Skeleton.tsx           # Loading skeletons
│       └── Toast.tsx              # Toast notifications + hook
├── data/
│   ├── dietPlans.json             # Meal plan data
│   └── exercises_full.json        # 149 exercises (used for seeding)
├── lib/
│   ├── db/
│   │   ├── exercises.ts           # Exercise queries + filters
│   │   ├── progress.ts            # Progress log queries
│   │   ├── userContext.ts         # Fetch user profile for AI
│   │   └── workouts.ts            # Workout save + fetch + delete
│   ├── supabase/
│   │   ├── client.ts              # Browser Supabase client
│   │   ├── server.ts              # Server Supabase client
│   │   └── types.ts               # Shared TypeScript types
│   └── groq.ts                    # Groq client initialisation
├── middleware.ts                   # Session refresh + route protection
└── README.md
```

---

## Database Schema

### `exercises` — public read, service role write
```sql
id           uuid primary key
name         text unique not null
muscle_group text not null
equipment    text not null
difficulty   text check (difficulty in ('beginner', 'intermediate', 'advanced'))
created_at   timestamptz default now()
```

### `workouts` — per user, RLS protected
```sql
id         uuid primary key
user_id    uuid references auth.users(id) on delete cascade
goal       text not null
level      text not null
plan       jsonb not null
created_at timestamptz default now()
```

### `progress` — per user, RLS protected
```sql
id         uuid primary key
user_id    uuid references auth.users(id) on delete cascade
weight     numeric(5,2) not null
note       text
date       date default current_date
created_at timestamptz default now()
```

Row Level Security is enabled on all tables. Users can only access their own data.

---

## Getting Started

### Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com) project
- A [Groq](https://console.groq.com) API key

### 1 — Clone the repo
```bash
git clone https://github.com/vic897/fitstack.git
cd fitstack
npm install
```

### 2 — Configure environment variables

Create `.env.local` in the project root:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
GROQ_API_KEY=your_groq_api_key
```

### 3 — Set up the database

Run the following in your Supabase **SQL Editor**:
```sql
-- Tables
create table public.exercises (
  id           uuid primary key default gen_random_uuid(),
  name         text not null unique,
  muscle_group text not null,
  equipment    text not null,
  difficulty   text not null check (difficulty in ('beginner', 'intermediate', 'advanced')),
  created_at   timestamptz default now() not null
);

create table public.workouts (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users(id) on delete cascade not null,
  goal       text not null,
  level      text not null,
  plan       jsonb not null,
  created_at timestamptz default now() not null
);

create table public.progress (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users(id) on delete cascade not null,
  weight     numeric(5,2) not null,
  note       text,
  date       date default current_date not null,
  created_at timestamptz default now() not null
);

-- Indexes
create index workouts_user_id_idx on public.workouts(user_id);
create index progress_user_id_idx on public.progress(user_id);
create index exercises_muscle_group_idx on public.exercises(muscle_group);
create index exercises_difficulty_idx on public.exercises(difficulty);

-- RLS
alter table public.exercises enable row level security;
alter table public.workouts  enable row level security;
alter table public.progress  enable row level security;

create policy "Anyone can read exercises"
  on public.exercises for select to anon, authenticated using (true);

create policy "Users can manage own workouts"
  on public.workouts for all using (auth.uid() = user_id);

create policy "Users can manage own progress"
  on public.progress for all using (auth.uid() = user_id);
```

### 4 — Seed the exercise database

Add your Supabase URL and service role key to `scripts/seedExercises.mjs`, then run:
```bash
node scripts/seedExercises.mjs
```

Remove your keys from the script after seeding.

### 5 — Start the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

| Variable | Description | Required |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key — server only, never expose client-side | ✅ |
| `GROQ_API_KEY` | Groq API key for AI workout generation and chat | ✅ |

---

## Deployment

### Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```

Add all four environment variables in your Vercel project under **Settings → Environment Variables**. Redeploy after adding them.

### Auto-deploy from GitHub

Connect your GitHub repo in the Vercel dashboard under **Settings → Git**. Every push to `main` will trigger an automatic production deployment.

---

## AI Architecture

### Workout Generation
1. User selects goal and level
2. API fetches matching exercises from Supabase (cached in memory for 1 hour)
3. Exercises are grouped by muscle group and passed to Groq in a strict prompt
4. Groq generates a structured plan using only the provided exercises
5. Response is parsed, validated against the database, and returned as JSON

### AI Coach
1. On load, the coach fetches the user's latest goal, level, and weight from Supabase
2. This context is injected into the system prompt for every message
3. When arriving from the BMI calculator or workout generator, a pre-built query is auto-sent so the user gets an immediate personalised response
4. Full conversation history is included in each API call for continuity

---

## Roadmap

- [ ] Google OAuth
- [ ] Calorie and macro calculator
- [ ] Exercise GIF/video demos
- [ ] Workout streak and consistency tracking
- [ ] Export workout plan as PDF
- [ ] Custom meal builder
- [ ] Push notification reminders
- [ ] Mobile app (React Native)

---

## License

MIT — free to use, modify, and distribute.

---

## Author

Built by [Vinay](https://github.com/vic897) as a full-stack learning project across three development phases — MVP, authentication + database, and AI integration.
