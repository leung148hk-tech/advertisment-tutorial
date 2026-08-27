// @vitest-environment jsdom
import React from "react";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ASSESSMENT_MODULES, randomAssessment, type AssessmentQuestion, type GradeId } from "@/data/gradedAssessment";

vi.mock("@/components/FeaturedCentres", () => ({ default: () => null }));
vi.mock("@/components/RegionalSupport", () => ({ default: () => null }));
vi.mock("@/components/ParentLeadForm", () => ({
  default: ({ onComplete }: { onComplete: (name: string, district: string) => void }) => (
    <button onClick={() => onComplete("測試學生", "荃灣區")}>完成測驗資料</button>
  ),
}));

import Home from "./Home";

afterEach(() => cleanup());

function deterministicRandom() {
  let state = 0x5f3759df;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0x1_0000_0000;
  };
}

function expectedModuleScores(questions: AssessmentQuestion[]) {
  const scores = new Map(ASSESSMENT_MODULES.map((module) => [module, { correct: 0, total: 0 }]));
  for (const question of questions) {
    const score = scores.get(question.module);
    if (!score) throw new Error(`Unexpected module: ${question.module}`);
    score.total += 1;
    if (question.correct === 0) score.correct += 1;
  }
  return scores;
}

async function openInterviewReport(grade: "小五" | "小六") {
  window.scrollTo = vi.fn();
  const gradeId: GradeId = grade === "小五" ? "P5" : "P6";
  const randomSpy = vi.spyOn(Math, "random");
  randomSpy.mockImplementation(deterministicRandom());
  const expectedQuestions = randomAssessment("interview", gradeId);
  randomSpy.mockImplementation(deterministicRandom());
  const user = userEvent.setup();
  const view = render(<Home />);

  await user.click(screen.getByRole("button", { name: grade }));
  await user.click(screen.getByRole("button", { name: /^升中面試/ }));

  for (let index = 0; index < 20; index += 1) {
    await user.click(screen.getAllByRole("radio")[0]);
    await user.click(screen.getByRole("button", { name: index === 19 ? "生成免費報告" : "下一題" }));
  }

  await user.click(screen.getByRole("button", { name: "完成測驗資料" }));
  const report = view.container.querySelector<HTMLElement>(".download-report");
  if (!report) throw new Error("Expected the completed assessment report to render.");
  randomSpy.mockRestore();
  return { expectedQuestions, report };
}

describe("Home interview report module rendering", () => {
  it.each(["小五", "小六"] as const)("renders five accurate module cards for %s interview reports", async (grade) => {
    const { expectedQuestions, report } = await openInterviewReport(grade);
    const cards = report.querySelectorAll(".module-score-grid > article");
    const moduleGrid = report.querySelector<HTMLElement>(".module-score-grid");
    const cardTexts = Array.from(cards, (card) => card.textContent ?? "");
    const scorePairs = cardTexts.map((text) => text.match(/(\d+)\s*\/\s*(\d+)/));
    const summary = report.querySelector(".overall-score strong")?.textContent ?? "";
    const expectedScores = expectedModuleScores(expectedQuestions);
    const displayedScores = new Map(Array.from(cards, (card) => {
      const module = card.querySelector("span")?.textContent ?? "";
      const scoreText = card.querySelector("strong")?.textContent ?? "";
      const match = scoreText.match(/(\d+)\s*\/\s*(\d+)/);
      return [module, { correct: Number(match?.[1] ?? -1), total: Number(match?.[2] ?? -1) }];
    }));

    expect(within(report).getByText("5 個模組")).toBeTruthy();
    expect(moduleGrid).not.toBeNull();
    expect(within(moduleGrid as HTMLElement).getByText("溝通與協作")).toBeTruthy();
    expect(within(report).queryByText("4 個模組")).toBeNull();
    expect(within(report).queryByText("四個模組")).toBeNull();
    expect(cards).toHaveLength(5);
    expect(Array.from(displayedScores.keys())).toEqual(ASSESSMENT_MODULES);
    expect(cardTexts.some((text) => text.includes("溝通與協作") && /\/\s*[1-9]\d*/.test(text))).toBe(true);
    expect(scorePairs.every((pair) => pair)).toBe(true);
    expect(scorePairs.reduce((total, pair) => total + Number(pair?.[2] ?? 0), 0)).toBe(20);
    expect(scorePairs.reduce((total, pair) => total + Number(pair?.[1] ?? 0), 0)).toBe(Number(summary.match(/\d+/)?.[0] ?? 0));
    for (const module of ASSESSMENT_MODULES) expect(displayedScores.get(module)).toEqual(expectedScores.get(module));
  });
});
