import { ReactNode } from "react";
import Sidebar from "./_components/sidebar/Index";
import OrgSidebar from "./_components/OrgSidebar";
import Navbar from "./_components/Navbar";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

async function layout({ children }: { children: ReactNode }) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  return (
    <main className="h-full">
      <Sidebar />
      <div className="pl-[60px] h-full">
        <div className="flex gap-x-3 h-full">
          <OrgSidebar />
          <div className="h-full flex-1">
            <Navbar
              User_Info={{
                avatar: user?.picture || "",
                name: `${user?.given_name} ${user?.family_name}`,
              }}
            />
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}

export default layout;
