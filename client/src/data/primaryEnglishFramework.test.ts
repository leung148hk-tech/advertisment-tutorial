import { describe, expect, it } from "vitest";
import { PRIMARY_ENGLISH_FRAMEWORK, primaryEnglishDomains, primaryEnglishSelectionGroup } from "./primaryEnglishFramework";

describe("primary English framework", () => {
  it("defines five distinct reading and writing domains plus a writing output target for every primary grade", () => {
    for (const grade of ["P1", "P2", "P3", "P4", "P5", "P6"] as const) {
      const framework = PRIMARY_ENGLISH_FRAMEWORK[grade];
      const readingLabels = framework.readingDomains.map((domain) => domain.label);
      const writingLabels = framework.writingDomains.map((domain) => domain.label);

      expect(readingLabels).toHaveLength(5);
      expect(writingLabels).toHaveLength(5);
      expect(new Set(readingLabels).size).toBe(5);
      expect(new Set(writingLabels).size).toBe(5);
      expect(framework.writingOutputTarget).toMatch(/words/);
      expect(primaryEnglishDomains(grade, "english-reading")).toEqual(framework.readingDomains);
      expect(primaryEnglishDomains(grade, "english-writing")).toEqual(framework.writingDomains);
      expect(new Set(framework.readingDomains.map((_domain, index) => primaryEnglishSelectionGroup(grade, "english-reading", index))).size).toBe(5);
      expect(new Set(framework.writingDomains.map((_domain, index) => primaryEnglishSelectionGroup(grade, "english-writing", index))).size).toBe(5);
    }
  });

  it("captures the required P1-to-P6 progression without treating writing word counts as automated composition marking", () => {
    expect(PRIMARY_ENGLISH_FRAMEWORK.P1.readingDomains.map((domain) => domain.label).join(" ")).toContain("字母音素");
    expect(PRIMARY_ENGLISH_FRAMEWORK.P2.readingDomains.map((domain) => domain.label).join(" ")).toContain("magic e");
    expect(PRIMARY_ENGLISH_FRAMEWORK.P3.readingDomains.map((domain) => domain.label).join(" ")).toContain("過去式");
    expect(PRIMARY_ENGLISH_FRAMEWORK.P4.writingDomains.map((domain) => domain.label).join(" ")).toContain("三段結構");
    expect(PRIMARY_ENGLISH_FRAMEWORK.P5.readingDomains.map((domain) => domain.label).join(" ")).toContain("推論");
    expect(PRIMARY_ENGLISH_FRAMEWORK.P6.readingDomains.map((domain) => domain.label).join(" ")).toContain("被動語態");
    expect(PRIMARY_ENGLISH_FRAMEWORK.P6.writingOutputTarget).toBe("120–150+ words");
  });
});
