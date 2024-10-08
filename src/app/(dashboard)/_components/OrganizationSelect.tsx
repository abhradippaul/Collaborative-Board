import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetOrganization } from "@/features/organizations/api/UseGetOrganization";
import { useCreateOrganizationStore } from "@/zustand/useCreateOrganizationStore/store";
import { Plus } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { memo, useState } from "react";

function OrganizationSelect() {
  const { data: organizations, isLoading } = useGetOrganization();
  const [value, setValue] = useState("");
  const openModal = useCreateOrganizationStore(
    ({ openCreateOrganization }) => openCreateOrganization
  );
  const organization = useSearchParams().get("organization");
  const navigate = useRouter();
  
  if (!organizations || !organizations.data.length) return null;
  return (
    <Select
      disabled={isLoading}
      value={organization || value}
      onValueChange={(e) => {
        setValue(e);
        navigate.push(`/?organization=${e}`);
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select Organization" />
      </SelectTrigger>
      <SelectContent className="flex items-center justify-center">
        {organizations?.data.map(({ name, slug, image }) => (
          <SelectItem value={slug} key={slug}>
            <div className="flex items-center justify-around gap-x-2">
              <img
                src={image || "/logo.svg"}
                alt={name}
                className="size-6 rounded-full object-cover"
              />{" "}
              {name}
            </div>
          </SelectItem>
        ))}
        <Button
          size="sm"
          variant="outline"
          className="border-none mx-auto flex items-center justify-center w-full"
          onClick={openModal}
        >
          <Plus className="mr-2 size-4" />
          Create Organization
        </Button>
      </SelectContent>
    </Select>
  );
}

export default memo(OrganizationSelect);
