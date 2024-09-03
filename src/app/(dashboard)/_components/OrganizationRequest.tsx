import dynamic from "next/dynamic";
import { memo } from "react";
import { Button } from "@/components/ui/button";
import { Handshake } from "lucide-react";

const EachOrgRequest = dynamic(() => import("../../../features/members/components/EachOrgRequest"));
const CustomDialog = dynamic(() => import("@/components/CustomDialog"));

function OrganizationRequest() {
  return (
    <CustomDialog
      title="Pending requests"
      description="Accept or reject requests"
      trigger={
        <Button
          variant="ghost"
          size="lg"
          className="font-normal justify-around px-2 w-full"
        >
          <Handshake className="size-4 mr-2" />
          Request
        </Button>
      }
    >
      <EachOrgRequest />
    </CustomDialog>
  );
}

export default memo(OrganizationRequest);
