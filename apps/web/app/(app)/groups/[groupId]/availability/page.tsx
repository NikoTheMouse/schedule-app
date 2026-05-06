import { getGroup, getUserAvailability, calculateOverlap, getGroupMembers } from "@repo/db"
import { createSupabaseServerClient } from "@repo/db"
import { redirect } from "next/navigation"
import Link from "next/link"
import { AvailabilityGrid } from "./AvailabilityGrid"
import { OverlapHeatmap } from "./OverlapHeatmap"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface AvailabilityPageProps {
  params: Promise<{ groupId: string }>
}

export default async function AvailabilityPage({ params }: AvailabilityPageProps) {
  const { groupId } = await params
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect("/login")
  }
  
  const group = await getGroup(groupId)
  
  if (!group) {
    redirect("/groups")
  }
  
  // Check if date range is set
  if (!group.date_range_start || !group.date_range_end) {
    return (
      <div className="container py-12 max-w-4xl">
        <div className="mb-6">
          <Link href={`/groups/${groupId}`} className="text-sm text-muted-foreground hover:text-foreground">
            ← Back to Group
          </Link>
        </div>
        
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Set a Date Range First</h1>
          <p className="text-muted-foreground mb-6">
            Before entering availability, the group needs a date range.
          </p>
          <Link
            href={`/groups/${groupId}`}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            Go to Group Settings
          </Link>
        </div>
      </div>
    )
  }
  
  const userBlocks = await getUserAvailability(groupId, user.id)
  const overlapMap = await calculateOverlap(groupId)
  const members = await getGroupMembers(groupId)
  
  // Convert Map to plain object for client component
  const overlapData: Record<string, number> = {}
  for (const [key, value] of overlapMap) {
    overlapData[key] = value
  }
  
  return (
    <div className="container py-12 max-w-7xl">
      <div className="mb-6">
        <Link href={`/groups/${groupId}`} className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to Group
        </Link>
      </div>
      
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{group.name} - Availability</h1>
          <p className="text-muted-foreground">
            {new Date(group.date_range_start).toLocaleDateString()} -{" "}
            {new Date(group.date_range_end).toLocaleDateString()}
          </p>
        </div>
        
        <Tabs defaultValue="my-availability" className="w-full">
          <TabsList>
            <TabsTrigger value="my-availability">My Availability</TabsTrigger>
            <TabsTrigger value="group-overlap">Group Overlap</TabsTrigger>
          </TabsList>
          
          <TabsContent value="my-availability" className="mt-6">
            <AvailabilityGrid
              groupId={groupId}
              startDate={group.date_range_start}
              endDate={group.date_range_end}
              userBlocks={userBlocks}
            />
          </TabsContent>
          
          <TabsContent value="group-overlap" className="mt-6">
            <OverlapHeatmap
              startDate={group.date_range_start}
              endDate={group.date_range_end}
              overlapData={overlapData}
              totalMembers={members.length}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
