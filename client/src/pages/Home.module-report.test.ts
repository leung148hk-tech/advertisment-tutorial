import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { ASSESSMENT_MODULES, randomAssessment } from "@/data/gradedAssessment";

const homeSource = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");

describe("Home report module presentation", () => {
  it("uses the shared module list as the non-primary-Chinese fallback instead of stale four-module report copy", () => {
    expect(homeSource).toContain("?? ASSESSMENT_MODULES");
    expect(homeSource).toContain("reportStructureLabels");
    expect(homeSource).toContain("isPrimaryChineseReading");
    expect(homeSource).toContain("溝通與協作");
    expect(homeSource).not.toContain("4 個模組");
    expect(homeSource).not.toContain("四個模組");
  });

  it("keeps the landing overview at platform level instead of presenting generic modules as Chinese-reading categories", () => {
    expect(homeSource).toContain("分級題庫");
    expect(homeSource).toContain("按所選年級與評估卷顯示相應能力範疇");
    expect(homeSource).not.toContain("閱讀／寫作／解題／表達／溝通協作");
  });

  it("keeps P5 interview reporting data compatible with all displayed modules", () => {
    const questions = randomAssessment("interview", "P5");
    const totals = new Map(ASSESSMENT_MODULES.map((module) => [module, 0]));
    for (const question of questions) totals.set(question.module, (totals.get(question.module) ?? 0) + 1);

    expect(totals.size).toBe(ASSESSMENT_MODULES.length);
    expect(totals.get("溝通與協作")).toBeGreaterThan(0);
    expect([...totals.values()].reduce((total, count) => total + count, 0)).toBe(20);
  });
});
