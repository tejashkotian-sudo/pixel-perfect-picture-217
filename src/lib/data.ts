import { supabase } from "@/integrations/supabase/client";
import type { Attempt, Completion } from "./progress";
import { fetchEvents } from "./progress-api";
import { progressFromEvents } from "./progress-events";

export async function fetchProfile(userId: string) {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
  if (error) throw error;
  return data;
}

export async function fetchProgress(userId: string) {
  const [c, a, events] = await Promise.all([
    supabase.from("lesson_completions").select("lesson_id,score,total,points,completed_at").eq("user_id", userId).order("completed_at", { ascending: false }),
    supabase.from("quiz_attempts").select("correct,created_at").eq("user_id", userId),
    fetchEvents(),
  ]);
  if (c.error) throw c.error;
  if (a.error) throw a.error;
  if (!events.ok) throw new Error(events.message);
  const derived = progressFromEvents(events.data);
  const completions: Completion[] = [...(c.data ?? []), ...derived.completions];
  completions.sort((a, b) => b.completed_at.localeCompare(a.completed_at));
  const attempts: Attempt[] = [...(a.data ?? []), ...derived.attempts];
  return { completions, attempts, conversations: derived.conversations, activityDates: [...derived.activityDates, ...(c.data ?? []).map((r) => r.completed_at)] };
}

export async function recordQuiz(_userId: string, lessonId: string, results: { questionId: string; correct: boolean }[], attemptId: string) {
  const score = results.filter((r) => r.correct).length;
  const { error } = await supabase.rpc("save_quiz_progress", { p_lesson_id: lessonId, p_attempt_id: attemptId, p_results: results });
  if (error) throw error;
  return score;
}

/** Speak Kannada text using the browser's speech engine, if a voice is available. */
export function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return false;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "kn-IN";
  u.rate = 0.8;
  const voice = window.speechSynthesis.getVoices().find((v) => v.lang.toLowerCase().startsWith("kn"));
  if (voice) u.voice = voice;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
  return true;
}
