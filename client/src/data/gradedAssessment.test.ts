import { describe, expect, it } from "vitest";
import { ASSESSMENT_MODULES, buildQuestionPool, GRADES, randomAssessment, TRACKS, trackForGrade } from "./gradedAssessment";
import { primaryEnglishCombinedDomains } from "./primaryEnglishFramework";
import { PRIMARY_MATH_FRAMEWORK } from "./primaryMathFramework";

const PRIMARY_GRADES = ["P1", "P2", "P3", "P4", "P5", "P6"] as const;

function countBySelectionGroup(items: ReturnType<typeof randomAssessment>) {
  const counts = new Map<string, number>();
  for (const item of items) counts.set(item.selectionGroup, (counts.get(item.selectionGroup) ?? 0) + 1);
  return counts;
}

describe("primary-only assessment catalogue", () => {
  it("exposes only P1–P6 and the four retained primary assessment tracks", () => {
    expect(GRADES.map((grade) => grade.id)).toEqual(PRIMARY_GRADES);
    expect(TRACKS.map((track) => track.id)).toEqual(["chinese-reading", "english", "math", "interview"]);
    expect(trackForGrade("english", "P1")).toBe(true);
    expect(trackForGrade("interview", "P5")).toBe(true);
    expect(trackForGrade("interview", "P4")).toBe(false);
    expect(trackForGrade("science" as never, "P1")).toBe(false);
    expect(trackForGrade("english-reading" as never, "P1")).toBe(false);
  });

  it("keeps all five report modules for the primary interview assessment", () => {
    expect(ASSESSMENT_MODULES).toEqual(["基礎掌握", "理解與應用", "情境推理", "整合表達", "溝通與協作"]);
    const assessment = randomAssessment("interview", "P5");
    expect(assessment).toHaveLength(20);
    expect([...countBySelectionGroup(assessment).values()].sort()).toEqual([4, 4, 4, 4, 4]);
    expect(assessment.some((item) => item.module === "溝通與協作")).toBe(true);
  });

  it("keeps each Chinese reading paper as 25 distinct questions across five curriculum domains", () => {
    for (const grade of PRIMARY_GRADES) {
      const pool = buildQuestionPool("chinese-reading", grade);
      const assessment = randomAssessment("chinese-reading", grade);
      expect(pool).toHaveLength(25);
      expect(new Set(pool.map((item) => item.question)).size).toBe(25);
      expect(new Set(pool.map((item) => item.topic)).size).toBe(5);
      expect(new Set(pool.map((item) => item.selectionGroup)).size).toBe(5);
      expect(assessment).toHaveLength(20);
      expect([...countBySelectionGroup(assessment).values()].sort()).toEqual([4, 4, 4, 4, 4]);
    }
  });

  it("combines five reading and five writing-foundation domains into one 50-question English pool", () => {
    for (const grade of PRIMARY_GRADES) {
      const pool = buildQuestionPool("english", grade);
      const assessment = randomAssessment("english", grade);
      const expectedDomains = primaryEnglishCombinedDomains(grade).map((domain) => domain.label);
      expect(pool).toHaveLength(50);
      expect(new Set(pool.map((item) => item.question)).size).toBe(50);
      expect(new Set(pool.map((item) => item.topic))).toEqual(new Set(expectedDomains));
      expect(new Set(pool.map((item) => item.selectionGroup)).size).toBe(10);
      expect(new Set(pool.map((item) => item.correct))).toEqual(new Set([0, 1, 2, 3]));
      expect(pool.some((item) => item.question.includes("延伸題"))).toBe(false);
      expect(pool.every((item) => ["基礎掌握", "理解與應用"].includes(item.module))).toBe(true);
      expect(assessment).toHaveLength(20);
      expect([...countBySelectionGroup(assessment).values()].sort()).toEqual(Array(10).fill(2));
    }
  });

  it("keeps each Mathematics paper as 25 distinct questions across five grade-specific domains", () => {
    for (const grade of PRIMARY_GRADES) {
      const pool = buildQuestionPool("math", grade);
      const assessment = randomAssessment("math", grade);
      const expectedDomains = PRIMARY_MATH_FRAMEWORK[grade].map((domain) => domain.label);
      expect(pool).toHaveLength(25);
      expect(new Set(pool.map((item) => item.question)).size).toBe(25);
      expect(new Set(pool.map((item) => item.topic))).toEqual(new Set(expectedDomains));
      expect(new Set(pool.map((item) => item.selectionGroup)).size).toBe(5);
      expect(new Set(pool.map((item) => item.correct))).toEqual(new Set([0, 1, 2, 3]));
      expect(pool.every((item) => ["基礎掌握", "理解與應用"].includes(item.module))).toBe(true);
      expect(assessment).toHaveLength(20);
      expect([...countBySelectionGroup(assessment).values()].sort()).toEqual([4, 4, 4, 4, 4]);
    }
  });
});
