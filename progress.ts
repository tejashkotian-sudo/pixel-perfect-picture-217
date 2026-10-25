// src/lib/progress-api.ts
// Thin data layer for user progress. Reads/writes raw rows only (see AGENTS.md);
// streaks, accuracy and badges are derived in src/lib/progress.ts.
//
// Assumes the browser client lives at "@/integrations/supabase/client" (Lovable default)
// and that 001_progress.sql has been applied (types.ts regenerates after the migration).
import type { PostgrestError } from "@supabase/supabase-js";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export type ProgressKind = "lesson_completed" | "quiz_answered" | "conversation_completed";

export interface ProgressEvent {
  id: string;
  user_id: string;
  kind: ProgressKind;
  item_id: string;
  correct: boolean | null;
  score: number | null;
  created_at: string;
}

export interface NewProgressEvent {
  kind: ProgressKind;
  /** Id from src/lib/curriculum.ts (lesson, question or conversation id) */
  itemId: string;
  /** Required for kind === "quiz_answered" */
  correct?: boolean;
  /** 0-100 */
  score?: number;
}

export type Result<T> = { ok: true; data: T } | { ok: false; message: string };

const UNIQUE_VIOLATION = "23505";

function fail(message: string): { ok: false; message: string } {
  return { ok: false, message };
}

function describe(error: PostgrestError): string {
  switch (error.code) {
    case "42501":
      return "Not allowed to save this. Try signing out and back in.";
    case "42P01":
    case "PGRST205":
      return "Progress storage isn't set up yet (table missing).";
    case "23514":
      return "That progress entry was rejected as invalid.";
    default:
      return error.message || "Couldn't save your progress. Please try again.";
  }
}

async function currentUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.user.id ?? null;
}

/** Append one progress event. Duplicate completions count as success. */
export async function recordEvent(input: NewProgressEvent): Promise<Result<null>> {
  if (input.kind === "quiz_answered" && input.correct === undefined) {
    return fail("A quiz answer must say whether it was correct.");
  }

  const userId = await currentUserId();
  if (!userId) return fail("Please sign in to save your progress.");

  const { error } = await supabase.from("progress_events").insert({
    user_id: userId,
    kind: input.kind,
    item_id: input.itemId,
    correct: input.correct ?? null,
    score: input.score ?? null,
  });

  if (error && error.code !== UNIQUE_VIOLATION) {
    console.error("[progress] insert failed", error);
    return fail(describe(error));
  }
  return { ok: true, data: null };
}

/** All of the signed-in user's raw events, oldest first. RLS limits rows to the owner. */
export async function fetchEvents(): Promise<Result<ProgressEvent[]>> {
  const userId = await currentUserId();
  if (!userId) return fail("Please sign in to see your progress.");

  const { data, error } = await supabase
    .from("progress_events")
    .select("id, user_id, kind, item_id, correct, score, created_at")
    .order("created_at", { ascending: true })
    .limit(10000);

  if (error) {
    console.error("[progress] fetch failed", error);
    return fail(describe(error));
  }
  return { ok: true, data: (data ?? []) as ProgressEvent[] };
}

/** Delete all of the signed-in user's progress. */
export async function resetProgress(): Promise<Result<null>> {
  const userId = await currentUserId();
  if (!userId) return fail("Please sign in first.");

  const { error } = await supabase.from("progress_events").delete().eq("user_id", userId);
  if (error) {
    console.error("[progress] reset failed", error);
    return fail(describe(error));
  }
  return { ok: true, data: null };
}

/**
 * Button-friendly wrapper: saves, and ALWAYS tells the user if it failed.
 * Returns true on success so the caller can advance the UI.
 */
export async function saveProgress(
  input: NewProgressEvent,
  successMessage?: string,
): Promise<boolean> {
  const res = await recordEvent(input);
  if (!res.ok) {
    toast.error(res.message);
    return false;
  }
  if (successMessage) toast.success(successMessage);
  return true;
}
