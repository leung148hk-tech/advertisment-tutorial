import { describe, expect, it } from "vitest";
import { parentLeadsToCsv } from "./LeadsAdmin";

describe("parentLeadsToCsv", () => {
  it("includes the protected follow-up columns and safely quotes user-entered content", () => {
    const csv = parentLeadsToCsv([{ id: 7, parentName: "陳太", phone: "91234567", district: "觀塘區", grade: "小六", track: "英文", score: 12, weaknessSummary: "詞彙, \"語境\"", consentAt: new Date("2026-08-25T01:02:03.000Z"), createdAt: new Date("2026-08-25T01:03:04.000Z"), followUpStatus: "new" }]);
    expect(csv).toContain("\uFEFF");
    expect(csv).toContain("聯絡電話");
    expect(csv).toContain('"詞彙, ""語境"""');
    expect(csv).toContain('"91234567"');
  });
});
