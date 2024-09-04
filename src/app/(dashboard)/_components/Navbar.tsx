"use client";

import UserInfo from "@/components/UserInfo";
import { useEffect, useState } from "react";
import { useMedia } from "react-use";
import SearchInput from "./SearchInput";
import OrganizationSelect from "./OrganizationSelect";
import InviteOrganization from "@/features/members/components/InviteOrganization";
import { useSearchParams } from "next/navigation";

interface Props {
  User_Info: {
    name: string;
    avatar?: string;
  };
}

function Navbar({ User_Info }: Props) {
  const isMobile = useMedia("(max-width:1024px", false);
  const [isMounted, setIsMounted] = useState(false);
  const searchParams = useSearchParams();
  const organizationSlug = searchParams.get("organization");

  useEffect(() => {
    setIsMounted(true);
  }, []);
  return (
    <nav className="flex items-center gap-x-4 p-5">
      {!isMobile && isMounted && (
        <div className="flex flex-1">
          <SearchInput />
        </div>
      )}
      {isMobile && isMounted && (
        <div className="flex-1">
          <div className="flex items-center justify-between w-full">
            <OrganizationSelect />
            {organizationSlug && (
              <div className="max-w-[300px] border rounded-lg overflow-hidden">
                <InviteOrganization organizationSlug={organizationSlug} />
              </div>
            )}
          </div>
        </div>
      )}
      <UserInfo name={User_Info.name} avatar={User_Info.avatar} />
      Navbar
    </nav>
  );
}

export default Navbar;
