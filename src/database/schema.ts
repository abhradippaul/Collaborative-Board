import { relations } from "drizzle-orm";
import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  userName: text("userName").unique(),
  email: text("email").notNull().unique(),
  image: text("image"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const usersRelation = relations(users, ({ many }) => ({
  organizations: many(organizations),
  organizationMemberRequests: many(organizationMemberRequests),
  organizationMembers: many(organizationMembers),
  organizationBoards: many(organizationBoards),
}));

export const insertUsersSchema = createInsertSchema(users);

export const organizations = pgTable("organizations", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  image: text("image"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  slug: text("slug").notNull().unique(),
});

export const organizationsRelation = relations(organizations, ({ many }) => ({
  organizationMembers: many(organizationMembers),
  organizationMemberRequests: many(organizationMemberRequests),
  organizationBoards: many(organizationBoards),
}));

export const insertOrganizationsSchema = createInsertSchema(organizations);

export const organizationMembers = pgTable("organization_member", {
  id: text("id").primaryKey(),
  organizationId: text("organizationId")
    .notNull()
    .references(() => organizations.id, {
      onDelete: "cascade",
    }),
  userId: text("userId")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),
  role: text("role").notNull().default("member"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const organizationMembersRelation = relations(
  organizationMembers,
  ({ one }) => ({
    organizations: one(organizations, {
      fields: [organizationMembers.organizationId],
      references: [organizations.id],
    }),
    users: one(users, {
      fields: [organizationMembers.userId],
      references: [users.id],
    }),
  })
);

export const insertOrganizationMembersSchema =
  createInsertSchema(organizationMembers);

export const organizationMemberRequests = pgTable(
  "organization_member_requests",
  {
    id: text("id").primaryKey(),
    organizationId: text("organizationId")
      .notNull()
      .references(() => organizations.id, {
        onDelete: "cascade",
      }),
    receiver: text("receiver")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),
    role: text("role").notNull().default("member"),
  }
);

export const organizationMemberRequestsRelation = relations(
  organizationMemberRequests,
  ({ one }) => ({
    organizations: one(organizations, {
      fields: [organizationMemberRequests.organizationId],
      references: [organizations.id],
    }),
    users: one(users, {
      fields: [organizationMemberRequests.receiver],
      references: [users.id],
    }),
  })
);

export const insertOrganizationMemberRequestsSchema = createInsertSchema(
  organizationMemberRequests
);

export const organizationBoards = pgTable("organization_board", {
  id: text("id").primaryKey(),
  organizationId: text("organizationId")
    .notNull()
    .references(() => organizations.id, {
      onDelete: "cascade",
    }),
  title: text("title").notNull(),
  authorId: text("authorId")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),
  isFavorite: boolean("isFavorite").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const organizationBoardRelation = relations(
  organizationBoards,
  ({ one }) => ({
    users: one(users, {
      fields: [organizationBoards.authorId],
      references: [users.id],
    }),
    organizations: one(organizations, {
      fields: [organizationBoards.organizationId],
      references: [organizations.id],
    }),
  })
);

export const insertOrganizationBoardsSchema = createInsertSchema(organizationBoards);