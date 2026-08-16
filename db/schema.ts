import {
  boolean,
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const rates = pgTable("rates", {
  id: uuid("id").defaultRandom().primaryKey(),
  productName: text("product_name").notNull(),
  rate: numeric("rate", { precision: 5, scale: 3 }).notNull(),
  apr: numeric("apr", { precision: 5, scale: 3 }).notNull(),
  termYears: integer("term_years").notNull(),
  points: numeric("points", { precision: 4, scale: 2 }).default("0.00"),
  productType: text("product_type").notNull(), // 'conventional', 'fha', 'va', 'usda', 'jumbo', 'arm'
  isFeatured: boolean("is_featured").default(false),
  weeklyChange: numeric("weekly_change", { precision: 5, scale: 3 }).default("0.000"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const brokers = pgTable("brokers", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  nmlsId: text("nmls_id").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  licenseStates: text("license_states"),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const leads = pgTable("leads", {
  id: uuid("id").defaultRandom().primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  loanType: text("loan_type").notNull(),
  propertyValue: numeric("property_value", { precision: 12, scale: 2 }).notNull(),
  loanAmount: numeric("loan_amount", { precision: 12, scale: 2 }).notNull(),
  creditScoreTier: text("credit_score_tier").notNull(),
  propertyType: text("property_type"),
  timeline: text("timeline"),
  incomeSource: text("income_source"),
  status: text("status").default("New").notNull(),
  assignedBrokerId: uuid("assigned_broker_id").references(() => brokers.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Rate = typeof rates.$inferSelect;
export type NewRate = typeof rates.$inferInsert;
export type Broker = typeof brokers.$inferSelect;
export type NewBroker = typeof brokers.$inferInsert;
export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;

export const LEAD_STATUSES = [
  "New",
  "Contacted",
  "Application Sent",
  "Pre-Approved",
  "Closed",
  "Archived",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];
