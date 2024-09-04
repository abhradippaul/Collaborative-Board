import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type responseType = InferResponseType<
  typeof client.api.v1.invitations.reject.$delete
>;
type requestType = InferRequestType<
  typeof client.api.v1.invitations.reject.$delete
>["form"];

export function useRejectRequest() {
  const queryClient = useQueryClient();
  const mutation = useMutation<responseType, Error, requestType>({
    mutationFn: async (form) => {
      const response = await client.api.v1.invitations.reject.$delete({ form });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-requests"] });
      toast.success("Request rejected successfully");
    },
    onError: () => toast.error("Failed to reject the request"),
  });
  return mutation;
}
