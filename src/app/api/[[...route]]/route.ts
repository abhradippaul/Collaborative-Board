import { Hono } from "hono";
import { handle } from "hono/vercel";
import organizations from "./organizations";
import users from "./users";
import invitations from "./Invitations";
import boards from "./boards";

export const runtime = "edge";

const app = new Hono().basePath("/api/v1");
const route = app
  .route("/users", users)
  .route("/organizations", organizations)
  .route("/invitations", invitations)
  .route("/boards", boards);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof route;
