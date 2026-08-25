import { and, desc, eq, gte, inArray, lte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertParentLead, InsertTutoringCentre, InsertUser, parentLeads, tutoringCentres, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function createParentLead(lead: InsertParentLead) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database is unavailable");
  }
  const result = await db.insert(parentLeads).values(lead);
  return result[0];
}

/** This result includes parent-authorised contact data and must be admin-gated by its caller. */
export async function listParentLeads() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(parentLeads).orderBy(desc(parentLeads.createdAt));
}

export type ParentLeadFilters = { district?: string; grade?: string; followUpStatus?: "new" | "contacted" | "closed"; submittedFrom?: Date; submittedTo?: Date };

export async function listFilteredParentLeads(filters: ParentLeadFilters) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [filters.district ? eq(parentLeads.district, filters.district) : undefined, filters.grade ? eq(parentLeads.grade, filters.grade) : undefined, filters.followUpStatus ? eq(parentLeads.followUpStatus, filters.followUpStatus) : undefined, filters.submittedFrom ? gte(parentLeads.createdAt, filters.submittedFrom) : undefined, filters.submittedTo ? lte(parentLeads.createdAt, filters.submittedTo) : undefined].filter(Boolean);
  if (!conditions.length) return db.select().from(parentLeads).orderBy(desc(parentLeads.createdAt));
  return db.select().from(parentLeads).where(and(...conditions)).orderBy(desc(parentLeads.createdAt));
}

export async function updateParentLeadFollowUp(id: number, followUpStatus: "new" | "contacted" | "closed", internalNote: string | null) {
  const db = await getDb();
  if (!db) throw new Error("Database is unavailable");
  await db.update(parentLeads).set({ followUpStatus, internalNote }).where(eq(parentLeads.id, id));
}

/** Batch status updates intentionally leave internalNote untouched. */
export async function updateParentLeadStatuses(ids: number[], followUpStatus: "new" | "contacted" | "closed") {
  const db = await getDb();
  if (!db) throw new Error("Database is unavailable");
  await db.update(parentLeads).set({ followUpStatus }).where(inArray(parentLeads.id, ids));
}

export async function listFeaturedCentres() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(tutoringCentres).where(and(eq(tutoringCentres.isActive, true), eq(tutoringCentres.isFeatured, true))).orderBy(desc(tutoringCentres.updatedAt));
}

export async function listCentres() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(tutoringCentres).orderBy(desc(tutoringCentres.updatedAt));
}

export async function createCentre(centre: InsertTutoringCentre) {
  const db = await getDb();
  if (!db) throw new Error("Database is unavailable");
  return (await db.insert(tutoringCentres).values(centre))[0];
}

export async function updateCentre(id: number, centre: Partial<InsertTutoringCentre>) {
  const db = await getDb();
  if (!db) throw new Error("Database is unavailable");
  await db.update(tutoringCentres).set(centre).where(eq(tutoringCentres.id, id));
}

export async function setCentreActive(id: number, isActive: boolean) {
  await updateCentre(id, { isActive });
}

export async function deleteCentre(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is unavailable");
  await db.delete(tutoringCentres).where(eq(tutoringCentres.id, id));
}
