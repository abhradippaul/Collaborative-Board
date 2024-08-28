import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

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
      if(!response.ok) {
        throw new Error(response.statusText);
      }
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      toast.success("Organization created successfully");
    },
    onError: () => {
      toast.error("Unable to create organization");
    },
  });
  return mutation;
}
