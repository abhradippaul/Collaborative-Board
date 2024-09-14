import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type RequestType = InferRequestType<typeof client.api.v1.boards.$post>["form"];

type ResponseType = InferResponseType<typeof client.api.v1.boards.$get>;

export function useCreateBoard(organization: string | string[] | undefined) {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (form) => {
      const response = await client.api.v1.boards.$post({
        query: { organization },
        form,
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards", organization] });
      toast.success("Board created successfully");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
  return mutation;
}
