import { Hono } from "hono";
import { handle } from "hono/vercel";
import organizations from "./organizations";

export const runtime = "edge";

const app = new Hono().basePath("/api/v1");
const route = app.route("/organizations", organizations);

export const GET = handle(app);
export const POST = handle(app);

export type AppType = typeof route;
