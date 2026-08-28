import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/trpc", () => ({
  trpc: {
    assessment: { centralContact: { useQuery: () => ({ data: { whatsapp: "85268035342" }, isLoading: false }) } },
    centres: { featured: { useQuery: () => ({ data: [{ id: 1, district: "荃灣區", name: "言點教育 WELITedu", description: "用心指導", subjects: "[\"中文\",\"英文\",\"數學\"]", supportedGrades: "[\"小一\",\"小二\",\"小三\",\"小四\",\"小五\",\"小六\"]" }], isLoading: false }) } },
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

  it("renders one eligible centre with the completed grade and subject, but a transparent pending state for 灣仔", () => {
    const abilities = [{ topic: "平面與立體圖形", total: 4, correct: 0, percentage: 0, state: "needs-support" }, { topic: "時間與直接比較", total: 4, correct: 0, percentage: 0, state: "needs-support" }];
    const tsuenWan = renderToStaticMarkup(<RegionalSupport gradeLabel="小一" trackLabel="數學" abilities={abilities} homeDistrict="荃灣區" />);
    const wanChai = renderToStaticMarkup(<RegionalSupport gradeLabel="小六" trackLabel="英文" abilities={abilities} homeDistrict="灣仔區" />);
    expect(tsuenWan.match(/<article class="regional-support-card regional-support-card-real"/g)).toHaveLength(1);
    expect(tsuenWan).toContain("言點教育 WELITedu");
    expect(tsuenWan).toContain("現正提供 <strong>小一數學</strong> 學習支援");
    expect(tsuenWan).not.toContain("平面與立體圖形</h3>");
    expect(tsuenWan).not.toContain("針對性溫習建議");
    expect(tsuenWan).toContain("由學習航圖安排轉介");
    expect(wanChai).toContain("待合作中心加入");
    expect(wanChai).toContain("了解現時可安排的支援");
    expect(wanChai).not.toContain("現正提供 <strong>小六英文</strong> 學習支援");
  });
});
