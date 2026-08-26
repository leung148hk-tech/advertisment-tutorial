import { boolean, index, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Parent-authorised assessment follow-up requests. Phone data is never exposed
 * through public queries; the public surface is submit-only.
 */
export const parentLeads = mysqlTable("parent_leads", {
  id: int("id").autoincrement().primaryKey(),
  parentName: varchar("parentName", { length: 120 }).notNull(),
  phone: varchar("phone", { length: 32 }).notNull(),
  district: varchar("district", { length: 32 }).notNull(),
  grade: varchar("grade", { length: 8 }).notNull(),
  track: varchar("track", { length: 64 }).notNull(),
  score: int("score").notNull(),
  weaknessSummary: text("weaknessSummary").notNull(),
  consentAt: timestamp("consentAt").notNull(),
  followUpStatus: mysqlEnum("followUpStatus", ["new", "contacted", "closed"]).default("new").notNull(),
  /** Private staff note. Never exposed through public procedures or shared reports. */
  internalNote: text("internalNote"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => [
  index("parent_leads_district_idx").on(table.district),
  index("parent_leads_status_created_idx").on(table.followUpStatus, table.createdAt),
]);

export type ParentLead = typeof parentLeads.$inferSelect;
export type InsertParentLead = typeof parentLeads.$inferInsert;

/** Administrator-managed, real partner-centre data. No customer ratings or reviews are stored. */
export const tutoringCentres = mysqlTable("tutoring_centres", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  description: text("description").notNull(),
  /** Private partner contact. Never returned through public centre queries. */
  whatsapp: varchar("whatsapp", { length: 32 }).notNull(),
  website: varchar("website", { length: 320 }),
  address: varchar("address", { length: 320 }),
  district: varchar("district", { length: 32 }).notNull(),
  region: varchar("region", { length: 16 }).notNull(),
  subjects: text("subjects").notNull(),
  supportedGrades: text("supportedGrades").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  isFeatured: boolean("isFeatured").default(false).notNull(),
  /** Explicit display control; public cards never reveal direct centre contacts. */
  isPubliclyListed: boolean("isPubliclyListed").default(false).notNull(),
  commissionArrangement: mysqlEnum("commissionArrangement", ["pending", "fixed", "percentage", "mixed"]).default("pending").notNull(),
  privatePartnerNote: text("privatePartnerNote"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [
  index("tutoring_centres_featured_idx").on(table.isFeatured, table.isActive),
  index("tutoring_centres_district_idx").on(table.district),
]);

export type TutoringCentre = typeof tutoringCentres.$inferSelect;
export type InsertTutoringCentre = typeof tutoringCentres.$inferInsert;

/**
 * A private, admin-managed referral record. The partner is contacted only after
 * the parent has explicitly confirmed the selected centre.
 */
export const referrals = mysqlTable("referrals", {
  id: int("id").autoincrement().primaryKey(),
  referenceCode: varchar("referenceCode", { length: 32 }).notNull().unique(),
  leadId: int("leadId").notNull(),
  centreId: int("centreId").notNull(),
  status: mysqlEnum("status", ["draft", "awaiting_parent_confirmation", "parent_confirmed", "shared_with_centre", "enrolment_pending", "enrolled", "cancelled", "expired"]).default("draft").notNull(),
  /** Timestamp of the second, centre-specific consent obtained by the administrator. */
  parentConfirmedAt: timestamp("parentConfirmedAt"),
  sharedWithCentreAt: timestamp("sharedWithCentreAt"),
  enrolledAt: timestamp("enrolledAt"),
  commissionStatus: mysqlEnum("commissionStatus", ["not_discussed", "pending", "confirmed", "paid", "waived"]).default("not_discussed").notNull(),
  /** Actual financial terms remain private and can remain unset until agreed. */
  commissionAmountCents: int("commissionAmountCents"),
  commissionCurrency: varchar("commissionCurrency", { length: 3 }).default("HKD").notNull(),
  commissionPaidAt: timestamp("commissionPaidAt"),
  commissionReference: varchar("commissionReference", { length: 120 }),
  internalNote: text("internalNote"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [
  index("referrals_lead_idx").on(table.leadId),
  index("referrals_centre_status_idx").on(table.centreId, table.status),
  index("referrals_commission_idx").on(table.commissionStatus, table.createdAt),
]);

export type Referral = typeof referrals.$inferSelect;
export type InsertReferral = typeof referrals.$inferInsert;
