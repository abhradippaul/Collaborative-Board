import { useGetBoards } from "@/features/boards/api/useGetBoard";
import { Loader2 } from "lucide-react";
import BoardList from "./_components/BoardList";
import EmptyOrg from "./_components/EmptyOrg";

interface Props {
  searchParams: {
    search?: string;
    favorites?: string;
    organization?: string;
  };
}

function ParamsPage({ searchParams }: Props) {
  const { data, isLoading } = useGetBoards(searchParams.organization);
  console.log(data);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[88dvh] p-6">
        <Loader2 className="size-12 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-[9dvh] p-6">
      {data?.data.length ? <BoardList query={searchParams} data={data.data}/> : <EmptyOrg />}
    </div>
  );
}

export default ParamsPage;
