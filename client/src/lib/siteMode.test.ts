import { describe, expect, it } from "vitest";
import { OFFICIAL_SITE_URL, STATIC_CENTRAL_WHATSAPP, STATIC_FEATURED_CENTRES, officialSiteUrl } from "./siteMode";

describe("GitHub Pages static handoff", () => {
  it("keeps protected flows on the official site and exposes only approved public fallback details", () => {
    expect(OFFICIAL_SITE_URL).toBe("https://learnquiz-pe8vp32z.manus.space");
    expect(officialSiteUrl("/admin/centres")).toBe(`${OFFICIAL_SITE_URL}/admin/centres`);
    expect(STATIC_CENTRAL_WHATSAPP).toBe("85268035342");
    expect(STATIC_FEATURED_CENTRES).toEqual([
      expect.objectContaining({ name: "言點教育 WELITedu", district: "荃灣區", region: "新界" }),
    ]);
  });
});
