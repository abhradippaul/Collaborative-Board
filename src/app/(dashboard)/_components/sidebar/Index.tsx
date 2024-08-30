import dynamic from "next/dynamic";
import List from "./List";

const CreateOrganization = dynamic(
  () => import("@/features/organizations/components/CreateOrganization")
);

function Sidebar() {
  return (
    <aside className="fixed z-[1] left-0 bg-blue-950 h-full w-[60px] flex flex-col gap-y-4 text-white items-center py-4">
      <CreateOrganization />
      <List />
    </aside>
  );
}

export default Sidebar;
