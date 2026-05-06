import { createSupabaseServerClient } from "@repo/db"
import { getUserGroups, getGroupMembers } from "@repo/db"
import { GroupCard } from "@/components/GroupCard"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function GroupsPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect("/login")
  }
  
  const groups = await getUserGroups(user.id)
  
  // Get member counts for each group
  const groupsWithCounts = await Promise.all(
    groups.map(async (group) => {
      const members = await getGroupMembers(group.id)
      return { group, memberCount: members.length }
    })
  )
  
  return (
    <div className="container py-12 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Your Groups</h1>
          <p className="text-muted-foreground mt-1">
            Coordinate availability with your groups
          </p>
        </div>
        <Link href="/groups/new">
          <Button>Create Group</Button>
        </Link>
      </div>
      
      {groupsWithCounts.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-lg border">
          <h2 className="text-xl font-semibold mb-2">No groups yet</h2>
          <p className="text-muted-foreground mb-6">
            Create a group to start coordinating availability with others.
          </p>
          <Link href="/groups/new">
            <Button size="lg">Create Your First Group</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {groupsWithCounts.map(({ group, memberCount }) => (
            <GroupCard key={group.id} group={group} memberCount={memberCount} />
          ))}
        </div>
      )}
    </div>
  )
}
