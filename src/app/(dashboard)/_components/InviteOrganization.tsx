import CustomDialog from "@/components/CustomDialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { insertOrganizationMemberSchema } from "@/database/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Share } from "lucide-react";
import { useSearchParams } from "next/navigation";

const formSchema = insertOrganizationMemberSchema.pick({
  invitationEmail: true,
  organizationId: true,
  role: true,
});

function InviteOrganization() {
  const organizationId = useSearchParams().get("organization");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      invitationEmail: "",
      organizationId: "",
      role: "",
    },
  });

  const onSubmit = useCallback((values: z.infer<typeof formSchema>) => {
    if (organizationId) {
      console.log(values);
    }
  }, [organizationId]);

  return (
    <CustomDialog
      title="Invite members"
      description="You can send invitation based on email"
      trigger={
        <Button
          variant="ghost"
          size="lg"
          className="font-normal justify-around px-2 w-full"
        >
          <Share className="size-4 mr-2" />
          Invite
        </Button>
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="invitationEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter email to send invitation"
                    required
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent {...field}>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="member">Member</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            variant="custom"
            disabled={!Boolean(organizationId)}
          >
            {/* <Loader2 className="size-6 mr-2 animate-spin" /> */}
            Submit
          </Button>
          {!Boolean(organizationId) && (
            <p className="text-zinc-700 text-sm text-center">
              Please select an organization first
            </p>
          )}
        </form>
      </Form>
    </CustomDialog>
  );
}

export default InviteOrganization;
