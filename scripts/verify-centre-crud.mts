import "dotenv/config";
import { eq } from "drizzle-orm";
import { tutoringCentres } from "../drizzle/schema";
import { getDb } from "../server/db";
import { appRouter } from "../server/routers";

const marker = "INTEGRATION_TEST_CENTRE_DO_NOT_CONTACT_20260825";
const adminContext = { user: { id: 1, openId: "integration-admin", name: "Integration Admin", email: null, loginMethod: "test", role: "admin", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() }, req: { protocol: "https", headers: {} }, res: {} } as never;
const publicContext = { user: null, req: { protocol: "https", headers: {} }, res: {} } as never;

async function run() {
  const db = await getDb();
  if (!db) throw new Error("Database is unavailable for centre CRUD verification.");
  await db.delete(tutoringCentres).where(eq(tutoringCentres.name, marker));
  try {
    const admin = appRouter.createCaller(adminContext);
    const publicCaller = appRouter.createCaller(publicContext);
    let forbidden = false;
    try { await publicCaller.centres.adminList(); } catch { forbidden = true; }
    if (!forbidden) throw new Error("Non-admin caller was not rejected from centre management.");

    await admin.centres.create({ name: marker, description: "受控測試用的真實資料驗證描述，完成後會立即刪除。", whatsapp: "91234567", website: "", district: "觀塘區", subjects: ["英文"], supportedGrades: ["小四"], isActive: true, isFeatured: false });
    const created = (await admin.centres.adminList()).find((centre) => centre.name === marker);
    if (!created || created.region !== "九龍" || created.isFeatured || !created.isActive) throw new Error("Centre creation did not persist expected district and status fields.");

    await admin.centres.update({ id: created.id, centre: { name: marker, description: "受控測試用的更新描述，完成後會立即刪除。", whatsapp: "+852 9123 4567", website: "https://example.com", district: "灣仔區", subjects: ["英文", "中文"], supportedGrades: ["小四", "小五"], isActive: true, isFeatured: true } });
    const updated = (await admin.centres.adminList()).find((centre) => centre.id === created.id);
    if (!updated || updated.region !== "港島" || updated.district !== "灣仔區" || !updated.isFeatured || !updated.isActive || updated.website !== "https://example.com") throw new Error("Centre update did not persist expected region, featured, active, or website fields.");
    const featured = await publicCaller.centres.featured();
    if (!featured.some((centre) => centre.id === created.id)) throw new Error("Enabled featured centre was not returned by the public carousel query.");

    await admin.centres.remove({ id: created.id });
    const removed = (await admin.centres.adminList()).find((centre) => centre.id === created.id);
    if (removed) throw new Error("Centre deletion did not remove the record.");
    console.log("Centre CRUD verified: non-admin rejected; create, update, public featured visibility, district change, and deletion passed.");
  } finally {
    await db.delete(tutoringCentres).where(eq(tutoringCentres.name, marker));
  }
}

run().then(() => process.exit(0)).catch((error) => { console.error(error); process.exit(1); });
