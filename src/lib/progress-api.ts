import type { PostgrestError } from "@supabase/supabase-js";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { validateEvent, type NewProgressEvent, type ProgressEvent } from "./progress-events";
export type { NewProgressEvent, ProgressEvent, ProgressKind } from "./progress-events";
export type Result<T> = { ok: true; data: T } | { ok: false; message: string };

function describe(error: PostgrestError): string {
  if (error.code === "42501") return "Not allowed to save this. Try signing out and back in.";
  if (error.code === "23514") return "That progress entry was rejected as invalid.";
  return "Couldn't save your progress. Check your connection and try again.";
}
async function currentUserId() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session?.user.id ?? null;
}
export async function recordEvent(input: NewProgressEvent): Promise<Result<null>> {
  const invalid = validateEvent(input);
  if (invalid) return { ok: false, message: invalid };
  try {
    const userId = await currentUserId();
    if (!userId) return { ok: false, message: "Please sign in to save your progress." };
    const { error } = await supabase.from("progress_events").insert({ user_id: userId, kind: input.kind, item_id: input.itemId, correct: input.correct ?? null, score: input.score ?? null });
    if (error && !(error.code === "23505" && input.kind !== "quiz_answered")) return { ok: false, message: describe(error) };
    return { ok: true, data: null };
  } catch { return { ok: false, message: "Couldn't save your progress. Check your connection and try again." }; }
}
export async function fetchEvents(): Promise<Result<ProgressEvent[]>> {
  try {
    const userId = await currentUserId();
    if (!userId) return { ok: false, message: "Please sign in to see your progress." };
    const events: ProgressEvent[] = [];
    for (let offset = 0; ; offset += 500) {
      const { data, error } = await supabase.from("progress_events").select("*").eq("user_id", userId).order("created_at").order("id").range(offset, offset + 499);
      if (error) return { ok: false, message: describe(error) };
      events.push(...(data ?? []));
      if (!data || data.length < 500) break;
    }
    return { ok: true, data: events };
  } catch { return { ok: false, message: "Couldn't load your progress. Check your connection and try again." }; }
}
export async function resetProgress(): Promise<Result<null>> {
  try {
    if (!(await currentUserId())) return { ok: false, message: "Please sign in first." };
    const { error } = await supabase.rpc("reset_learner_progress");
    return error ? { ok: false, message: describe(error) } : { ok: true, data: null };
  } catch { return { ok: false, message: "Couldn't reset your progress. Please try again." }; }
}
export async function saveProgress(input: NewProgressEvent, successMessage?: string): Promise<boolean> {
  const result = await recordEvent(input);
  if (!result.ok) { toast.error(result.message); return false; }
  if (successMessage) toast.success(successMessage);
  return true;
}