import Image from "next/image";
import CreateOrganization from "@/features/organizations/components/CreateOrganization";

function EmptyOrg() {
  return (
    <div className="min-h-[85dvh] flex flex-col items-center justify-center">
      <Image src="/logo.svg" alt="Empty" height={200} width={200} />
      <h2 className="text-2xl font-semibold mt-6">Welcome to Board</h2>
      <p className="text-muted-foreground text-sm mt-2">
        Create an organization to get started
      </p>
      <div className="mt-6">
        <CreateOrganization buttonText="Create Organization" />
      </div>
    </div>
  );
}

export default EmptyOrg;
