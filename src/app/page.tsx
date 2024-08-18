"use client";
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export default function Home() {
  // const { getUser } = getKindeServerSession();
  // const user = await getUser();
  return (
    <div>
      Home Page
      <LoginLink>Sign in</LoginLink>
      <RegisterLink>Sign up</RegisterLink>
      {/* {user?.email && <h1>{user.email}</h1>} */}
    </div>
  );
}
