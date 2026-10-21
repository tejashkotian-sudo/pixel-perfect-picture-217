import { describe, expect, it } from "vitest";
import { progressFromEvents, validateEvent, type ProgressEvent } from "@/lib/progress-events";

const event = (overrides: Partial<ProgressEvent>): ProgressEvent => ({
  id: "event-1", user_id: "learner", kind: "quiz_answered", item_id: "question-1",
  correct: true, score: null, created_at: "2026-10-17T10:00:00Z",
  attempt_id: "attempt-1", lesson_id: "travel-auto", ...overrides,
});

describe("event progress", () => {
  it("combines quiz answers and their completion without double-counting", () => {
    const result = progressFromEvents([
      event({}), event({ id: "event-2", item_id: "question-2", correct: false }),
      event({ id: "event-3", kind: "lesson_completed", item_id: "travel-auto", correct: null, score: 50 }),
    ]);
    expect(result.completions).toEqual([{ lesson_id: "travel-auto", score: 1, total: 2, points: 10, completed_at: "2026-10-17T10:00:00Z" }]);
    expect(result.attempts).toHaveLength(2);
  });
  it("keeps genuine repeat attempts separate", () => {
    const result = progressFromEvents([event({}), event({ id: "event-2", attempt_id: "attempt-2" })]);
    expect(result.completions).toHaveLength(2);
  });
  it("tracks conversations as activity without awarding lesson points", () => {
    const result = progressFromEvents([event({ kind: "conversation_completed", item_id: "auto", correct: null, attempt_id: null, lesson_id: null })]);
    expect([...result.conversations]).toEqual(["auto"]);
    expect(result.activityDates).toEqual(["2026-10-17T10:00:00Z"]);
    expect(result.completions).toEqual([]);
    expect(result.attempts).toEqual([]);
  });
  it("preserves standalone lesson completion percentages", () => {
    const result = progressFromEvents([event({ kind: "lesson_completed", item_id: "travel-auto", correct: null, score: 80, attempt_id: null, lesson_id: null })]);
    expect(result.completions[0]).toMatchObject({ lesson_id: "travel-auto", score: 80, total: 100, points: 0 });
  });
  it("requires a correctness result on quiz answers", () => {
    expect(validateEvent({ kind: "quiz_answered", itemId: "q" })).not.toBeNull();
    expect(validateEvent({ kind: "quiz_answered", itemId: "q", correct: false })).toBeNull();
  });
});