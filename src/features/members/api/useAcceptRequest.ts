import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type requestType = InferRequestType<
  typeof client.api.v1.invitations.accept.$patch
>["form"];

type responseType = InferResponseType<
  typeof client.api.v1.invitations.accept.$patch
>;

export function useAcceptRequest() {
  const queryClient = useQueryClient();
  const mutation = useMutation<responseType, Error, requestType>({
    mutationFn: async (form) => {
      const response = await client.api.v1.invitations.accept.$patch({ form });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-requests"] });
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      toast.success("Request accepted successfully");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
  return mutation;
}
