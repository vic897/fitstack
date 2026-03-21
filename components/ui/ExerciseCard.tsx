type Exercise = {
  id: number;
  name: string;
  muscle: string;
  difficulty: string;
  equipment: string;
  description: string;
};

const difficultyColor: Record<string, string> = {
  Beginner: "bg-green-400/10 text-green-400 border-green-400/20",
  Intermediate: "bg-yellow-400/10 text-yellow-400 border-yellow-400/20",
  Advanced: "bg-red-400/10 text-red-400 border-red-400/20",
};

const muscleIcon: Record<string, string> = {
  Legs: "🦵",
  Back: "🔙",
  Chest: "💪",
  Shoulders: "🏔️",
  Arms: "💪",
  Core: "🎯",
};

export default function ExerciseCard({ exercise }: { exercise: Exercise }) {
  return (
    <div className="group flex flex-col rounded-2xl border border-white/10 bg-white/5 p-6 transition-all hover:border-green-400/30 hover:bg-white/8">
      {/* Top row */}
      <div className="mb-4 flex items-start justify-between gap-2">
        <span className="text-2xl">{muscleIcon[exercise.muscle] ?? "🏋️"}</span>
        <span
          className={`rounded-full border px-3 py-0.5 text-xs font-semibold ${difficultyColor[exercise.difficulty]}`}
        >
          {exercise.difficulty}
        </span>
      </div>

      {/* Name */}
      <h3 className="mb-1 text-base font-bold leading-snug">{exercise.name}</h3>

      {/* Muscle + Equipment */}
      <div className="mb-3 flex flex-wrap gap-2">
        <span className="rounded-full bg-white/8 px-2.5 py-0.5 text-xs text-gray-400">
          {exercise.muscle}
        </span>
        <span className="rounded-full bg-white/8 px-2.5 py-0.5 text-xs text-gray-400">
          {exercise.equipment}
        </span>
      </div>

      {/* Description */}
      <p className="mt-auto text-sm leading-relaxed text-gray-500">
        {exercise.description}
      </p>
    </div>
  );
}