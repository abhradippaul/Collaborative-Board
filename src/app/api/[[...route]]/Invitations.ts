import { db } from "@/database";
import {
  insertOrganizationMemberSchema,
  organizationMembers,
  organizations,
  users,
} from "@/database/schema";
import { zValidator } from "@hono/zod-validator";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import { v4 } from "uuid";
import { z } from "zod";

const app = new Hono()
  .post(
    "/send",
    zValidator(
      "form",
      insertOrganizationMemberSchema.pick({
        organizationSlug: true,
        invitationEmail: true,
        role: true,
      })
    ),
    async (c) => {
      try {
        const { getUser } = getKindeServerSession();
        const user = await getUser();
        const {
          organizationSlug,
          invitationEmail,
          role = "member",
        } = c.req.valid("form");

        if (!user?.id || !user.email) {
          return c.json(
            {
              message: "User is not authenticated",
            },
            401
          );
        }

        if (!organizationSlug || !invitationEmail) {
          return c.json(
            {
              message: "Organization ID and invitation email are required",
            },
            400
          );
        }

        if (user.email === invitationEmail) {
          return c.json(
            {
              message: "Invitation sender cannot invite themselves",
            },
            400
          );
        }

        const isInvitationSenderExist = await db
          .select({
            id: users.id,
          })
          .from(users)
          .where(eq(users.id, user.id));

        if (!isInvitationSenderExist.length) {
          return c.json(
            {
              message: "User is not authenticated",
            },
            401
          );
        }

        const isOrganizationExist = await db
          .select({ id: organizations.id })
          .from(organizations)
          .where(eq(organizations.slug, organizationSlug));

        if (!isOrganizationExist.length) {
          return c.json(
            {
              message: "Organization does not exist",
            },
            404
          );
        }

        const isMemberExist = await db
          .select({ id: users.id })
          .from(users)
          .where(eq(users.email, invitationEmail));

        if (!isMemberExist.length) {
          return c.json(
            {
              message: "User does not exist",
            },
            409
          );
        }

        const isAlreadyMember = await db
          .select({ id: organizationMembers.id })
          .from(organizationMembers)
          .where(
            and(
              eq(organizationMembers.organizationSlug, organizationSlug),
              eq(organizationMembers.invitationEmail, invitationEmail)
            )
          );

        if (isAlreadyMember.length) {
          return c.json(
            {
              message:
                "User is already a member of the organization or already send invitation",
            },
            409
          );
        }

        const isInvitationSend = await db.insert(organizationMembers).values({
          id: v4().toString(),
          organizationSlug,
          invitationEmail,
          role,
        });

        if (!isInvitationSend) {
          return c.json(
            {
              message: "Failed to send invitation",
            },
            500
          );
        }

        return c.json({
          message: "Invitation send successfully",
        });
      } catch (err: any) {
        console.log(err);
        return c.json(
          {
            message: "Internal Server Error " + err.message,
          },
          500
        );
      }
    }
  )
  .get("/all-requests", async (c) => {
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

    const pendingRequests = await db
      .select({
        id: organizationMembers.id,
        slug: organizationMembers.organizationSlug,
        image: organizations.image,
        name: organizations.name,
      })
      .from(users)
      .innerJoin(
        organizationMembers,
        eq(organizationMembers.invitationEmail, users.email)
      )
      .innerJoin(
        organizations,
        eq(organizations.slug, organizationMembers.organizationSlug)
      )
      .where(
        and(
          eq(users.id, user.id),
          eq(users.email, user.email),
          eq(organizationMembers.isAccepted, false)
        )
      );

    return c.json({
      message: "Pending requests received successfully",
      pendingRequests,
    });
  })
  .patch(
    "/accept",
    zValidator(
      "form",
      z.object({
        slug: z.string().optional(),
      })
    ),
    async (c) => {
      const { getUser } = getKindeServerSession();
      const user = await getUser();
      const { slug } = c.req.valid("form");

      if (!user?.id || !user.email) {
        return c.json(
          {
            message: "User is not authenticated",
          },
          401
        );
      }

      if (!slug) {
        return c.json(
          {
            message: "Organization slug is required",
          },
          400
        );
      }

      const isRequestExist = await db
        .select({ id: organizationMembers.id })
        .from(organizationMembers)
        .where(
          and(
            eq(organizationMembers.invitationEmail, user.email),
            eq(organizationMembers.organizationSlug, slug),
            eq(organizationMembers.isAccepted, false)
          )
        );

      if (!isRequestExist.length) {
        return c.json(
          {
            message: "Request does not exist",
          },
          404
        );
      }

      const isRequestAccepted = await db
        .update(organizationMembers)
        .set({
          isAccepted: true,
        })
        .where(eq(organizationMembers.id, isRequestExist[0].id));

      if (!isRequestAccepted) {
        return c.json(
          {
            message: "Failed to accept request",
          },
          500
        );
      }

      return c.json({
        message: "Accept request successfully",
      });
    }
  );

export default app;
