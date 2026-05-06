import Link from "next/link";
import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@repo/db";
import { Button } from "@/components/ui/button";

export default async function HomePage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    redirect("/groups");
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-xs text-center space-y-6">
        <h1 className="text-3xl font-semibold">MouseTime</h1>
        <p className="text-muted-foreground">Find when everyone&apos;s free.</p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-3">
          <Button asChild className="h-11">
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild variant="outline" className="h-11">
            <Link href="/signup">Create account</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
