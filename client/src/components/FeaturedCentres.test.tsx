import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/trpc", () => ({
  trpc: {
    assessment: { centralContact: { useQuery: () => ({ data: { whatsapp: "85268035342" }, isLoading: false }) } },
    centres: { featured: { useQuery: () => ({ data: [{ id: 1, name: "言點教育 WELITedu", description: "用心指導，燃點你心，陪伴學生一起成長。", district: "荃灣區", subjects: "[\"中文\",\"英文\",\"數學\",\"Science\"]", supportedGrades: "[\"小一\",\"中六\"]" }], isLoading: false, isError: false }) } },
  },
}));

import FeaturedCentres from "./FeaturedCentres";

describe("FeaturedCentres public partnership card", () => {
  it("renders the refreshed WELITedu promotion with only the central referral CTA", () => {
    const markup = renderToStaticMarkup(<FeaturedCentres />);
    expect(markup).toContain("為孩子配對下一步支援");
    expect(markup).toContain("言點教育 WELITedu");
    expect(markup).toContain("現正合作");
    expect(markup).toContain("安排學習支援配對");
    expect(markup).toContain("featured-referral-button");
    expect(markup).not.toContain("64781044");
  });
});
