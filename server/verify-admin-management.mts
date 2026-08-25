import "dotenv/config";
import { eq } from "drizzle-orm";
import { parentLeads, tutoringCentres } from "../drizzle/schema";
import { createCentre, createParentLead, getDb } from "../server/db";
import { appRouter } from "../server/routers";

const leadMarker = "INTEGRATION_TEST_ADMIN_LEAD_20260825";
const otherLeadMarker = "INTEGRATION_TEST_ADMIN_LEAD_OTHER_20260825";
const centreMarker = "INTEGRATION_TEST_ADMIN_TOGGLE_20260825";
const adminContext = { user: { id: 1, openId: "integration-admin", name: "Integration Admin", email: null, loginMethod: "test", role: "admin", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() }, req: { protocol: "https", headers: {} }, res: {} } as never;
const publicContext = { user: null, req: { protocol: "https", headers: {} }, res: {} } as never;

async function run() {
  const db = await getDb();
  if (!db) throw new Error("Database is unavailable for admin management verification.");
  await db.delete(parentLeads).where(eq(parentLeads.parentName, leadMarker));
  await db.delete(parentLeads).where(eq(parentLeads.parentName, otherLeadMarker));
  await db.delete(tutoringCentres).where(eq(tutoringCentres.name, centreMarker));
  try {
    const admin = appRouter.createCaller(adminContext);
    const publicCaller = appRouter.createCaller(publicContext);
    let leadsForbidden = false;
    let updateForbidden = false;
    let bulkForbidden = false;
    let toggleForbidden = false;
    try { await publicCaller.leads.adminList(); } catch { leadsForbidden = true; }
    try { await publicCaller.leads.updateFollowUp({ id: 1, followUpStatus: "contacted", internalNote: "未授權" }); } catch { updateForbidden = true; }
    try { await publicCaller.leads.bulkUpdateStatus({ ids: [1, 2], followUpStatus: "closed" }); } catch { bulkForbidden = true; }
    try { await publicCaller.centres.setActive({ id: 1, isActive: false }); } catch { toggleForbidden = true; }
    if (!leadsForbidden || !updateForbidden || !bulkForbidden || !toggleForbidden) throw new Error("Non-admin caller reached a protected management procedure.");

    await createParentLead({ parentName: leadMarker, phone: "91234567", district: "觀塘區", grade: "中一", track: "英文閱讀", score: 11, weaknessSummary: "受控匯出驗證", consentAt: new Date("2026-08-25T01:00:00.000Z"), createdAt: new Date("2026-08-25T01:00:00.000Z") });
    await createParentLead({ parentName: otherLeadMarker, phone: "91234568", district: "沙田區", grade: "中二", track: "數學", score: 9, weaknessSummary: "不應出現在最初篩選結果", consentAt: new Date("2026-08-25T01:05:00.000Z"), createdAt: new Date("2026-08-24T15:00:00.000Z") });
    const filtered = await admin.leads.adminList({ district: "觀塘區", grade: "中一", followUpStatus: "new", submittedFrom: "2026-08-25", submittedTo: "2026-08-25" });
    const listed = filtered.find((lead) => lead.parentName === leadMarker);
    if (!listed || filtered.some((lead) => lead.parentName === otherLeadMarker) || listed.phone !== "91234567") throw new Error("Admin lead filter did not return only the expected authorised record.");
    await admin.leads.updateFollowUp({ id: listed.id, followUpStatus: "contacted", internalNote: "已安排回電（受控驗證）。" });
    const exported = (await admin.leads.adminExport({ district: "觀塘區", grade: "中一", followUpStatus: "contacted" })).find((lead) => lead.id === listed.id);
    if (!exported || exported.followUpStatus !== "contacted" || exported.internalNote !== "已安排回電（受控驗證）。") throw new Error("Individual follow-up update was not persisted to filtered export.");

    const other = (await admin.leads.adminList({ district: "沙田區", grade: "中二", followUpStatus: "new" })).find((lead) => lead.parentName === otherLeadMarker);
    if (!other) throw new Error("Second controlled lead was not available for bulk update.");
    const bulkResult = await admin.leads.bulkUpdateStatus({ ids: [listed.id, other.id], followUpStatus: "closed" });
    if (bulkResult.updatedCount !== 2) throw new Error("Bulk update did not report the expected selected record count.");
    const closed = await admin.leads.adminList({ followUpStatus: "closed" });
    const closedListed = closed.find((lead) => lead.id === listed.id);
    const closedOther = closed.find((lead) => lead.id === other.id);
    if (!closedListed || !closedOther || closedListed.internalNote !== "已安排回電（受控驗證）。" || closedOther.internalNote !== null) throw new Error("Bulk status update did not preserve internal notes or status-filtered results.");
    const combined = await admin.leads.adminList({ district: "觀塘區", grade: "中一", followUpStatus: "closed" });
    if (!combined.some((lead) => lead.id === listed.id) || combined.some((lead) => lead.id === other.id)) throw new Error("Combined district, grade, and status filter returned unexpected leads.");
    const dated = await admin.leads.adminList({ submittedFrom: "2026-08-25", submittedTo: "2026-08-25", followUpStatus: "closed" });
    const datedExport = await admin.leads.adminExport({ submittedFrom: "2026-08-25", submittedTo: "2026-08-25", followUpStatus: "closed" });
    if (!dated.some((lead) => lead.id === listed.id) || dated.some((lead) => lead.id === other.id) || !datedExport.some((lead) => lead.id === listed.id) || datedExport.some((lead) => lead.id === other.id)) throw new Error("Hong Kong date range did not consistently constrain list and export results.");

    const centreId = (await createCentre({ name: centreMarker, description: "受控補習社啟用狀態測試記錄，完成後會立即清除。", whatsapp: "91234567", website: null, district: "觀塘區", region: "九龍", subjects: "[\"英文\"]", supportedGrades: "[\"小四\"]", isActive: true, isFeatured: true })).insertId;
    await admin.centres.setActive({ id: Number(centreId), isActive: false });
    const disabled = (await admin.centres.adminList()).find((centre) => centre.id === Number(centreId));
    const publicAfterDisable = await publicCaller.centres.featured();
    if (!disabled || disabled.isActive || publicAfterDisable.some((centre) => centre.id === Number(centreId))) throw new Error("Centre disable did not persist or remove it from public featured results.");
    await admin.centres.setActive({ id: Number(centreId), isActive: true });
    const publicAfterEnable = await publicCaller.centres.featured();
    if (!publicAfterEnable.some((centre) => centre.id === Number(centreId))) throw new Error("Centre enable did not restore it to public featured results.");
    console.log("Admin management verified: protected leads, combined date filters, bulk status persistence, note preservation, and active toggle public visibility passed.");
  } finally {
    await db.delete(parentLeads).where(eq(parentLeads.parentName, leadMarker));
    await db.delete(parentLeads).where(eq(parentLeads.parentName, otherLeadMarker));
    await db.delete(tutoringCentres).where(eq(tutoringCentres.name, centreMarker));
  }
}

run().then(() => process.exit(0)).catch((error) => { console.error(error); process.exit(1); });
