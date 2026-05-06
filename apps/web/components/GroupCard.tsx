import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar } from "lucide-react"
import type { Group } from "@repo/db"
import Link from "next/link"
import { format } from "date-fns"

interface GroupCardProps {
  group: Group
  memberCount: number
}

export function GroupCard({ group, memberCount }: GroupCardProps) {
  const hasDateRange = group.date_range_start && group.date_range_end
  
  return (
    <Link href={`/groups/${group.id}`}>
      <Card className="hover:border-primary transition-colors cursor-pointer h-full">
        <CardHeader>
          <CardTitle className="text-lg">{group.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{memberCount} {memberCount === 1 ? "member" : "members"}</span>
          </div>
          {hasDateRange ? (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>
                {format(new Date(group.date_range_start!), "MMM d")} -{" "}
                {format(new Date(group.date_range_end!), "MMM d, yyyy")}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>No date range set</span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
