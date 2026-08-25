import "dotenv/config";
import { eq } from "drizzle-orm";
import { parentLeads, tutoringCentres } from "../drizzle/schema";
import { createCentre, createParentLead, getDb } from "../server/db";
import { appRouter } from "../server/routers";

const leadMarker = "INTEGRATION_TEST_ADMIN_LEAD_20260825";
const centreMarker = "INTEGRATION_TEST_ADMIN_TOGGLE_20260825";
const adminContext = { user: { id: 1, openId: "integration-admin", name: "Integration Admin", email: null, loginMethod: "test", role: "admin", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() }, req: { protocol: "https", headers: {} }, res: {} } as never;
const publicContext = { user: null, req: { protocol: "https", headers: {} }, res: {} } as never;

async function run() {
  const db = await getDb();
  if (!db) throw new Error("Database is unavailable for admin management verification.");
  await db.delete(parentLeads).where(eq(parentLeads.parentName, leadMarker));
  await db.delete(tutoringCentres).where(eq(tutoringCentres.name, centreMarker));
  try {
    const admin = appRouter.createCaller(adminContext);
    const publicCaller = appRouter.createCaller(publicContext);
    let leadsForbidden = false;
    let toggleForbidden = false;
    try { await publicCaller.leads.adminList(); } catch { leadsForbidden = true; }
    try { await publicCaller.centres.setActive({ id: 1, isActive: false }); } catch { toggleForbidden = true; }
    if (!leadsForbidden || !toggleForbidden) throw new Error("Non-admin caller reached a protected management procedure.");

    await createParentLead({ parentName: leadMarker, phone: "91234567", district: "觀塘區", grade: "中一", track: "英文閱讀", score: 11, weaknessSummary: "受控匯出驗證", consentAt: new Date("2026-08-25T01:00:00.000Z") });
    const listed = (await admin.leads.adminList()).find((lead) => lead.parentName === leadMarker);
    const exported = (await admin.leads.adminExport()).find((lead) => lead.parentName === leadMarker);
    if (!listed || !exported || listed.phone !== "91234567" || exported.weaknessSummary !== "受控匯出驗證") throw new Error("Admin lead listing/export did not return the expected authorised record.");

    const centreId = (await createCentre({ name: centreMarker, description: "受控補習社啟用狀態測試記錄，完成後會立即清除。", whatsapp: "91234567", website: null, district: "觀塘區", region: "九龍", subjects: "[\"英文\"]", supportedGrades: "[\"小四\"]", isActive: true, isFeatured: true })).insertId;
    await admin.centres.setActive({ id: Number(centreId), isActive: false });
    const disabled = (await admin.centres.adminList()).find((centre) => centre.id === Number(centreId));
    const publicAfterDisable = await publicCaller.centres.featured();
    if (!disabled || disabled.isActive || publicAfterDisable.some((centre) => centre.id === Number(centreId))) throw new Error("Centre disable did not persist or remove it from public featured results.");
    await admin.centres.setActive({ id: Number(centreId), isActive: true });
    const publicAfterEnable = await publicCaller.centres.featured();
    if (!publicAfterEnable.some((centre) => centre.id === Number(centreId))) throw new Error("Centre enable did not restore it to public featured results.");
    console.log("Admin management verified: protected leads, authorised list/export, and active toggle public visibility passed.");
  } finally {
    await db.delete(parentLeads).where(eq(parentLeads.parentName, leadMarker));
    await db.delete(tutoringCentres).where(eq(tutoringCentres.name, centreMarker));
  }
}

run().then(() => process.exit(0)).catch((error) => { console.error(error); process.exit(1); });
