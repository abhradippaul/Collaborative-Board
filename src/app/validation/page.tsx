"use client";

import { Button } from "@/components/ui/button";
import { useCreateUser } from "@/features/users/api/UseCreateUser";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

function ValidationPage() {
  const { mutate, isPending } = useCreateUser();
  const navigate = useRouter();

  return (
    <div className="min-h-dvh w-full flex items-center justify-center flex-col gap-y-4">
      <h1 className="font-bold text-4xl text-zinc-700">
        Validation process is going on
      </h1>
      <h2 className="font-semibold text-2xl text-zinc-700">
        Please wait some time
      </h2>
      <Button
        size="lg"
        variant="custom"
        disabled={isPending}
        className="max-w-[300px] w-full text-xl"
        onClick={() => {
          mutate("123", {
            onSuccess: () => {
              navigate.replace("/");
            },
            onError: (err) => {
              console.error(err);
            },
          });
          console.log("Running use effect");
        }}
      >
        {isPending && <Loader2 className="size-8 animate-spin mr-2" />}
        Validate
      </Button>
    </div>
  );
}

export default ValidationPage;
