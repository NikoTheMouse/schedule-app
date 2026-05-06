import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@repo/db";
import { AppHeader } from "@/components/AppHeader";

/**
 * Auth-guarded layout for the (app) route group.
 *
 * AUTH-04 (D-07): unauthenticated users are redirected to /login before any
 * child route renders. Uses auth.getUser() — NOT getSession() — so the JWT is
 * verified against the Supabase auth server (Pitfall 2).
 *
 * The display_name is fetched once here for the header; child routes that need
 * it can refetch from their own loaders.
 */
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile } = await (supabase as any)
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .single();

  // Pitfall 4: null-safe fallback in case profile row is missing.
  const displayName = profile?.display_name ?? user.email ?? "";

  return (
    <div className="min-h-screen bg-background">
      <AppHeader displayName={displayName} />
      <main className="mx-auto max-w-5xl p-6">{children}</main>
    </div>
  );
}