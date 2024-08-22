import { withAuth } from "@kinde-oss/kinde-auth-nextjs/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  return withAuth(request);
}

export const config = {
  matcher: ["/"],
};
