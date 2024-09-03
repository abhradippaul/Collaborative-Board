import { Hono } from "hono";
import { handle } from "hono/vercel";
import organizations from "./organizations";
import users from "./users";
import invitations from "./Invitations";

export const runtime = "edge";

const app = new Hono().basePath("/api/v1");
const route = app
  .route("/organizations", organizations)
  .route("/users", users)
  .route("/invitations", invitations);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);

export type AppType = typeof route;
