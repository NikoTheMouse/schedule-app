"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@repo/db";

export type ActionResult = { error: string } | { ok: true };

/**
 * AUTH-02 — sign in with email + password.
 * Inline error string is the EXACT copy from UI-SPEC. Do NOT pass error.message
 * through; Supabase returns varied messages that can leak implementation details
 * (Pitfall 5). On success, redirect to /groups.
 */
export async function signIn(
  email: string,
  password: string
): Promise<ActionResult> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { error: "Invalid email or password." };
  }
  redirect("/groups");
}

/**
 * AUTH-01 + PROF-01 — sign up with email, password, and display name.
 * display_name is passed via options.data so the handle_new_user trigger
 * (Plan 01) can read it from raw_user_meta_data and insert the profiles row.
 */
export async function signUp(
  email: string,
  password: string,
  displayName: string
): Promise<ActionResult> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { display_name: displayName } },
  });
  if (error) {
    // Supabase returns variants like "User already registered" — map to UI-SPEC copy.
    return { error: "An account with this email already exists." };
  }
  redirect("/groups");
}

/**
 * AUTH-03 — sign out from anywhere. Triggered by the Log out button in the
 * (app) header (built in Plan 03). Toast on success is fired client-side after
 * this action returns.
 */
export async function signOut(): Promise<ActionResult> {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}
