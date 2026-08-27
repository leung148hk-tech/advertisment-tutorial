import "dotenv/config";
import { eq } from "drizzle-orm";
import { parentLeads } from "../drizzle/schema";
import { getDb } from "../server/db";
import { appRouter } from "../server/routers";

const marker = "INTEGRATION_TEST_DO_NOT_CONTACT_20260825";

async function run() {
  const db = await getDb();
  if (!db) throw new Error("Database is unavailable for parent-lead storage verification.");

  await db.delete(parentLeads).where(eq(parentLeads.parentName, marker));
  try {
    const caller = appRouter.createCaller({
      user: null,
      req: { protocol: "https", headers: {} },
      res: {},
    } as never);
    const result = await caller.assessment.submitParentLead({
      parentName: marker,
      phone: "90000000",
      district: "沙田區",
      grade: "小六",
      track: "英文",
      score: 9,
      weaknessSummary: "閱讀：語氣、事實與偏見：1/2；寫作基礎：論證、語氣與全篇修訂：1/2",
      consent: true,
    });
    if (!result.success) throw new Error("submitParentLead did not report success.");

    const rows = await db.select().from(parentLeads).where(eq(parentLeads.parentName, marker)).limit(1);
    const lead = rows[0];
    if (!lead || lead.phone !== "90000000" || lead.district !== "沙田區" || lead.grade !== "小六" || lead.track !== "英文" || lead.weaknessSummary !== "閱讀：語氣、事實與偏見：1/2；寫作基礎：論證、語氣與全篇修訂：1/2" || !lead.consentAt) {
      throw new Error("Stored parent lead did not retain the required submitted fields.");
    }
    console.log("Parent lead storage verified: validated submission persisted correctly and will now be removed.");
  } finally {
    await db.delete(parentLeads).where(eq(parentLeads.parentName, marker));
  }
}

run().then(() => process.exit(0)).catch((error) => {
  console.error(error);
  process.exit(1);
});
