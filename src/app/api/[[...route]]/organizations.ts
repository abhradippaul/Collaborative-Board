import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { insertOrganizationSchema, organizations } from "@/database/schema";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { db } from "@/database";
import { v4 } from "uuid";
import { eq, or } from "drizzle-orm";

const app = new Hono()
  .get("/", async (c) => {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    if (!user?.id) {
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
      .from(organizations)
      .where(eq(organizations.userId, user.id));

    return c.json({
      message: "Organization found successfully",
      data,
    });
  })
  .post(
    "/",
    zValidator(
      "form",
      insertOrganizationSchema.omit({
        id: true,
        userId: true,
      })
    ),
    async (c) => {
      const { getUser } = getKindeServerSession();
      const user = await getUser();
      const { name, slug, image } = c.req.valid("form");
      if (!user?.id) {
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

      const isAlreadyExist = await db
        .select({
          id: organizations.id,
        })
        .from(organizations)
        .where(or(eq(organizations.slug, slug)));

      if (isAlreadyExist.length) {
        return c.json(
          {
            message: "Organization already exists",
          },
          409
        );
      }

      const isCreated = await db.insert(organizations).values({
        name,
        userId: user.id,
        id: v4().toString(),
        slug,
        image,
      });

      if (!isCreated) {
        return c.json(
          {
            message: "Failed to create organization",
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
