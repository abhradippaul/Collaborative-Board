import BoardCard from "./BoardCard";
import EmptyFavorites from "./EmptyFavorites";
import EmptySearch from "./EmptySearch";

interface Props {
  orgId?: string;
  query: {
    search?: string;
    favorites?: string;
  };
  data?: {
    id?: string | null;
    name?: string | null;
    image?: string | null;
  }[];
}

function BoardList({ orgId, query, data }: Props) {
  if (!data?.length && query.search) {
    return <EmptySearch />;
  }

  if (!data?.length && query.favorites) {
    return <EmptyFavorites />;
  }

  return (
    <div>
      <h2 className="text-3xl">
        {query.favorites ? "Favorite boards" : "Team boards"}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-8 pb-10">
        {data?.map(
          ({ image, name, id }) =>
            name &&
            id && <BoardCard id={id} name={name} image={image} key={id} />
        )}
      </div>
    </div>
  );
}

export default BoardList;
