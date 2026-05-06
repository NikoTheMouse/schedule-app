"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { updateDateRangeAction } from "@/app/actions/groups"
import { toast } from "sonner"
import type { DateRange } from "react-day-picker"

interface DateRangeFormProps {
  groupId: string
  initialStart: string | null
  initialEnd: string | null
  canEdit: boolean
}

export function DateRangeForm({ groupId, initialStart, initialEnd, canEdit }: DateRangeFormProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: initialStart ? new Date(initialStart) : undefined,
    to: initialEnd ? new Date(initialEnd) : undefined,
  })
  const [isPending, startTransition] = useTransition()

  const handleSave = () => {
    if (!dateRange?.from || !dateRange?.to) {
      toast.error("Please select both start and end dates")
      return
    }

    startTransition(async () => {
      const result = await updateDateRangeAction(
        groupId,
        dateRange.from!.toISOString().split("T")[0],
        dateRange.to!.toISOString().split("T")[0]
      )

      if (result.ok) {
        toast.success("Date range updated")
      } else {
        toast.error(result.error || "Failed to update date range")
      }
    })
  }

  if (!canEdit) {
    return null
  }

  return (
    <div className="space-y-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start text-left">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                `${format(dateRange.from, "MMM d")} - ${format(dateRange.to, "MMM d, yyyy")}`
              ) : (
                format(dateRange.from, "MMM d, yyyy")
              )
            ) : (
              <span className="text-muted-foreground">Select date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={setDateRange}
            numberOfMonths={2}
            disabled={(date) => date < new Date()}
          />
        </PopoverContent>
      </Popover>

      <Button onClick={handleSave} disabled={isPending || !dateRange?.from || !dateRange?.to}>
        {isPending ? "Saving..." : "Save Date Range"}
      </Button>
    </div>
  )
}
