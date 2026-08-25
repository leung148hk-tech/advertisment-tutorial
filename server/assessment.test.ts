import { describe, expect, it } from "vitest";
import { centreInput, leadInput } from "./routers";

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

  it("accepts an optional +852 prefix and normalises formatting characters", () => {
    const parsed = leadInput.parse({ ...validLead, phone: "+852 (9123) 4567" });
    expect(parsed.phone).toBe("+85291234567");
  });

  it("rejects malformed contact details or a district outside the eighteen districts", () => {
    expect(leadInput.safeParse({ ...validLead, phone: "abc-123" }).success).toBe(false);
    expect(leadInput.safeParse({ ...validLead, phone: "9123456" }).success).toBe(false);
    expect(leadInput.safeParse({ ...validLead, phone: "+8613812345678" }).success).toBe(false);
    expect(leadInput.safeParse({ ...validLead, phone: "11234567" }).success).toBe(false);
    expect(leadInput.safeParse({ ...validLead, district: "香港" }).success).toBe(false);
  });

  it("requires explicit consent before a lead can be submitted", () => {
    expect(leadInput.safeParse({ ...validLead, consent: false }).success).toBe(false);
  });
});

describe("tutoring centre validation", () => {
  const validCentre = { name: "示例教育中心", description: "這是一段超過十個字的中心服務介紹。", whatsapp: "9123 4567", website: "", district: "觀塘區", subjects: ["英文"], supportedGrades: ["小四"], isActive: true, isFeatured: false };

  it("accepts a complete centre input and normalises its WhatsApp number", () => {
    const parsed = centreInput.parse(validCentre);
    expect(parsed.whatsapp).toBe("91234567");
  });

  it("rejects an empty subject list, invalid WhatsApp number, or invalid website", () => {
    expect(centreInput.safeParse({ ...validCentre, subjects: [] }).success).toBe(false);
    expect(centreInput.safeParse({ ...validCentre, whatsapp: "12345678" }).success).toBe(false);
    expect(centreInput.safeParse({ ...validCentre, website: "not-a-url" }).success).toBe(false);
  });
});
