import { describe, expect, it } from "vitest";
import { appRouter, centreInput, leadBulkStatusInput, leadFilterInput, leadInput, leadManagementInput, referralCreateInput, referralFilterInput, referralUpdateInput } from "./routers";

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
  it("exposes the configured central WhatsApp contact through the lightweight public contact endpoint", async () => {
    const caller = appRouter.createCaller({ user: null, req: { protocol: "https", headers: {} }, res: {} } as never);
    await expect(caller.assessment.centralContact()).resolves.toEqual({ whatsapp: "85268035342" });
  });

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
  const validCentre = { name: "示例教育中心", description: "這是一段超過十個字的中心服務介紹。", whatsapp: "9123 4567", website: "", address: "觀塘示例中心 12 樓", district: "觀塘區", subjects: ["英文"], supportedGrades: ["小四"], isActive: true, isFeatured: false, isPubliclyListed: false, commissionArrangement: "pending" as const, privatePartnerNote: "合作條款待商議" };

  it("accepts a complete centre input and normalises its private WhatsApp number", () => {
    const parsed = centreInput.parse(validCentre);
    expect(parsed.whatsapp).toBe("91234567");
    expect(parsed.isPubliclyListed).toBe(false);
  });

  it("rejects an empty subject list, invalid WhatsApp number, or invalid website", () => {
    expect(centreInput.safeParse({ ...validCentre, subjects: [] }).success).toBe(false);
    expect(centreInput.safeParse({ ...validCentre, whatsapp: "12345678" }).success).toBe(false);
    expect(centreInput.safeParse({ ...validCentre, website: "not-a-url" }).success).toBe(false);
  });
});

describe("parent lead management validation", () => {
  it("accepts an authorised status update with an internal note and valid filters", () => {
    expect(leadManagementInput.safeParse({ id: 12, followUpStatus: "contacted", internalNote: "已安排回電。" }).success).toBe(true);
    expect(leadFilterInput.safeParse({ district: "觀塘區", grade: "中一", followUpStatus: "new", submittedFrom: "2026-08-01", submittedTo: "2026-08-31" }).success).toBe(true);
    expect(leadBulkStatusInput.safeParse({ ids: [1, 2], followUpStatus: "closed" }).success).toBe(true);
  });

  it("rejects invalid status, district, grade, and oversized internal notes", () => {
    expect(leadManagementInput.safeParse({ id: 12, followUpStatus: "pending", internalNote: null }).success).toBe(false);
    expect(leadManagementInput.safeParse({ id: 12, followUpStatus: "new", internalNote: "x".repeat(2001) }).success).toBe(false);
    expect(leadFilterInput.safeParse({ district: "香港", grade: "中一" }).success).toBe(false);
    expect(leadFilterInput.safeParse({ district: "觀塘區", grade: "中四" }).success).toBe(false);
    expect(leadFilterInput.safeParse({ followUpStatus: "pending" }).success).toBe(false);
    expect(leadFilterInput.safeParse({ submittedFrom: "2026-02-30" }).success).toBe(false);
    expect(leadFilterInput.safeParse({ submittedFrom: "2026/08/01" }).success).toBe(false);
    expect(leadFilterInput.safeParse({ submittedFrom: "2026-08-31", submittedTo: "2026-08-01" }).success).toBe(false);
    expect(leadBulkStatusInput.safeParse({ ids: [], followUpStatus: "closed" }).success).toBe(false);
    expect(leadBulkStatusInput.safeParse({ ids: Array.from({ length: 101 }, (_, index) => index + 1), followUpStatus: "closed" }).success).toBe(false);
  });
});

describe("central referral validation", () => {
  const validUpdate = { id: 7, status: "parent_confirmed" as const, internalNote: "家長已在官方 WhatsApp 確認。", commissionStatus: "not_discussed" as const, commissionAmountCents: null, commissionReference: null };

  it("accepts a private referral draft, filters, and a parent-confirmed update without financial terms", () => {
    expect(referralCreateInput.safeParse({ leadId: 2, centreId: 3, internalNote: "等待家長確認。" }).success).toBe(true);
    expect(referralFilterInput.safeParse({ status: "enrolment_pending", commissionStatus: "pending", centreId: 3 }).success).toBe(true);
    expect(referralUpdateInput.safeParse(validUpdate).success).toBe(true);
  });

  it("rejects invalid referral identifiers, statuses, and unsafe commission data", () => {
    expect(referralCreateInput.safeParse({ leadId: 0, centreId: 3 }).success).toBe(false);
    expect(referralFilterInput.safeParse({ status: "shared" }).success).toBe(false);
    expect(referralUpdateInput.safeParse({ ...validUpdate, commissionAmountCents: -1 }).success).toBe(false);
    expect(referralUpdateInput.safeParse({ ...validUpdate, commissionReference: "x".repeat(121) }).success).toBe(false);
    expect(referralUpdateInput.safeParse({ ...validUpdate, internalNote: "x".repeat(2001) }).success).toBe(false);
  });
});
