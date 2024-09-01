import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
  const { isAuthenticated } = getKindeServerSession();
  const isUserAuthenticated = await isAuthenticated();
  if (isUserAuthenticated) {
    return NextResponse.next();
  } else {
    return NextResponse.redirect(
      new URL("/api/auth/login?post_login_redirect_url=/validation", req.url)
    );
  }
}
export const config = {
  matcher: ["/","/validation"],
};
