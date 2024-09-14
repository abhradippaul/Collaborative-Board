import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  typeof client.api.v1.organizations.$patch
>;
type RequestType = InferRequestType<
  typeof client.api.v1.organizations.$patch
>["form"];

export function useUpdateOrganization() {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (form) => {
      const response = await client.api.v1.organizations.$patch({ form });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      toast.success("Organization updated successfully");
    },
    onError: (err) => toast.error(err.message),
  });
  return mutation;
}
