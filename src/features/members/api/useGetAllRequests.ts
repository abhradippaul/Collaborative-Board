import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";

export function useGetAllRequests() {
  const query = useQuery({
    queryKey: ["pending-requests"],
    queryFn: async () => {
      const response = await client.api.v1.invitations["all-requests"][
        "$get"
      ]();
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      return await response.json();
    },
  });
  return query;
}
