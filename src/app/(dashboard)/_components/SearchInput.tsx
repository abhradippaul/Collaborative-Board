import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { memo, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

function SearchInput() {
  const router = useRouter();
  const debounced = useDebouncedCallback(
    (e) => (e ? router.push(`/?search=${e}`) : router.replace("/")),
    500
  );

  return (
    <div className="w-full relative">
      <Search className="absolute top-1/2 left-3 transform -translate-y-1/2 text-muted-foreground size-4" />
      <Input
        className="w-full max-w-[510px] pl-9"
        placeholder="Search boards"
        onChange={(e) => debounced(e.target.value)}
      />
    </div>
  );
}

export default memo(SearchInput);
