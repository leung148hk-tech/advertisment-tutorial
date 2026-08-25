import { describe, expect, it } from "vitest";
import { leadInput } from "./routers";

const validLead = {
  parentName: "陳太",
  phone: "9123 4567",
  district: "沙田區",
  grade: "中一",
  track: "英文閱讀",
  score: 12,
  weaknessSummary: "閱讀理解：1/4；詞彙與語境：1/4",
  consent: true as const,
};

describe("parent lead contact validation", () => {
  it("accepts a consented parent lead with a valid Hong Kong district and phone", () => {
    expect(leadInput.safeParse(validLead).success).toBe(true);
  });

  it("rejects malformed contact details or a district outside the eighteen districts", () => {
    expect(leadInput.safeParse({ ...validLead, phone: "abc-123" }).success).toBe(false);
    expect(leadInput.safeParse({ ...validLead, district: "香港" }).success).toBe(false);
  });

  it("requires explicit consent before a lead can be submitted", () => {
    expect(leadInput.safeParse({ ...validLead, consent: false }).success).toBe(false);
  });
});
