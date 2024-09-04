import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  insertOrganizationsSchema,
  organizationMembers,
  organizations,
  users,
} from "@/database/schema";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { db } from "@/database";
import { v4 } from "uuid";
import { and, eq } from "drizzle-orm";

const app = new Hono()
  .get("/", async (c) => {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    if (!user?.id || !user.email) {
      return c.json(
        {
          message: "User is not authenticated",
        },
        401
      );
    }

    const data = await db
      .select({
        slug: organizations.slug,
        name: organizations.name,
        image: organizations.image,
      })
      .from(users)
      .innerJoin(organizationMembers, eq(organizationMembers.userId, user.id))
      .innerJoin(
        organizations,
        eq(organizations.id, organizationMembers.organizationId)
      )
      .where(and(eq(users.email, user.email), eq(users.id, user.id)));

    return c.json({
      message: "Organization found successfully",
      data,
    });
  })
  .post(
    "/",
    zValidator(
      "form",
      insertOrganizationsSchema.omit({
        id: true,
        createdAt: true,
      })
    ),
    async (c) => {
      const { getUser } = getKindeServerSession();
      const user = await getUser();
      const { name, slug, image } = c.req.valid("form");

      if (!user?.id || !user.email) {
        return c.json(
          {
            message: "User is not authenticated",
          },
          401
        );
      }

      if (!name || !slug) {
        return c.json(
          {
            message: "Name and slug are required",
          },
          400
        );
      }

      const isUserExist = await db
        .select({
          id: users.id,
        })
        .from(users)
        .where(and(eq(users.email, user.email), eq(users.id, user.id)));

      if (!isUserExist.length) {
        return c.json(
          {
            message: "User does not exist",
          },
          404
        );
      }

      const isOrgAlreadyExist = await db
        .select({
          id: organizations.id,
        })
        .from(organizationMembers)
        .innerJoin(
          organizations,
          eq(organizations.id, organizationMembers.organizationId)
        )
        .where(eq(organizations.slug, slug));

      if (isOrgAlreadyExist.length) {
        return c.json(
          {
            message: "Organization already exists",
          },
          409
        );
      }

      const isOrgCreated = await db
        .insert(organizations)
        .values({
          name,
          id: v4().toString(),
          slug,
          image,
        })
        .returning();

      if (!isOrgCreated.length) {
        return c.json(
          {
            message: "Failed to create organization",
          },
          500
        );
      }

      const isJoinedToOrg = await db.insert(organizationMembers).values({
        id: v4().toString(),
        role: "admin",
        userId: user.id,
        organizationId: isOrgCreated[0].id,
      });

      if (!isJoinedToOrg) {
        return c.json(
          {
            message: "Failed to join to organization",
          },
          500
        );
      }

      return c.json({
        message: "Organization created successfully",
      });
    }
  );

export default app;
