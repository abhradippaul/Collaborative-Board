import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";

export function useGetBoards(organization: string | string[] | undefined) {
  const query = useQuery({
    queryKey: ["boards", organization],
    queryFn: async () => {
      const response = await client.api.v1.boards.$get({
        query: { organization },
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      return await response.json();
    },
  });
  return query;
}
