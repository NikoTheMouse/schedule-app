"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { updateDisplayName } from "@/app/actions/profile";
import { profileSchema, type ProfileValues } from "@/lib/schemas/profile";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export interface ProfileFormProps {
  initialDisplayName: string;
}

export function ProfileForm({ initialDisplayName }: ProfileFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { displayName: initialDisplayName },
  });

  async function onSubmit(values: ProfileValues) {
    setServerError(null);
    const result = await updateDisplayName(values.displayName);
    if (result && "error" in result) {
      setServerError(result.error);
      return;
    }
    toast("Display name updated.");
    // Reset the form's "dirty" state so subsequent saves don't re-show the
    // "unsaved" indicator if we add one later.
    form.reset({ displayName: values.displayName });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
        noValidate
      >
        <FormField
          control={form.control}
          name="displayName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-normal">Display name</FormLabel>
              <FormControl>
                <Input type="text" autoComplete="name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {serverError && (
          <Alert variant="destructive">
            <AlertDescription>{serverError}</AlertDescription>
          </Alert>
        )}
        <Button
          type="submit"
          className="h-11"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Save changes"
          )}
        </Button>
      </form>
    </Form>
  );
}
