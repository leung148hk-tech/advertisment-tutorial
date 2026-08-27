// @vitest-environment jsdom
import React from "react";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { GradeId } from "@/data/gradedAssessment";
import { PRIMARY_CHINESE_READING_FRAMEWORK } from "@/data/primaryChineseReadingFramework";
import { primaryEnglishCombinedDomains } from "@/data/primaryEnglishFramework";
import { PRIMARY_MATH_FRAMEWORK } from "@/data/primaryMathFramework";

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

async function completeAssessment(grade: "小一" | "小六", cardName: RegExp) {
  window.scrollTo = vi.fn();
  const gradeId: GradeId = grade === "小一" ? "P1" : "P6";
  const randomSpy = vi.spyOn(Math, "random");
  randomSpy.mockImplementation(deterministicRandom());
  const user = userEvent.setup();
  const view = render(<Home />);

  await user.click(screen.getByRole("button", { name: grade }));
  await user.click(screen.getByRole("button", { name: cardName }));
  for (let index = 0; index < 20; index += 1) {
    await user.click(screen.getAllByRole("radio")[0]);
    await user.click(screen.getByRole("button", { name: index === 19 ? "生成免費報告" : "下一題" }));
  }
  await user.click(screen.getByRole("button", { name: "完成測驗資料" }));
  const report = view.container.querySelector<HTMLElement>(".download-report");
  if (!report) throw new Error("Expected the completed assessment report to render.");
  randomSpy.mockRestore();
  return { gradeId, report };
}

describe("Home primary Chinese report rendering", () => {
  it.each(["小一", "小六"] as const)("renders the authorised five Chinese domains for %s without generic reasoning modules", async (grade) => {
    const { gradeId, report } = await completeAssessment(grade, /^中文/);
    const expectedDomains = PRIMARY_CHINESE_READING_FRAMEWORK[gradeId as "P1" | "P6"].domains.map((domain) => domain.label);
    const cards = report.querySelectorAll(".module-score-grid > article");
    const displayedDomains = Array.from(cards, (card) => card.querySelector("span")?.textContent ?? "");

    expect(within(report).getByText("5 個中文範疇")).toBeTruthy();
    expect(within(report).getByText("中文範疇概覽")).toBeTruthy();
    expect(within(report).queryByText("情境推理")).toBeNull();
    expect(within(report).queryByText("5 個模組")).toBeNull();
    expect(cards).toHaveLength(5);
    expect(displayedDomains).toEqual(expectedDomains);
    expect(Array.from(cards, (card) => card.textContent ?? "").every((text) => /\/\s*4/.test(text))).toBe(true);
  });

  it("shows only the three supported assessment cards and labels the first card 中文", async () => {
    const user = userEvent.setup();
    render(<Home />);
    await user.click(screen.getByRole("button", { name: "小六" }));

    expect(screen.getByRole("button", { name: /^中文/ })).toBeTruthy();
    expect(screen.getByRole("button", { name: /^英文/ })).toBeTruthy();
    expect(screen.getByRole("button", { name: /^數學/ })).toBeTruthy();
    expect(screen.queryByRole("button", { name: /升中面試/ })).toBeNull();
    expect(screen.queryByText("中文閱讀")).toBeNull();
  });
});

describe("Home primary English framework rendering", () => {
  it.each(["小一", "小六"] as const)("renders ten grade-specific reading and writing-foundation domains for %s", async (grade) => {
    const { gradeId, report } = await completeAssessment(grade, /^英文/);
    const expectedDomains = primaryEnglishCombinedDomains(gradeId as "P1" | "P6").map((domain) => domain.label);
    const cards = report.querySelectorAll(".module-score-grid > article");
    const displayedDomains = Array.from(cards, (card) => card.querySelector("span")?.textContent ?? "");

    expect(within(report).getByText("10 個英文範疇（閱讀與寫作基礎）")).toBeTruthy();
    expect(within(report).getByText("英文範疇（閱讀與寫作基礎）概覽")).toBeTruthy();
    expect(within(report).queryByText("情境推理")).toBeNull();
    expect(cards).toHaveLength(10);
    expect(displayedDomains).toEqual(expectedDomains);
    expect(Array.from(cards, (card) => card.textContent ?? "").every((text) => /\/\s*2/.test(text))).toBe(true);
  });
});

describe("Home primary Mathematics framework rendering", () => {
  it.each(["小一", "小六"] as const)("renders five grade-specific Mathematics domains for %s", async (grade) => {
    const { gradeId, report } = await completeAssessment(grade, /^數學/);
    const expectedDomains = PRIMARY_MATH_FRAMEWORK[gradeId as "P1" | "P6"].map((domain) => domain.label);
    const cards = report.querySelectorAll(".module-score-grid > article");
    const displayedDomains = Array.from(cards, (card) => card.querySelector("span")?.textContent ?? "");

    expect(within(report).getByText("5 個數學能力範疇")).toBeTruthy();
    expect(within(report).getByText("數學能力範疇概覽")).toBeTruthy();
    expect(within(report).getByText(/並非 IQ 測驗/)).toBeTruthy();
    expect(within(report).queryByText("情境推理")).toBeNull();
    expect(cards).toHaveLength(5);
    expect(displayedDomains).toEqual(expectedDomains);
    expect(Array.from(cards, (card) => card.textContent ?? "").every((text) => /\/\s*4/.test(text))).toBe(true);
  });
});
