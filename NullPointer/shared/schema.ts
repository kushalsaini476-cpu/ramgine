import { sql } from "drizzle-orm";
import { pgTable, text, varchar, json, timestamp, integer, index, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  businessName: text("business_name").notNull(),
  industry: text("industry").notNull(),
  services: json("services").$type<string[]>().notNull(),
  contactEmail: text("contact_email").notNull(),
  contactPhone: text("contact_phone").default(""),
  address: text("address").default(""),
  city: text("city").default(""),
  state: text("state").default(""),
  description: text("description").default(""),
  targetAudience: text("target_audience").default(""),
  colorScheme: text("color_scheme").default("warm"),
  contentTone: text("content_tone").default("professional"),
  status: text("status").notNull().default("pending"), // pending, generating, completed, published
  generatedContent: json("generated_content").$type<{
    headline?: string;
    about?: string;
    services?: Array<{name: string; description: string}>;
    metaTitle?: string;
    metaDescription?: string;
  }>(),
  generatedImages: json("generated_images").$type<string[]>(),
  websiteHtml: text("website_html"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
  generatedContent: true,
  generatedImages: true,
  websiteHtml: true,
});

export const updateProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
}).partial();

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type UpdateProject = z.infer<typeof updateProjectSchema>;
export type Project = typeof projects.$inferSelect;
