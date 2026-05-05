"use server";

import { createSupabaseServerClient } from "@repo/db";

export type ProfileActionResult = { error: string } | { ok: true };

/**
 * PROF-02 — update the current user's display_name.
 * The (app) layout already enforces auth, but we re-check here because server
 * actions can be invoked from anywhere (defense in depth).
 */
export async function updateDisplayName(
  displayName: string
): Promise<ProfileActionResult> {
  const trimmed = displayName.trim();
  if (trimmed.length === 0) {
    return { error: "Display name is required." };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Could not save changes. Try again." };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from("profiles")
    .update({ display_name: trimmed })
    .eq("id", user.id);

  if (error) {
    return { error: "Could not save changes. Try again." };
  }
  return { ok: true };
}
