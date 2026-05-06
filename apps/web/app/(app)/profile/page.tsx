import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@repo/db";

import { ProfileForm } from "./ProfileForm";

export default async function ProfilePage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    // Defensive — (app) layout should have already redirected, but keep this
    // as a belt-and-suspenders check in case of stale renders.
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .single<{ display_name: string | null }>();

  const initialDisplayName = profile?.display_name ?? "";

  return (
    <section className="mx-auto w-full max-w-sm space-y-6">
      <h1 className="text-xl font-semibold">Profile</h1>
      <ProfileForm initialDisplayName={initialDisplayName} />
    </section>
  );
}
