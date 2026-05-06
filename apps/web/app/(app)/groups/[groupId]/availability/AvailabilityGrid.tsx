"use client"

import { useState, useRef, useEffect } from "react"
import { saveAvailabilityAction } from "@/app/actions/availability"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface AvailabilityGridProps {
  groupId: string
  startDate: string
  endDate: string
  userBlocks: Array<{ date: string; start_time: string; end_time: string }>
}

// Time slots: 8 AM to 10 PM in 30-minute increments
const TIME_SLOTS = Array.from({ length: 28 }, (_, i) => {
  const hour = Math.floor(i / 2) + 8
  const minute = (i % 2) * 30
  return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
})

export function AvailabilityGrid({
  groupId,
  startDate,
  endDate,
  userBlocks,
}: AvailabilityGridProps) {
  const [selectedSlots, setSelectedSlots] = useState<Set<string>>(new Set())
  const [isSelecting, setIsSelecting] = useState(false)
  const [selectionMode, setSelectionMode] = useState<"add" | "remove">("add")
  const [isSaving, setIsSaving] = useState(false)
  const gridRef = useRef<HTMLDivElement>(null)
  
  // Generate date range
  const dates: string[] = []
  const start = new Date(startDate)
  const end = new Date(endDate)
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    dates.push(new Date(d).toISOString().split("T")[0])
  }
  
  // Initialize selected slots from userBlocks
  useEffect(() => {
    const slots = new Set<string>()
    for (const block of userBlocks) {
      const startMinutes = timeToMinutes(block.start_time)
      const endMinutes = timeToMinutes(block.end_time)
      for (let m = startMinutes; m < endMinutes; m += 30) {
        const timeStr = minutesToTime(m)
        slots.add(`${block.date}:${timeStr}`)
      }
    }
    setSelectedSlots(slots)
  }, [userBlocks])
  
  const handleMouseDown = (slotKey: string) => {
    setIsSelecting(true)
    const newMode = selectedSlots.has(slotKey) ? "remove" : "add"
    setSelectionMode(newMode)
    toggleSlot(slotKey, newMode)
  }
  
  const handleMouseEnter = (slotKey: string) => {
    if (isSelecting) {
      toggleSlot(slotKey, selectionMode)
    }
  }
  
  const handleMouseUp = () => {
    setIsSelecting(false)
  }
  
  const toggleSlot = (slotKey: string, mode: "add" | "remove") => {
    setSelectedSlots(prev => {
      const next = new Set(prev)
      if (mode === "add") {
        next.add(slotKey)
      } else {
        next.delete(slotKey)
      }
      return next
    })
  }
  
  const handleSave = async () => {
    setIsSaving(true)
    
    // Convert selected slots to blocks
    const blocks = slotsToBlocks(selectedSlots)
    
    const result = await saveAvailabilityAction(groupId, blocks)
    
    if (result.ok) {
      // Success feedback could go here
    } else {
      alert(result.error || "Failed to save")
    }
    
    setIsSaving(false)
  }
  
  // Add global mouse up listener
  useEffect(() => {
    document.addEventListener("mouseup", handleMouseUp)
    return () => document.removeEventListener("mouseup", handleMouseUp)
  }, [])
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Click and drag to select your available times
        </p>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Availability
        </Button>
      </div>
      
      <div 
        ref={gridRef}
        className="overflow-x-auto border rounded-lg"
        style={{ userSelect: "none" }}
      >
        <div className="inline-block min-w-full">
          {/* Header: Dates */}
          <div className="flex bg-muted">
            <div className="w-20 flex-shrink-0 border-r border-b p-2 text-xs font-medium">
              Time
            </div>
            {dates.map(date => (
              <div
                key={date}
                className="w-24 flex-shrink-0 border-r border-b p-2 text-center text-xs font-medium"
              >
                {formatDateHeader(date)}
              </div>
            ))}
          </div>
          
          {/* Grid: Time slots */}
          {TIME_SLOTS.map(time => (
            <div key={time} className="flex">
              <div className="w-20 flex-shrink-0 border-r border-b p-2 text-xs text-muted-foreground">
                {formatTime(time)}
              </div>
              {dates.map(date => {
                const slotKey = `${date}:${time}`
                const isSelected = selectedSlots.has(slotKey)
                return (
                  <div
                    key={slotKey}
                    className={`
                      w-24 flex-shrink-0 border-r border-b h-6 cursor-pointer
                      transition-colors
                      ${isSelected ? "bg-green-500 hover:bg-green-600" : "bg-background hover:bg-muted"}
                    `}
                    onMouseDown={() => handleMouseDown(slotKey)}
                    onMouseEnter={() => handleMouseEnter(slotKey)}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Helper: Format date for header (e.g., "Mon 1/15")
function formatDateHeader(dateStr: string): string {
  const date = new Date(dateStr + "T12:00:00") // Add time to avoid timezone issues
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const day = days[date.getDay()]
  const month = date.getMonth() + 1
  const dayNum = date.getDate()
  return `${day} ${month}/${dayNum}`
}

// Helper: Format time (e.g., "8:00 AM")
function formatTime(time: string): string {
  const [hours, minutes] = time.split(":").map(Number)
  const period = hours >= 12 ? "PM" : "AM"
  const hour12 = hours % 12 || 12
  return `${hour12}:${minutes.toString().padStart(2, "0")} ${period}`
}

// Helper: Convert "HH:MM" to minutes
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number)
  return hours * 60 + minutes
}

// Helper: Convert minutes to "HH:MM:SS"
function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`
}

// Helper: Convert selected slots to contiguous blocks
function slotsToBlocks(
  slots: Set<string>
): Array<{ date: string; start_time: string; end_time: string }> {
  const blocks: Array<{ date: string; start_time: string; end_time: string }> = []
  const slotsByDate = new Map<string, number[]>()
  
  // Group slots by date - FIX: parse slot key correctly (date:HH:MM)
  for (const slot of slots) {
    const colonIndex = slot.indexOf(':')
    const date = slot.substring(0, colonIndex)
    const time = slot.substring(colonIndex + 1)
    const minutes = timeToMinutes(time)
    if (!slotsByDate.has(date)) {
      slotsByDate.set(date, [])
    }
    slotsByDate.get(date)!.push(minutes)
  }
  
  // For each date, merge contiguous slots into blocks
  for (const [date, minutesList] of slotsByDate) {
    minutesList.sort((a, b) => a - b)
    
    let blockStart = minutesList[0]
    let blockEnd = minutesList[0] + 30
    
    for (let i = 1; i < minutesList.length; i++) {
      const current = minutesList[i]
      if (current === blockEnd) {
        // Extend current block
        blockEnd = current + 30
      } else {
        // Save current block and start new one
        blocks.push({
          date,
          start_time: `${minutesToTime(blockStart)}:00`,
          end_time: `${minutesToTime(blockEnd)}:00`,
        })
        blockStart = current
        blockEnd = current + 30
      }
    }
    
    // Save final block
    blocks.push({
      date,
      start_time: `${minutesToTime(blockStart)}:00`,
      end_time: `${minutesToTime(blockEnd)}:00`,
    })
  }
  
  return blocks
}