"use client";

import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useMedia } from "react-use";
import dynamic from "next/dynamic";

const OrganizationSelect = dynamic(() => import("./OrganizationSelect"));

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

function OrgSidebar() {
  const isMobile = useMedia("(max-width:1024px)", false);
  return (
    !isMobile && (
      <div className="flex flex-col space-y-6 w-[200px] pl-5 pt-5 min-h-dvh">
        <Link href="/">
          <div className="flex items-center gap-x-2">
            <Image src="/logo.svg" alt="logo" height={60} width={60} />
            <span className={cn("font-semibold text-2xl", font.className)}>
              Board
            </span>
          </div>
        </Link>
        <OrganizationSelect />
      </div>
    )
  );
}

export default OrgSidebar;
