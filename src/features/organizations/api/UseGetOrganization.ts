import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export function useGetOrganization() {
  const query = useQuery({
    queryKey: ["organizations"],
    queryFn: async () => {
      const response = await client.api.v1.organizations.$get();
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return await response.json();
    },
  });
  return query;
}
