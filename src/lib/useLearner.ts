import { useQuery } from "@tanstack/react-query";
import { fetchProfile, fetchProgress } from "./data";
import { computeAccuracy, computeBadges, computeStreak, completedLessonIds, recommendNext, totalPoints } from "./progress";
import type { Goal } from "./curriculum";

export function useLearner(userId: string) {
  const profile = useQuery({ queryKey: ["profile", userId], queryFn: () => fetchProfile(userId) });
  const progress = useQuery({ queryKey: ["progress", userId], queryFn: () => fetchProgress(userId) });
  const completions = progress.data?.completions ?? [];
  const attempts = progress.data?.attempts ?? [];
  const streak = computeStreak(completions.map((c) => c.completed_at));
  return {
    loading: profile.isLoading || progress.isLoading,
    error: profile.error || progress.error,
    profile: profile.data,
    completions,
    streak,
    points: totalPoints(completions),
    accuracy: computeAccuracy(attempts),
    lessonsDone: completedLessonIds(completions).size,
    badges: computeBadges(completions, streak),
    next: recommendNext(completions, (profile.data?.goal as Goal) ?? null),
  };
}
