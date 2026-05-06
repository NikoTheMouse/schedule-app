"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { signOut } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      // signOut redirects to /login on success — promise only resolves on error.
      // Show success toast first; the redirect happens afterwards but Sonner
      // persists across the navigation.
      toast("Logged out.");
      await signOut();
    });
  }

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={handleClick}
      disabled={isPending}
      aria-label="Log out"
    >
      Log out
    </Button>
  );
}
