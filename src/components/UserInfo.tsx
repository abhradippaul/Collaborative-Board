import { LogOut } from "lucide-react";
import CustomTooltip from "./CustomTooltip";
import { memo } from "react";
import Image from "next/image";

interface Props {
  name: string;
  avatar?: string;
}

function UserInfo({ name, avatar }: Props) {
  return (
    <div className="flex gap-x-4 items-center justify-center">
      <CustomTooltip
        trigger={
          <Image
            src={"/logo.svg"}
            alt="user profile"
            className="object-cover rounded-full overflow-hidden"
            width={40}
            height={40}
          />
        }
        content={name}
      />
      <LogOut className="size-6 cursor-pointer" />
    </div>
  );
}

export default memo(UserInfo);
