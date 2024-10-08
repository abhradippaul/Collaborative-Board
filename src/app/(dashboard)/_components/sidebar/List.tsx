"use client";

import CustomTooltip from "@/components/CustomTooltip";
import { useGetOrganization } from "@/features/organizations/api/UseGetOrganization";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

function List() {
  const { data: organizations } = useGetOrganization();
  const param = useSearchParams().get("organization");

  if (!organizations || !organizations.data) return null;

  return (
    <ul className="space-y-4">
      {organizations.data.map(({ name, slug, image }) => (
        <li key={slug}>
          <CustomTooltip
            sideOffset={10}
            content={name}
            trigger={
              <Link href={`/?organization=${slug}`}>
                <img
                  src={image || "/logo.svg"}
                  alt={name}
                  className={cn(
                    "size-10 rounded-full cursor-pointer opacity-75 hover:opacity-100 transition",
                    param === slug && "opacity-100"
                  )}
                />
              </Link>
            }
            side="right"
          />
        </li>
      ))}
    </ul>
  );
}

export default List;
