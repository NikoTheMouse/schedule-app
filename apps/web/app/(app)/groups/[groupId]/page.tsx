import { getGroup, getGroupMembers } from "@repo/db"
import { createSupabaseServerClient } from "@repo/db"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Calendar } from "lucide-react"
import Link from "next/link"
import { JoinLinkCopy } from "./JoinLinkCopy"
import { DateRangeForm } from "./date-range/DateRangeForm"

interface GroupPageProps {
  params: Promise<{ groupId: string }>
}

export default async function GroupPage({ params }: GroupPageProps) {
  const { groupId } = await params
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect("/login")
  }
  
  const group = await getGroup(groupId)
  
  if (!group) {
    redirect("/groups") // Not found or not a member
  }
  
  const members = await getGroupMembers(groupId)
  const isCreator = group.created_by === user.id
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  const joinLink = `${baseUrl}/join/${group.join_code}`
  const canEditDateRange = isCreator || group.date_range_permission === "any_member"
  
  return (
    <div className="container py-12 max-w-4xl">
      <div className="mb-6">
        <Link href="/groups" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to Groups
        </Link>
      </div>
      
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">{group.name}</h1>
          <p className="text-muted-foreground">
            {members.length} {members.length === 1 ? "member" : "members"}
          </p>
        </div>
        
        {/* Availability Section */}
        {group.date_range_start && group.date_range_end && (
          <div className="flex gap-2">
            <Link href={`/groups/${groupId}/availability`}>
              <Button>Enter Availability</Button>
            </Link>
          </div>
        )}
        
        {/* Join Code Section */}
        <div className="bg-card p-6 rounded-lg border space-y-4">
          <div className="space-y-2">
            <Label htmlFor="join-link">Shareable Link</Label>
            <JoinLinkCopy joinLink={joinLink} />
            <p className="text-xs text-muted-foreground">
              Anyone with this link can join the group
            </p>
          </div>
          
          {isCreator && (
            <form action={`/groups/${groupId}?regenerate=true`} method="post">
              <Button type="submit" variant="destructive" size="sm">
                Regenerate Link
              </Button>
            </form>
          )}
        </div>
        
        {/* Date Range Section */}
        <div className="bg-card p-6 rounded-lg border space-y-4">
          <h2 className="text-xl font-semibold">Date Range</h2>
          {group.date_range_start && group.date_range_end ? (
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <span>
                {new Date(group.date_range_start).toLocaleDateString()} -{" "}
                {new Date(group.date_range_end).toLocaleDateString()}
              </span>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm mb-4">
              No date range set.
            </p>
          )}
          <DateRangeForm
            groupId={groupId}
            initialStart={group.date_range_start}
            initialEnd={group.date_range_end}
            canEdit={canEditDateRange}
          />
        </div>
        
        {/* Members Section */}
        <div className="bg-card p-6 rounded-lg border space-y-4">
          <h2 className="text-xl font-semibold">Members</h2>
          {members.length === 1 ? (
            <div className="text-center py-6">
              <p className="text-lg font-medium mb-1">You'\''re the only member</p>
              <p className="text-sm text-muted-foreground">
                Share the join link above to invite others to this group.
              </p>
            </div>
          ) : (
            <ul className="space-y-2">
              {members.map((member) => (
                <li key={member.user_id} className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium">{member.display_name}</p>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                  </div>
                  {member.user_id === group.created_by && (
                    <span className="text-xs bg-muted px-2 py-1 rounded">Creator</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}