import { client } from "@/lib/hono";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type RequestType = InferRequestType<typeof client.api.v1.users.$post>;
type ResponseType = InferResponseType<typeof client.api.v1.users.$post>["message"];

export function useCreateUser() {
  const mutation = useMutation<RequestType, Error, ResponseType>({
    mutationFn: async () => {
      const response = await client.api.v1.users.$post();
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      return await response.json();
    },
  });
  return mutation;
}
