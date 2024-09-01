"use client";

import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useMedia } from "react-use";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Share, Star } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import InviteOrganization from "./InviteOrganization";

const OrganizationSelect = dynamic(() => import("./OrganizationSelect"));

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

function OrgSidebar() {
  const isMobile = useMedia("(max-width:1024px)", false);
  const [isMounted, setIsMounted] = useState(false);
  const searchParams = useSearchParams();
  const favorites = searchParams.get("favorites");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    !isMobile &&
    isMounted && (
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
        <div className="space-y-1 w-full">
          <Button
            variant={favorites ? "ghost" : "secondary"}
            asChild
            size="lg"
            className="font-normal justify-around px-2 w-full"
          >
            <Link href="/">
              <LayoutDashboard className="size-4 mr-2" />
              Team boards
            </Link>
          </Button>

          <Button
            variant={favorites ? "secondary" : "ghost"}
            asChild
            size="lg"
            className="font-normal justify-around px-2 w-full"
          >
            <Link href={`/?favorites=true`}>
              <Star className="size-4 mr-2" />
              Favorite boards
            </Link>
          </Button>
          <Separator />
          <InviteOrganization />
          {/* <Button
            variant="ghost"
            size="lg"
            className="font-normal justify-around px-2 w-full"
          >
            <Share className="size-4 mr-2" />
            Invite
          </Button> */}
        </div>
      </div>
    )
  );
}

export default OrgSidebar;
