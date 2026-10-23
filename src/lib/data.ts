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

// ---- Pronunciation audio ----
// 1. Use the device's Kannada speech voice when it has one.
// 2. Otherwise fall back to AI-generated audio from the app's server, so
//    pronunciation works even on devices without a Kannada voice.

const ttsCache = new Map<string, string>(); // text -> object URL
const ttsPending = new Map<string, Promise<string | null>>();

function kannadaVoice(): SpeechSynthesisVoice | undefined {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return undefined;
  return window.speechSynthesis.getVoices().find((v) => v.lang.toLowerCase().startsWith("kn"));
}

// Warm up the voice list: browsers load it asynchronously after startup.
if (typeof window !== "undefined" && "speechSynthesis" in window) {
  window.speechSynthesis.getVoices();
  window.speechSynthesis.addEventListener?.("voiceschanged", () => window.speechSynthesis.getVoices());
}

async function aiSpeechUrl(text: string): Promise<string | null> {
  const pending = ttsPending.get(text);
  if (pending) return pending;
  const promise = (async () => {
    try {
      const res = await fetch("/api/public/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) return null;
      return URL.createObjectURL(await res.blob());
    } catch {
      return null;
    } finally {
      ttsPending.delete(text);
    }
  })();
  ttsPending.set(text, promise);
  return promise;
}

async function playAiAudio(text: string): Promise<boolean> {
  const cached = ttsCache.get(text);
  const url = cached ?? (await aiSpeechUrl(text));
  if (!url) return false;
  if (!cached) ttsCache.set(text, url);
  try {
    await new Audio(url).play();
    return true;
  } catch {
    return false;
  }
}

/** Speak Kannada text: device voice when available, otherwise AI audio. Resolves true when playback started. */
export async function speak(text: string): Promise<boolean> {
  if (typeof window === "undefined") return false;

  const voice = kannadaVoice();
  if (voice && "speechSynthesis" in window) {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "kn-IN";
    u.rate = 0.8;
    u.voice = voice;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
    return true;
  }

  // No Kannada voice on this device — AI audio is the primary path, and a
  // device utterance is only a last resort (it may sound garbled).
  if (await playAiAudio(text)) return true;
  if (!("speechSynthesis" in window)) return false;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "kn-IN";
  u.rate = 0.8;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
  return true;
}
