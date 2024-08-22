"use client";

import CustomDialog from "@/components/CustomDialog";
import { Plus } from "lucide-react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useCallback } from "react";
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

const formSchema = z.object({
  name: z.string().min(2).max(50),
  slug: z.string().min(2).max(50),
});

function CreateOrganization() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  const onSubmit = useCallback((values: z.infer<typeof formSchema>) => {
    console.log(values);
  }, []);

  return (
    <CustomDialog
      trigger={
        <div className="size-10">
          <button
            className="bg-white/25 size-full rounded-md flex items-center justify-center opacity-60 hover:opacity-100
         transition"
          >
            <Plus className="text-white" />
          </button>
        </div>
      }
      title="Create Organization"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organization name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter organization name"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      form.setValue(
                        "slug",
                        e.target.value.replaceAll(" ", "-")
                      );
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug URL</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter slug url"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e.target.value.replaceAll(" ", "-"));
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </CustomDialog>
  );
}

export default CreateOrganization;
