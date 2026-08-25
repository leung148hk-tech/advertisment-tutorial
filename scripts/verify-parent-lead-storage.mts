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
      grade: "中二",
      track: "Science",
      score: 9,
      weaknessSummary: "Scientific investigation：1/4；Life science：1/4",
      consent: true,
    });
    if (!result.success) throw new Error("submitParentLead did not report success.");

    const rows = await db.select().from(parentLeads).where(eq(parentLeads.parentName, marker)).limit(1);
    const lead = rows[0];
    if (!lead || lead.phone !== "90000000" || lead.district !== "沙田區" || lead.grade !== "中二" || lead.track !== "Science" || lead.weaknessSummary !== "Scientific investigation：1/4；Life science：1/4" || !lead.consentAt) {
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
