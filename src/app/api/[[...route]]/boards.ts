import { db } from "@/database";
import {
  insertOrganizationBoardsSchema,
  organizationBoards,
  organizationMembers,
  organizations,
} from "@/database/schema";
import { zValidator } from "@hono/zod-validator";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import { v4 } from "uuid";
import { z } from "zod";

const app = new Hono()
  .get(
    "/",
    zValidator(
      "query",
      z.object({
        organization: z.string().optional(),
      })
    ),
    async (c) => {
      const { getUser } = getKindeServerSession();
      const { organization } = c.req.valid("query");
      const user = await getUser();

      if (!user?.id || !user.email) {
        return c.json(
          {
            message: "User is not authenticated",
          },
          401
        );
      }

      if (!organization) {
        return c.json({ message: "Organization slug is required" }, 400);
      }

      // const isUserAndOrgExist = await db
      //   .select({
      //     organizationId: organizations.id,
      //   })
      //   .from(organizationMembers)
      //   .innerJoin(
      //     organizations,
      //     eq(organizations.id, organizationMembers.organizationId)
      //   )
      //   .where(
      //     and(
      //       eq(organizationMembers.userId, user.id),
      //       eq(organizations.slug, organization)
      //     )
      //   );

      const boards = await db
        .select({
          id: organizationBoards.id,
          name: organizationBoards.title,
        })
        .from(organizationMembers)
        .innerJoin(
          organizations,
          eq(organizations.id, organizationMembers.organizationId)
        )
        .leftJoin(
          organizationBoards,
          eq(organizationBoards.organizationId, organizations.id)
        )
        .where(
          and(
            eq(organizationMembers.userId, user.id),
            eq(organizations.slug, organization)
          )
        );

      return c.json({
        message: "Organization board found successfully",
        data: boards,
      });
    }
  )
  .post(
    "/",
    zValidator(
      "form",
      insertOrganizationBoardsSchema.pick({
        title: true,
      })
    ),
    zValidator(
      "query",
      z.object({
        organization: z.string().optional(),
      })
    ),
    async (c) => {
      const { getUser } = getKindeServerSession();
      const { title } = c.req.valid("form");
      const { organization } = c.req.valid("query");
      const user = await getUser();

      if (!user?.id || !user.email) {
        return c.json(
          {
            message: "User is not authenticated",
          },
          401
        );
      }

      if (!title || !organization) {
        return c.json(
          {
            message: "Title and organization slug are required",
          },
          400
        );
      }

      const [isUserAndOrgExist] = await db
        .select({
          organizationId: organizations.id,
        })
        .from(organizationMembers)
        .innerJoin(
          organizations,
          eq(organizations.id, organizationMembers.organizationId)
        )
        .where(
          and(
            eq(organizationMembers.userId, user.id),
            eq(organizations.slug, organization)
          )
        );

      if (!isUserAndOrgExist.organizationId) {
        return c.json(
          {
            message: "User is not a member of the organization",
          },
          403
        );
      }

      const isBoardCreated = await db
        .insert(organizationBoards)
        .values({
          id: v4().toString(),
          authorId: user.id,
          organizationId: isUserAndOrgExist.organizationId,
          title,
          isFavorite: false,
        })
        .returning();

      if (!isBoardCreated) {
        return c.json(
          {
            message: "Failed to create organization board",
          },
          500
        );
      }

      return c.json({
        message: "Organization board created successfully",
      });
    }
  );

export default app;
