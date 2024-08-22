"use client";

import UserInfo from "@/components/UserInfo";

interface Props {
  User_Info: {
    name: string;
    avatar?: string;
  };
}

function Navbar({ User_Info }: Props) {
  return (
    <nav className="flex items-center gap-x-4 p-5 bg-green-500">
      <div className="hidden lg:flex lg:flex-1">

      </div>
      <UserInfo name={User_Info.name} avatar={User_Info.avatar} />
      Navbar
    </nav>
  );
}

export default Navbar;
