import { client } from "@/lib/hono";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  typeof client.api.v1.invitations.send.$post
>;
type RequestType = InferRequestType<
  typeof client.api.v1.invitations.send.$post
>["form"];

export function useSendInvitation() {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (formData) => {
      const response = await client.api.v1.invitations.send.$post({
        form: formData,
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Invitation sent successfully");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
  return mutation;
}
