import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  image: text("image").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const organizations = pgTable("organizations", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  image: text("image"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  userId: text("userId").notNull(),
  slug : text("slug").notNull(),
});

export const insertOrganizationSchema = createInsertSchema(organizations);
