import { supabase } from "@/integrations/supabase/client";
import type { Attempt, Completion } from "./progress";

export async function fetchProfile(userId: string) {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
  if (error) throw error;
  return data;
}

export async function fetchProgress(userId: string): Promise<{ completions: Completion[]; attempts: Attempt[] }> {
  const [c, a] = await Promise.all([
    supabase.from("lesson_completions").select("lesson_id,score,total,points,completed_at").eq("user_id", userId).order("completed_at", { ascending: false }),
    supabase.from("quiz_attempts").select("correct,created_at").eq("user_id", userId),
  ]);
  if (c.error) throw c.error;
  if (a.error) throw a.error;
  return { completions: c.data ?? [], attempts: a.data ?? [] };
}

export async function recordQuiz(userId: string, lessonId: string, results: { questionId: string; correct: boolean }[]) {
  const score = results.filter((r) => r.correct).length;
  const a = await supabase.from("quiz_attempts").insert(
    results.map((r) => ({ user_id: userId, lesson_id: lessonId, question_id: r.questionId, correct: r.correct })),
  );
  if (a.error) throw a.error;
  const c = await supabase
    .from("lesson_completions")
    .insert({ user_id: userId, lesson_id: lessonId, score, total: results.length, points: score * 10 });
  if (c.error) throw c.error;
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
