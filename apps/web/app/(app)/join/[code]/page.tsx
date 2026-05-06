import { joinGroupAction } from "@/app/actions/groups"
import { createSupabaseServerClient } from "@repo/db"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface JoinPageProps {
  params: Promise<{ code: string }>
}

export default async function JoinPage({ params }: JoinPageProps) {
  const { code } = await params
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  // If not logged in, redirect to login with return URL
  if (!user) {
    redirect(`/login?redirect=/join/${code}`)
  }
  
  // Auto-join
  const result = await joinGroupAction(code)
  
  if (result.ok && result.groupId) {
    redirect(`/groups/${result.groupId}`)
  }
  
  // Error state: invalid code
  return (
    <div className="container py-12 max-w-2xl">
      <div className="text-center py-12 bg-card rounded-lg border">
        <h1 className="text-2xl font-semibold mb-2">Group not found</h1>
        <p className="text-muted-foreground mb-6">
          This join link is invalid or expired. Ask the group creator for a new link.
        </p>
        <Link href="/groups">
          <Button>Go to Your Groups</Button>
        </Link>
      </div>
    </div>
  )
}
