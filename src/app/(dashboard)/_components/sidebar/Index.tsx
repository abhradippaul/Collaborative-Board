import dynamic from "next/dynamic";

const CreateOrganization = dynamic(() => import("./CreateOrganization"));

function Sidebar() {
  return (
    <aside className="fixed z-[1] left-0 bg-blue-950 h-full w-[60px] flex flex-col gap-y-4 text-white items-center py-4">
      <CreateOrganization />
      Sidebar
    </aside>
  );
}

export default Sidebar;