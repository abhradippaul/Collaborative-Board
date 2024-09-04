import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, EllipsisVertical, Loader2, Trash } from "lucide-react";
import { useGetAllRequests } from "@/features/members/api/useGetAllRequests";
import { memo, useCallback } from "react";
import { useAcceptRequest } from "../api/useAcceptRequest";
import { useRejectRequest } from "../api/useRejectRequest";

function EachOrgRequest() {
  const { data, isPending } = useGetAllRequests();
  const acceptRequest = useAcceptRequest();
  const rejectRequest = useRejectRequest();

  const handleAccept = useCallback((slug: string) => {
    acceptRequest.mutate({ slug });
  }, []);

  const handleReject = useCallback((slug: string) => {
    rejectRequest.mutate({ slug });
  }, []);

  if (isPending) {
    return (
      <div className="w-full min-h-[50px] flex items-center justify-center">
        <Loader2 className="size-12 animate-spin" />
      </div>
    );
  }

  if (!data?.pendingRequests.length) {
    return <h1>You don't have any pending requests</h1>;
  }

  return data.pendingRequests.map(
    ({ id, image, name, slug }) =>
      id &&
      slug && (
        <div
          key={id}
          className="w-full border flex items-center justify-around gap-x-10 p-2 rounded-lg"
        >
          <img
            src={image || "/logo.svg"}
            alt={image || "/logo.svg"}
            className="size-10 rounded-full object-cover"
          />
          <h1>{name}</h1>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <EllipsisVertical className="size-4 cursor-pointer text-zinc-700 hover:text-black" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                className="flex items-center justify-around"
                onClick={() => handleAccept(slug)}
                disabled={acceptRequest.isPending || rejectRequest.isPending}
              >
                <Check className="text-green-500 size-4" />
                Accept
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center justify-around"
                onClick={() => handleReject(slug)}
                disabled={acceptRequest.isPending || rejectRequest.isPending}
              >
                <Trash className="text-rose-500 size-4" />
                Reject
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
  );
}

export default memo(EachOrgRequest);
