"use client";

import CustomDialog from "@/components/CustomDialog";
import { Loader2, Plus } from "lucide-react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useCallback, useState } from "react";
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
import { useCreateOrganization } from "../api/UseCreateOrganization";
import { insertOrganizationSchema } from "@/database/schema";
import UploadImage from "./UploadImage";

const formSchema = insertOrganizationSchema.pick({
  name: true,
  slug: true,
});

function CreateOrganization() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [image, setImage] = useState("");
  const createOrganization = useCreateOrganization();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  const onSubmit = useCallback(
    (values: z.infer<typeof formSchema>) => {
      createOrganization.mutate(
        { ...values, image },
        {
          onSuccess: () => {
            form.reset();
            setIsModalOpen(false);
            setImage("");
          },
        }
      );
    },
    [image]
  );

  return (
    <CustomDialog
      trigger={
        <div className="size-10">
          <button
            className="bg-white/25 size-full rounded-md flex items-center justify-center opacity-60 hover:opacity-100
         transition"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="text-white" />
          </button>
        </div>
      }
      title="Create Organization"
      description="Create organization to use board"
      isOpen={isModalOpen}
      setIsOpen={setIsModalOpen}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <UploadImage image={image} setImage={setImage} className="mt-6"/>
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
                    required
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
                    required
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
          <Button
            type="submit"
            disabled={
              createOrganization.isPending ||
              !Boolean(form.getValues("name")) ||
              !Boolean(form.getValues("slug"))
            }
          >
            {createOrganization.isPending && (
              <Loader2 className="size-6 mr-2 animate-spin" />
            )}
            Submit
          </Button>
        </form>
      </Form>
    </CustomDialog>
  );
}

export default CreateOrganization;
