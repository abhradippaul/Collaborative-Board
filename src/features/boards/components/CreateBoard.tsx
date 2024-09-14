"use client";

import CustomDialog from "@/components/CustomDialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { insertOrganizationBoardsSchema } from "@/database/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCreateBoard } from "../api/useCreateBoard";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

const formSchema = insertOrganizationBoardsSchema.pick({
  title: true,
});

function CreateBoard() {
  const organization = useSearchParams().get("organization") || "";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const createBoard = useCreateBoard(organization);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const onSubmit = useCallback((values: z.infer<typeof formSchema>) => {
    if (organization) {
      createBoard.mutate(values, {
        onSuccess: () => {
          form.reset();
          setIsModalOpen(false);
        },
      });
    }
  }, []);

  return (
    <CustomDialog
      trigger={<Button size="lg">Create Board</Button>}
      title="Create Board"
      description="Create board to use board"
      isOpen={isModalOpen}
      setIsOpen={() => setIsModalOpen((prev) => !prev)}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Board name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter board name" {...field} required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            variant="custom"
            disabled={createBoard.isPending}
          >
            {createBoard.isPending && (
              <Loader2 className="size-6 mr-2 animate-spin" />
            )}
            Submit
          </Button>
        </form>
      </Form>
    </CustomDialog>
  );
}

export default CreateBoard;
