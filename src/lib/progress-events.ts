import type { Attempt, Completion } from "./progress";

export type ProgressKind = "lesson_completed" | "quiz_answered" | "conversation_completed";
export type ProgressEvent = {
  id: string; user_id: string; kind: string; item_id: string;
  correct: boolean | null; score: number | null; created_at: string;
  attempt_id: string | null; lesson_id: string | null;
};
export type NewProgressEvent = { kind: ProgressKind; itemId: string; correct?: boolean; score?: number };

export function validateEvent(input: NewProgressEvent): string | null {
  if (!["lesson_completed", "quiz_answered", "conversation_completed"].includes(input.kind)) return "Invalid progress entry.";
  if (!input.itemId || input.itemId.length > 200) return "Choose a valid lesson or conversation.";
  if (input.kind === "quiz_answered" && typeof input.correct !== "boolean") return "A quiz answer must say whether it was correct.";
  if (input.score !== undefined && (!Number.isInteger(input.score) || input.score < 0 || input.score > 100)) return "Scores must be whole numbers from 0 to 100.";
  return null;
}

/** Adapt raw events to the existing statistics, without storing derived values. */
export function progressFromEvents(events: ProgressEvent[]) {
  const attempts: Attempt[] = [];
  const groups = new Map<string, Completion>();
  const conversations = new Set<string>();
  for (const e of events) {
    if (e.kind === "conversation_completed") conversations.add(e.item_id);
    if (e.kind !== "quiz_answered" || e.correct == null) continue;
    attempts.push({ correct: e.correct, created_at: e.created_at });
    if (!e.attempt_id || !e.lesson_id) continue;
    const c = groups.get(e.attempt_id) ?? { lesson_id: e.lesson_id, score: 0, total: 0, points: 0, completed_at: e.created_at };
    c.total++;
    if (e.correct) { c.score++; c.points += 10; }
    groups.set(e.attempt_id, c);
  }
  const completions = [...groups.values()];
  for (const e of events) {
    if (e.kind !== "lesson_completed" || (e.attempt_id && groups.has(e.attempt_id))) continue;
    completions.push({ lesson_id: e.lesson_id ?? e.item_id, score: e.score ?? 0, total: 100, points: 0, completed_at: e.created_at });
  }
  return { completions, attempts, conversations, activityDates: events.map((e) => e.created_at) };
}