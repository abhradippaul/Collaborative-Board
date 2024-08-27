import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export async function useGetOrganization() {
  const query = useQuery({
    queryKey: ["organizations"],
    queryFn: async () => {
      const response = await client.api.v1.organizations.$get();
      const data = await response.json();
      return data;
    },
  });
  return query;
}
