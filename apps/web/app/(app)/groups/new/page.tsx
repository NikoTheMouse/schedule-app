import { createGroupAction } from "@/app/actions/groups"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Link from "next/link"

export default function NewGroupPage() {
  return (
    <div className="container py-12 max-w-2xl">
      <div className="mb-6">
        <Link href="/groups" className="text-sm text-muted-foreground hover:text-foreground">
          ? Back to Groups
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold mb-6">Create Group</h1>
      
      <form action={createGroupAction as any} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Group Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="Weekend Planning, Team Standup, etc."
            required
            maxLength={100}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            1-100 characters
          </p>
        </div>
        
        <div className="space-y-3">
          <Label>Who can add date ranges?</Label>
          <RadioGroup defaultValue="creator_only" name="date_range_permission">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="creator_only" id="creator_only" />
              <Label htmlFor="creator_only" className="font-normal cursor-pointer">
                Only me (group creator)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="any_member" id="any_member" />
              <Label htmlFor="any_member" className="font-normal cursor-pointer">
                Any group member
              </Label>
            </div>
          </RadioGroup>
          <p className="text-xs text-muted-foreground">
            Controls who can set the date range for availability polling.
            You can change this later.
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button type="submit" className="flex-1">
            Create Group
          </Button>
          <Link href="/groups">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  )
}
