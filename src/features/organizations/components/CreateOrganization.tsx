"use client";

import dynamic from "next/dynamic";
const CustomTooltip = dynamic(() => import("@/components/CustomTooltip"));
const UploadImage = dynamic(() => import("./UploadImage"));
const CustomDialog = dynamic(() => import("@/components/CustomDialog"));

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
import { insertOrganizationsSchema } from "@/database/schema";
import { useCreateOrganizationStore } from "@/zustand/useCreateOrganizationStore/store";
import { cn } from "@/lib/utils";

const formSchema = insertOrganizationsSchema.pick({
  name: true,
  slug: true,
});

interface Props {
  classNameForButton?: string;
  buttonText?: string;
}

function CreateOrganization({ classNameForButton, buttonText }: Props) {
  const isModalOpen = useCreateOrganizationStore(
    ({ isCreateOrganizationOpen }) => isCreateOrganizationOpen
  );
  const closeModal = useCreateOrganizationStore(
    ({ closeCreateOrganization }) => closeCreateOrganization
  );
  const openModal = useCreateOrganizationStore(
    ({ openCreateOrganization }) => openCreateOrganization
  );
  const toggleModal = useCreateOrganizationStore(
    ({ toggleCreateOrganization }) => toggleCreateOrganization
  );

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
            closeModal();
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
        buttonText ? (
          <Button size="lg">{buttonText}</Button>
        ) : (
          <CustomTooltip
            sideOffset={10}
            trigger={
              <div className="size-10">
                <button
                  className={cn(
                    "bg-white/25 size-full rounded-md flex items-center justify-center opacity-60 hover:opacity-100 transition hover:rounded-lg",
                    classNameForButton
                  )}
                  onClick={() => openModal()}
                >
                  <Plus className="text-white" />
                </button>
              </div>
            }
            content="Create Organization"
            side="right"
          />
        )
      }
      title="Create Organization"
      description="Create organization to use board"
      isOpen={isModalOpen}
      setIsOpen={toggleModal}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <UploadImage image={image} setImage={setImage} className="mt-6" />
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
                        e.target.value.replaceAll(" ", "-").toLowerCase()
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
            variant="custom"
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
