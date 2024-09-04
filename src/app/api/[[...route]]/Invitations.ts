import { db } from "@/database";
import {
  organizationMemberRequests,
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
      z.object({
        receiver: z.string().email(),
        organizationSlug: z.string(),
        role: z.string(),
      })
    ),
    async (c) => {
      try {
        const { getUser } = getKindeServerSession();
        const user = await getUser();
        const {
          organizationSlug,
          receiver,
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

        if (!organizationSlug || !receiver) {
          return c.json(
            {
              message: "Organization ID and receiver email are required",
            },
            400
          );
        }

        if (user.email === receiver) {
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
          .where(and(eq(users.id, user.id), eq(users.email, user.email)));

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
          .where(eq(users.email, receiver));

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
              eq(organizationMembers.userId, isMemberExist[0].id),
              eq(organizationMembers.organizationId, isOrganizationExist[0].id)
            )
          );

        if (isAlreadyMember.length) {
          return c.json(
            {
              message: "User is already a member of the organization",
            },
            409
          );
        }

        const isAlreadySendRequest = await db
          .select({ id: organizationMemberRequests.id })
          .from(organizationMemberRequests)
          .where(
            and(
              eq(
                organizationMemberRequests.organizationId,
                isOrganizationExist[0].id
              ),
              eq(organizationMemberRequests.receiver, isMemberExist[0].id)
            )
          );

        if (isAlreadySendRequest.length) {
          return c.json(
            {
              message: "User already recevied invitation",
            },
            409
          );
        }

        const isInvitationSend = await db
          .insert(organizationMemberRequests)
          .values({
            id: v4().toString(),
            role,
            organizationId: isOrganizationExist[0].id,
            receiver: isMemberExist[0].id,
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
        id: organizationMemberRequests.id,
        slug: organizations.slug,
        image: organizations.image,
        name: organizations.name,
      })
      .from(users)
      .leftJoin(
        organizationMemberRequests,
        eq(organizationMemberRequests.receiver, users.id)
      )
      .leftJoin(
        organizations,
        eq(organizations.id, organizationMemberRequests.organizationId)
      )
      .where(and(eq(users.id, user.id), eq(users.email, user.email)));

    if (!pendingRequests[0].id || !pendingRequests[0].slug) {
      return c.json({
        message: "No pending requests found",
        pendingRequests: [],
      });
    }

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
        .select({
          organizationMemberRequestId: organizationMemberRequests.id,
          userId: users.id,
          organizationId: organizations.id,
          role: organizationMemberRequests.role,
        })
        .from(users)
        .leftJoin(
          organizationMemberRequests,
          eq(organizationMemberRequests.receiver, users.id)
        )
        .leftJoin(
          organizations,
          eq(organizations.id, organizationMemberRequests.organizationId)
        )
        .where(and(eq(users.id, user.id), eq(users.email, user.email)));

      if (
        !isRequestExist[0].userId ||
        !isRequestExist[0].organizationId ||
        !isRequestExist[0].role ||
        !isRequestExist[0].organizationMemberRequestId
      ) {
        return c.json(
          {
            message: "Request does not exist",
          },
          404
        );
      }

      const isRequestAccepted = await db.insert(organizationMembers).values({
        id: v4().toString(),
        role: isRequestExist[0].role,
        userId: isRequestExist[0].userId,
        organizationId: isRequestExist[0].organizationId,
      });

      if (!isRequestAccepted) {
        return c.json(
          {
            message: "Failed to accept request",
          },
          500
        );
      }

      const isRequestDeleted = await db
        .delete(organizationMemberRequests)
        .where(
          eq(
            organizationMemberRequests.id,
            isRequestExist[0].organizationMemberRequestId
          )
        );

      if (!isRequestDeleted) {
        return c.json(
          {
            message: "Failed to delete request",
          },
          500
        );
      }

      return c.json({
        message: "Accept request successfully",
      });
    }
  )
  .delete(
    "/reject",
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
        .select({
          organizationMemberRequestId: organizationMemberRequests.id,
        })
        .from(users)
        .leftJoin(
          organizationMemberRequests,
          eq(organizationMemberRequests.receiver, users.id)
        )
        .leftJoin(
          organizations,
          eq(organizations.id, organizationMemberRequests.organizationId)
        )
        .where(and(eq(users.id, user.id), eq(users.email, user.email)));

      if (!isRequestExist[0].organizationMemberRequestId) {
        return c.json(
          {
            message: "Request does not exist",
          },
          404
        );
      }

      const isRequestRejected = await db
        .delete(organizationMemberRequests)
        .where(
          eq(
            organizationMemberRequests.id,
            isRequestExist[0].organizationMemberRequestId
          )
        );

      if (!isRequestRejected) {
        return c.json(
          {
            message: "Failed to reject request",
          },
          500
        );
      }

      return c.json({
        message: "Request rejected successfully",
      });
    }
  );

export default app;
