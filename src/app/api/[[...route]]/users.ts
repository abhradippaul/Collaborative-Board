import { db } from "@/database";
import { users } from "@/database/schema";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";

const app = new Hono().post("/", async (c) => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user?.id || !user.email || !user.given_name || !user.family_name) {
    return c.json(
      { message: "User is not authenticated or missing required information" },
      401
    );
  }

  const isUserAlreadyExist = await db
    .select({ id: users.id })
    .from(users)
    .where(and(eq(users.email, user.email), eq(users.id, user.id)));

  if (isUserAlreadyExist.length) {
    return c.json({ message: "User already exists" });
  }

  const isUserCreated = await db.insert(users).values({
    id: user.id,
    name: `${user.given_name} ${user.family_name}`,
    email: user.email,
    image: user.picture,
  });

  if (!isUserCreated) {
    return c.json({ message: "Failed to create user" }, 500);
  }

  return c.json({
    message: "User created successfully",
  });
});

export default app;
