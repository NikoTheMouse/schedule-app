"use client"

interface OverlapHeatmapProps {
  startDate: string
  endDate: string
  overlapData: Record<string, number> // "YYYY-MM-DD:HH:MM" -> count
  totalMembers: number
}

// Time slots: 8 AM to 10 PM in 30-minute increments
const TIME_SLOTS = Array.from({ length: 28 }, (_, i) => {
  const hour = Math.floor(i / 2) + 8
  const minute = (i % 2) * 30
  return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
})

export function OverlapHeatmap({
  startDate,
  endDate,
  overlapData,
  totalMembers,
}: OverlapHeatmapProps) {
  // Generate date range
  const dates = []
  const start = new Date(startDate)
  const end = new Date(endDate)
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    dates.push(new Date(d).toISOString().split("T")[0])
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 text-sm">
        <span className="text-muted-foreground">Availability:</span>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded" />
          <span>Low</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500 rounded" />
          <span>Medium</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded" />
          <span>High</span>
        </div>
      </div>
      
      <div className="overflow-x-auto border rounded-lg">
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
          
          {/* Grid: Time slots with heatmap */}
          {TIME_SLOTS.map(time => (
            <div key={time} className="flex">
              <div className="w-20 flex-shrink-0 border-r border-b p-2 text-xs text-muted-foreground">
                {formatTime(time)}
              </div>
              {dates.map(date => {
                const slotKey = `${date}:${time}`
                const count = overlapData[slotKey] || 0
                const intensity = totalMembers > 0 ? count / totalMembers : 0
                const bgColor = getHeatmapColor(intensity)
                
                return (
                  <div
                    key={slotKey}
                    className={`
                      w-24 flex-shrink-0 border-r border-b h-6
                      flex items-center justify-center text-xs font-medium
                      ${bgColor}
                    `}
                    title={`${count} / ${totalMembers} available`}
                  >
                    {count > 0 && (
                      <span className={count === totalMembers ? "text-white" : ""}>
                        {count}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Helper: Get heatmap color based on intensity (0-1)
function getHeatmapColor(intensity: number): string {
  if (intensity === 0) return "bg-background"
  if (intensity < 0.33) return "bg-red-200"
  if (intensity < 0.66) return "bg-yellow-200"
  if (intensity < 1) return "bg-green-200"
  return "bg-green-500" // 100% availability
}

// Helper: Format date for header (e.g., "Mon 1/15")
function formatDateHeader(dateStr: string): string {
  const date = new Date(dateStr + "T12:00:00")
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
