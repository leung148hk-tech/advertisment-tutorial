import { eq } from "drizzle-orm";
import { appRouter } from "./routers";
import { createCentre, createParentLead, getDb } from "./db";
import { parentLeads, referrals, tutoringCentres } from "../drizzle/schema";

const marker = `受控中央轉介-${Date.now()}`;
const centreMarker = `受控合作中心-${Date.now()}`;

const context = (role: "admin" | "user") => ({
  user: { id: role === "admin" ? 881 : 882, openId: `referral-${role}`, name: role, email: null, loginMethod: "manus", role, createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() },
  req: { protocol: "https", headers: {} },
  res: {},
}) as never;

async function run() {
  const db = await getDb();
  if (!db) throw new Error("Database is unavailable for controlled referral verification.");
  const admin = appRouter.createCaller(context("admin"));
  const publicCaller = appRouter.createCaller({ user: null, req: { protocol: "https", headers: {} }, res: {} } as never);
  const userCaller = appRouter.createCaller(context("user"));
  let leadId: number | undefined;
  let centreId: number | undefined;

  try {
    let forbidden = false;
    try { await userCaller.referrals.adminList(); } catch { forbidden = true; }
    if (!forbidden) throw new Error("Non-admin caller reached referral data.");

    leadId = Number((await createParentLead({ parentName: marker, phone: "91234567", district: "荃灣區", grade: "中一", track: "英文閱讀", score: 10, weaknessSummary: "受控中央轉介驗證", consentAt: new Date() })).insertId);
    centreId = Number((await createCentre({ name: centreMarker, description: "受控中央轉介合作中心測試記錄，完成後會立即清除。", whatsapp: "92345678", website: null, address: "荃灣受控測試地址", district: "荃灣區", region: "新界", subjects: "[\"英文\"]", supportedGrades: "[\"中一\"]", isActive: true, isFeatured: true, isPubliclyListed: true, commissionArrangement: "pending", privatePartnerNote: "受控私有合作備註" })).insertId);

    const publicCentres = await publicCaller.centres.featured();
    const publicCentre = publicCentres.find((centre) => centre.id === centreId) as unknown as Record<string, unknown> | undefined;
    if (!publicCentre || "whatsapp" in publicCentre || "privatePartnerNote" in publicCentre || "commissionArrangement" in publicCentre) throw new Error("Public centre response exposed private partner data.");

    const created = await admin.referrals.create({ leadId, centreId, internalNote: "等待家長確認指定合作中心。" });
    const record = (await admin.referrals.adminList()).find((item) => item.referenceCode === created.referenceCode);
    if (!record || record.status !== "awaiting_parent_confirmation" || record.phone !== "91234567") throw new Error("Referral creation did not produce an authorised pending-confirmation record.");

    let directShareRejected = false;
    try { await admin.referrals.update({ id: record.id, status: "shared_with_centre", internalNote: "不應允許", commissionStatus: "not_discussed", commissionAmountCents: null, commissionReference: null }); } catch { directShareRejected = true; }
    if (!directShareRejected) throw new Error("Referral was shared before parent confirmation.");

    await admin.referrals.update({ id: record.id, status: "parent_confirmed", internalNote: "家長已確認可向指定中心分享最少資料。", commissionStatus: "not_discussed", commissionAmountCents: null, commissionReference: null });
    await admin.referrals.update({ id: record.id, status: "shared_with_centre", internalNote: "已按轉介編號分享所需資料。", commissionStatus: "pending", commissionAmountCents: null, commissionReference: null });
    await admin.referrals.update({ id: record.id, status: "enrolment_pending", internalNote: "等待中心回報。", commissionStatus: "pending", commissionAmountCents: null, commissionReference: null });
    await admin.referrals.update({ id: record.id, status: "enrolled", internalNote: "中心已確認成功報名。", commissionStatus: "confirmed", commissionAmountCents: 15000, commissionReference: "受控對帳-001" });
    await admin.referrals.update({ id: record.id, status: "enrolled", internalNote: "已核對收佣。", commissionStatus: "paid", commissionAmountCents: 15000, commissionReference: "受控對帳-001" });
    const settled = (await admin.referrals.adminExport({ status: "enrolled", commissionStatus: "paid", centreId })).find((item) => item.id === record.id);
    if (!settled || !settled.parentConfirmedAt || !settled.sharedWithCentreAt || !settled.enrolledAt || settled.commissionAmountCents !== 15000 || settled.commissionReference !== "受控對帳-001") throw new Error("Referral state flow or commission reconciliation did not persist.");
    console.log("Central referrals verified: admin-only access, public data minimisation, parent-confirmation gate, enrolment and commission reconciliation passed.");
  } finally {
    if (leadId) await db.delete(referrals).where(eq(referrals.leadId, leadId));
    if (leadId) await db.delete(parentLeads).where(eq(parentLeads.id, leadId));
    if (centreId) await db.delete(tutoringCentres).where(eq(tutoringCentres.id, centreId));
  }
}

run().then(() => process.exit(0)).catch((error) => { console.error(error); process.exit(1); });
