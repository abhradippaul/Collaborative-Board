import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { InferRequestType, InferResponseType } from "hono";

type ResponseType = InferResponseType<typeof client.api.v1.organizations.$post>;
type RequestType = InferRequestType<
  typeof client.api.v1.organizations.$post
>["form"];

export function useCreateOrganization() {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (formData) => {
      const response = await client.api.v1.organizations.$post({
        form: formData,
      });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
  });
  return mutation;
}
