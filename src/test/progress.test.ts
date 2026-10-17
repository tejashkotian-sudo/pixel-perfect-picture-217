import { describe, expect, it } from "vitest";
import { computeAccuracy, computeBadges, computeStreak, recommendNext } from "@/lib/progress";

const at = (daysAgo: number) => {
  const d = new Date("2026-10-17T10:00:00");
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
};
const now = new Date("2026-10-17T12:00:00");

describe("progress rules", () => {
  it("streak counts consecutive activity days", () => {
    expect(computeStreak([at(0), at(1), at(2), at(4)], now)).toBe(3);
  });
  it("streak survives if last activity was yesterday", () => {
    expect(computeStreak([at(1), at(2)], now)).toBe(2);
  });
  it("streak is zero after a missed day", () => {
    expect(computeStreak([at(2)], now)).toBe(0);
  });
  it("accuracy comes from recorded attempts", () => {
    expect(computeAccuracy([{ correct: true, created_at: "" }, { correct: false, created_at: "" }])).toBe(50);
    expect(computeAccuracy([])).toBeNull();
  });
  it("recommends retrying a lesson scored below 70%", () => {
    const r = recommendNext([{ lesson_id: "travel-auto", score: 2, total: 5, points: 20, completed_at: at(0) }]);
    expect(r?.lesson.id).toBe("travel-auto");
  });
  it("first lesson badge needs a real completion", () => {
    expect(computeBadges([], 0).find((b) => b.id === "first")?.earned).toBe(false);
  });
});
