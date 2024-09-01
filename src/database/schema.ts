import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  userName: text("userName").unique(),
  email: text("email").notNull().unique(),
  image: text("image"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  organizations: many(organizations),
  organizationMembers: many(organizationMembers),
}));

export const insertUsersSchema = createInsertSchema(users);

export const organizations = pgTable("organizations", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  image: text("image"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),
  slug: text("slug").notNull(),
});

export const organizationRelations = relations(
  organizations,
  ({ one, many }) => ({
    users: one(users, {
      fields: [organizations.userId],
      references: [users.id],
    }),
    organizationMembers: many(organizationMembers),
  })
);

export const insertOrganizationSchema = createInsertSchema(organizations);

export const organizationMembers = pgTable("organization_member", {
  id: text("id").primaryKey(),
  organizationId: text("organizationId")
    .notNull()
    .references(() => organizations.id, {
      onDelete: "cascade",
    }),
  invitationEmail: text("invitationEmail")
    .notNull()
    .references(() => users.email, {
      onDelete: "cascade",
    }),
  role: text("role").notNull().default("member"),
  isAccepted: boolean("isAccepted").notNull().default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const organizationMembersRelations = relations(
  organizationMembers,
  ({ one }) => ({
    organizations: one(organizations, {
      fields: [organizationMembers.organizationId],
      references: [organizations.id],
    }),
    users: one(users, {
      fields: [organizationMembers.invitationEmail],
      references: [users.email],
    }),
  })
);

export const insertOrganizationMemberSchema =
  createInsertSchema(organizationMembers);
