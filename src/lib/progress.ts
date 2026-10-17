import { ALL_LESSONS, MODULES, type Goal } from "./curriculum";

export type Completion = { lesson_id: string; score: number; total: number; points: number; completed_at: string };
export type Attempt = { correct: boolean; created_at: string };

const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

/** Consecutive active days ending today (or yesterday, if not yet active today). */
export function computeStreak(dates: string[], now = new Date()): number {
  const days = new Set(dates.map((d) => dayKey(new Date(d))));
  const cursor = new Date(now);
  if (!days.has(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (days.has(dayKey(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function computeAccuracy(attempts: Attempt[]): number | null {
  if (!attempts.length) return null;
  return Math.round((attempts.filter((a) => a.correct).length / attempts.length) * 100);
}

export function totalPoints(completions: Completion[]) {
  return completions.reduce((s, c) => s + c.points, 0);
}

export function completedLessonIds(completions: Completion[]) {
  return new Set(completions.map((c) => c.lesson_id).filter((id) => id !== "daily"));
}

/** Retry the weakest lesson (<70% best score) first, else the next new lesson, goal modules first. */
export function recommendNext(completions: Completion[], goal?: Goal | null) {
  const best = new Map<string, number>();
  for (const c of completions) {
    if (c.lesson_id === "daily" || !c.total) continue;
    best.set(c.lesson_id, Math.max(best.get(c.lesson_id) ?? 0, c.score / c.total));
  }
  const weak = [...best.entries()].filter(([, r]) => r < 0.7).sort((a, b) => a[1] - b[1])[0];
  if (weak) {
    const l = ALL_LESSONS.find((x) => x.id === weak[0]);
    if (l) return { lesson: l, reason: "Review — your best score here was below 70%" };
  }
  const ordered = goal
    ? [...ALL_LESSONS].sort((a, b) => {
        const ga = MODULES.find((m) => m.id === a.moduleId)!.goal.includes(goal) ? 0 : 1;
        const gb = MODULES.find((m) => m.id === b.moduleId)!.goal.includes(goal) ? 0 : 1;
        return ga - gb;
      })
    : ALL_LESSONS;
  const basicsFirst = ALL_LESSONS.find((l) => l.moduleId === "basics" && !best.has(l.id));
  const next = basicsFirst ?? ordered.find((l) => !best.has(l.id));
  if (next) return { lesson: next, reason: basicsFirst ? "Start with the essentials" : "Matches your learning goal" };
  return null;
}

export type Badge = { id: string; label: string; desc: string; earned: boolean };

export function computeBadges(completions: Completion[], streak: number): Badge[] {
  const done = completedLessonIds(completions);
  const pts = totalPoints(completions);
  const perfect = completions.some((c) => c.lesson_id !== "daily" && c.total > 0 && c.score === c.total);
  const moduleDone = MODULES.some((m) => m.lessons.every((l) => done.has(l.id)));
  return [
    { id: "first", label: "First Steps", desc: "Complete your first lesson", earned: done.size >= 1 },
    { id: "five", label: "Getting Fluent", desc: "Complete 5 lessons", earned: done.size >= 5 },
    { id: "perfect", label: "Sharp Ears", desc: "Score 100% on a lesson quiz", earned: perfect },
    { id: "streak3", label: "On a Roll", desc: "Keep a 3-day streak", earned: streak >= 3 },
    { id: "pts100", label: "Century", desc: "Earn 100 points", earned: pts >= 100 },
    { id: "module", label: "Module Master", desc: "Finish every lesson in a module", earned: moduleDone },
  ];
}
