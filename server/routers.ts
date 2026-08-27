import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { createCentre, createParentLead, createReferral, deleteCentre, getCentreById, getParentLeadById, getReferralById, listCentres, listFeaturedCentres, listFilteredParentLeads, listReferrals, setCentreActive, updateCentre, updateParentLeadFollowUp, updateParentLeadStatuses, updateReferral } from "./db";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";

export const DISTRICTS = ["中西區", "灣仔區", "東區", "南區", "油尖旺區", "深水埗區", "九龍城區", "黃大仙區", "觀塘區", "葵青區", "荃灣區", "屯門區", "元朗區", "北區", "大埔區", "沙田區", "西貢區", "離島區"] as const;
const ASSESSMENT_GRADES = ["小一", "小二", "小三", "小四", "小五", "小六"] as const;
const ASSESSMENT_TRACKS = ["中文", "英文", "數學"] as const;
const hkPhone = z.string().trim().transform((value) => value.replace(/[\s()-]/g, "")).refine((value) => /^(?:\+852)?[2-9]\d{7}$/.test(value), "請填寫有效香港電話，例如 9123 4567 或 +852 9123 4567");
export function getCentralWhatsAppNumber() {
  const digits = (process.env.VITE_CENTRAL_WHATSAPP ?? "").replace(/\D/g, "");
  if (/^[2-9]\d{7}$/.test(digits)) return `852${digits}`;
  if (/^852[2-9]\d{7}$/.test(digits)) return digits;
  throw new Error("中央 WhatsApp 號碼尚未設定或格式無效");
}
const isDateOnly = (value: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const check = new Date(Date.UTC(year, month - 1, day));
  return check.getUTCFullYear() === year && check.getUTCMonth() === month - 1 && check.getUTCDate() === day;
};
const hkDateOnly = z.string().refine(isDateOnly, "請選擇有效日期");
const hongKongDayStart = (value: string) => new Date(`${value}T00:00:00.000+08:00`);
const hongKongDayEnd = (value: string) => new Date(`${value}T23:59:59.999+08:00`);
export const leadInput = z.object({
  parentName: z.string().trim().min(2, "請填寫家長稱呼").max(120),
  phone: hkPhone,
  district: z.enum(DISTRICTS),
  grade: z.enum(ASSESSMENT_GRADES),
  track: z.enum(ASSESSMENT_TRACKS),
  score: z.number().int().min(0).max(20),
  weaknessSummary: z.string().trim().min(1).max(2000),
  consent: z.literal(true, { error: "需要同意資料用於學習跟進" }),
});

export const leadFilterInput = z.object({
  district: z.enum(DISTRICTS).optional(),
  grade: z.enum(ASSESSMENT_GRADES).optional(),
  followUpStatus: z.enum(["new", "contacted", "closed"]).optional(),
  submittedFrom: hkDateOnly.optional(),
  submittedTo: hkDateOnly.optional(),
}).refine((input) => !input.submittedFrom || !input.submittedTo || input.submittedFrom <= input.submittedTo, { message: "開始日期不可晚於結束日期", path: ["submittedTo"] });
export const leadManagementInput = z.object({
  id: z.number().int().positive(),
  followUpStatus: z.enum(["new", "contacted", "closed"]),
  internalNote: z.string().trim().max(2000, "內部備註不可超過 2000 字").nullable(),
});
export const leadBulkStatusInput = z.object({
  ids: z.array(z.number().int().positive()).min(1, "請至少選擇一筆家長資料").max(100, "每次最多可更新 100 筆資料"),
  followUpStatus: z.enum(["new", "contacted", "closed"]),
});

export const centreInput = z.object({
  name: z.string().trim().min(2, "請填寫補習社名稱").max(160),
  description: z.string().trim().min(10, "請填寫至少 10 字介紹").max(500),
  whatsapp: hkPhone,
  website: z.string().trim().url("請填寫有效網站網址").max(320).optional().or(z.literal("")),
  address: z.string().trim().max(320).optional().or(z.literal("")),
  district: z.enum(DISTRICTS),
  subjects: z.array(z.string().trim().min(1).max(40)).min(1, "請至少選擇一個科目").max(8),
  supportedGrades: z.array(z.string().trim().min(1).max(20)).min(1, "請至少選擇一個年級").max(12),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  isPubliclyListed: z.boolean(),
  commissionArrangement: z.enum(["pending", "fixed", "percentage", "mixed"]),
  privatePartnerNote: z.string().trim().max(2000).optional().or(z.literal("")),
});
const referralStatuses = ["draft", "awaiting_parent_confirmation", "parent_confirmed", "shared_with_centre", "enrolment_pending", "enrolled", "cancelled", "expired"] as const;
const commissionStatuses = ["not_discussed", "pending", "confirmed", "paid", "waived"] as const;
const referralStatusInput = z.enum(referralStatuses);
const commissionStatusInput = z.enum(commissionStatuses);
export const referralCreateInput = z.object({
  leadId: z.number().int().positive(),
  centreId: z.number().int().positive(),
  internalNote: z.string().trim().max(2000).optional(),
});
export const referralFilterInput = z.object({
  centreId: z.number().int().positive().optional(),
  status: referralStatusInput.optional(),
  commissionStatus: commissionStatusInput.optional(),
});
export const referralUpdateInput = z.object({
  id: z.number().int().positive(),
  status: referralStatusInput,
  internalNote: z.string().trim().max(2000).nullable(),
  commissionStatus: commissionStatusInput,
  commissionAmountCents: z.number().int().min(0).max(10_000_000).nullable(),
  commissionReference: z.string().trim().max(120).nullable(),
});
const regionForDistrict = (district: typeof DISTRICTS[number]) => DISTRICTS.indexOf(district) < 4 ? "港島" : DISTRICTS.indexOf(district) < 9 ? "九龍" : "新界";
const referralStatusTransitions: Record<(typeof referralStatuses)[number], readonly (typeof referralStatuses)[number][]> = {
  draft: ["awaiting_parent_confirmation", "cancelled"],
  awaiting_parent_confirmation: ["parent_confirmed", "cancelled", "expired"],
  parent_confirmed: ["shared_with_centre", "cancelled", "expired"],
  shared_with_centre: ["enrolment_pending", "cancelled", "expired"],
  enrolment_pending: ["enrolled", "cancelled", "expired"],
  enrolled: [],
  cancelled: [],
  expired: [],
};
const referralCode = () => `LC-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  assessment: router({
    centralContact: publicProcedure.query(() => ({ whatsapp: getCentralWhatsAppNumber() })),
    submitParentLead: publicProcedure.input(leadInput).mutation(async ({ input }) => {
      await createParentLead({
        parentName: input.parentName,
        phone: input.phone,
        district: input.district,
        grade: input.grade,
        track: input.track,
        score: input.score,
        weaknessSummary: input.weaknessSummary,
        consentAt: new Date(),
      });
      return { success: true } as const;
    }),
  }),

  // Parent contact data is never exposed publicly. These endpoints require adminProcedure.
  leads: router({
    adminList: adminProcedure.input(leadFilterInput.optional()).query(({ input }) => listFilteredParentLeads({ district: input?.district, grade: input?.grade, followUpStatus: input?.followUpStatus, submittedFrom: input?.submittedFrom ? hongKongDayStart(input.submittedFrom) : undefined, submittedTo: input?.submittedTo ? hongKongDayEnd(input.submittedTo) : undefined })),
    adminExport: adminProcedure.input(leadFilterInput.optional()).query(({ input }) => listFilteredParentLeads({ district: input?.district, grade: input?.grade, followUpStatus: input?.followUpStatus, submittedFrom: input?.submittedFrom ? hongKongDayStart(input.submittedFrom) : undefined, submittedTo: input?.submittedTo ? hongKongDayEnd(input.submittedTo) : undefined })),
    updateFollowUp: adminProcedure.input(leadManagementInput).mutation(async ({ input }) => {
      await updateParentLeadFollowUp(input.id, input.followUpStatus, input.internalNote || null);
      return { success: true } as const;
    }),
    bulkUpdateStatus: adminProcedure.input(leadBulkStatusInput).mutation(async ({ input }) => {
      await updateParentLeadStatuses(input.ids, input.followUpStatus);
      return { success: true, updatedCount: input.ids.length } as const;
    }),
  }),

  centres: router({
    featured: publicProcedure.query(() => listFeaturedCentres()),
    adminList: adminProcedure.query(() => listCentres()),
    create: adminProcedure.input(centreInput).mutation(async ({ input }) => {
      await createCentre({ ...input, website: input.website || null, address: input.address || null, privatePartnerNote: input.privatePartnerNote || null, region: regionForDistrict(input.district), subjects: JSON.stringify(input.subjects), supportedGrades: JSON.stringify(input.supportedGrades) });
      return { success: true } as const;
    }),
    update: adminProcedure.input(z.object({ id: z.number().int().positive(), centre: centreInput })).mutation(async ({ input }) => {
      await updateCentre(input.id, { ...input.centre, website: input.centre.website || null, address: input.centre.address || null, privatePartnerNote: input.centre.privatePartnerNote || null, region: regionForDistrict(input.centre.district), subjects: JSON.stringify(input.centre.subjects), supportedGrades: JSON.stringify(input.centre.supportedGrades) });
      return { success: true } as const;
    }),
    setActive: adminProcedure.input(z.object({ id: z.number().int().positive(), isActive: z.boolean() })).mutation(async ({ input }) => {
      await setCentreActive(input.id, input.isActive);
      return { success: true } as const;
    }),
    remove: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ input }) => {
      await deleteCentre(input.id);
      return { success: true } as const;
    }),
  }),

  referrals: router({
    adminList: adminProcedure.input(referralFilterInput.optional()).query(({ input }) => listReferrals(input)),
    adminExport: adminProcedure.input(referralFilterInput.optional()).query(({ input }) => listReferrals(input)),
    create: adminProcedure.input(referralCreateInput).mutation(async ({ input }) => {
      const [lead, centre] = await Promise.all([getParentLeadById(input.leadId), getCentreById(input.centreId)]);
      if (!lead) throw new Error("找不到家長提交資料");
      if (!centre || !centre.isActive) throw new Error("請選擇啟用中的合作中心");
      const referenceCode = referralCode();
      await createReferral({ leadId: lead.id, centreId: centre.id, referenceCode, status: "awaiting_parent_confirmation", internalNote: input.internalNote || null });
      return { success: true, referenceCode } as const;
    }),
    update: adminProcedure.input(referralUpdateInput).mutation(async ({ input }) => {
      const current = await getReferralById(input.id);
      if (!current) throw new Error("找不到轉介記錄");
      if (current.status !== input.status && !referralStatusTransitions[current.status].includes(input.status)) {
        throw new Error("此轉介狀態不可直接跳轉，請先完成家長確認及資料分享步驟");
      }
      const now = new Date();
      await updateReferral(input.id, {
        status: input.status,
        internalNote: input.internalNote || null,
        commissionStatus: input.commissionStatus,
        commissionAmountCents: input.commissionAmountCents,
        commissionReference: input.commissionReference || null,
        parentConfirmedAt: input.status === "parent_confirmed" && !current.parentConfirmedAt ? now : current.parentConfirmedAt,
        sharedWithCentreAt: input.status === "shared_with_centre" && !current.sharedWithCentreAt ? now : current.sharedWithCentreAt,
        enrolledAt: input.status === "enrolled" && !current.enrolledAt ? now : current.enrolledAt,
        commissionPaidAt: input.commissionStatus === "paid" && !current.commissionPaidAt ? now : current.commissionPaidAt,
      });
      return { success: true } as const;
    }),
  }),

});

export type AppRouter = typeof appRouter;
