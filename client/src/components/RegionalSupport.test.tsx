import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/trpc", () => ({
  trpc: {
    assessment: { centralContact: { useQuery: () => ({ data: { whatsapp: "85268035342" }, isLoading: false }) } },
    centres: { featured: { useQuery: () => ({ data: [{ id: 1, district: "荃灣區", name: "言點教育 WELITedu", subjects: "[\"中文\",\"英文\",\"數學\"]" }], isLoading: false }) } },
  },
}));

import RegionalSupport, { filterCentresByCoverage } from "./RegionalSupport";

const centres = [
  { id: 1, district: "荃灣區", name: "言點教育 WELITedu" },
];

describe("RegionalSupport real partnership coverage", () => {
  it("shows the real 荃灣合作中心 when 荃灣區 or 新界 is selected", () => {
    expect(filterCentresByCoverage(centres, "荃灣區", "新界").map((centre) => centre.name)).toEqual(["言點教育 WELITedu"]);
    expect(filterCentresByCoverage(centres, "", "新界").map((centre) => centre.name)).toEqual(["言點教育 WELITedu"]);
  });

  it("does not leak the 荃灣合作中心 into 港島、九龍或其他未覆蓋地區", () => {
    expect(filterCentresByCoverage(centres, "", "港島")).toEqual([]);
    expect(filterCentresByCoverage(centres, "", "九龍")).toEqual([]);
    expect(filterCentresByCoverage(centres, "灣仔區", "港島")).toEqual([]);
  });

  it("renders 言點教育與轉介入口 for 荃灣, but a transparent pending state for 灣仔", () => {
    const abilities = [{ topic: "閱讀理解", total: 4, correct: 0, percentage: 0, state: "needs-support" }];
    const tsuenWan = renderToStaticMarkup(<RegionalSupport gradeLabel="小六" trackLabel="英文" abilities={abilities} homeDistrict="荃灣區" />);
    const wanChai = renderToStaticMarkup(<RegionalSupport gradeLabel="小六" trackLabel="英文" abilities={abilities} homeDistrict="灣仔區" />);
    expect(tsuenWan).toContain("言點教育 WELITedu");
    expect(tsuenWan).toContain("由學習航圖安排轉介");
    expect(wanChai).toContain("待合作中心加入");
    expect(wanChai).toContain("通知我有新合作支援");
    expect(wanChai).not.toContain("現有合作中心</dt><dd>言點教育 WELITedu");
  });
});
