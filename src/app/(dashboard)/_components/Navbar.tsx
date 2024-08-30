"use client";

import UserInfo from "@/components/UserInfo";
import { useMedia } from "react-use";

interface Props {
  User_Info: {
    name: string;
    avatar?: string;
  };
}

function Navbar({ User_Info }: Props) {
  const isMobile = useMedia("(max-width:1024px", false);
  return (
    <nav className="flex items-center gap-x-4 p-5 bg-green-500">
      {!isMobile && <div className="flex flex-1 bg-yellow-500">Search</div>}
      <UserInfo name={User_Info.name} avatar={User_Info.avatar} />
      Navbar
    </nav>
  );
}

export default Navbar;
