import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { insertOrganizationSchema, organizations } from "@/database/schema";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { db } from "@/database";
import { v4 } from "uuid";

const app = new Hono()
  .get("/", (c) => {
    return c.json({
      message: "Welcome to the Hono API",
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
      const { name, slug } = c.req.valid("form");
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

      const isCreated = await db.insert(organizations).values({
        name,
        userId: user.id,
        id: v4().toString(),
        slug,
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
