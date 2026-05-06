/**
 * Availability query functions for Phase 3.
 */
import { createSupabaseServerClient } from "../client"
import type { AvailabilityBlock } from "../types"

/**
 * Get all availability blocks for a specific user in a group.
 */
export async function getUserAvailability(
  groupId: string,
  userId: string
): Promise<AvailabilityBlock[]> {
  const supabase = await createSupabaseServerClient()
  
  const { data, error } = await supabase
    .from("availability_blocks")
    .select("*")
    .eq("group_id", groupId)
    .eq("user_id", userId)
    .order("date", { ascending: true })
    .order("start_time", { ascending: true })
  
  if (error) throw error
  return data || []
}

/**
 * Get all availability blocks for a group (all users).
 */
export async function getGroupAvailability(
  groupId: string
): Promise<AvailabilityBlock[]> {
  const supabase = await createSupabaseServerClient()
  
  const { data, error } = await supabase
    .from("availability_blocks")
    .select("*")
    .eq("group_id", groupId)
    .order("date", { ascending: true })
    .order("start_time", { ascending: true })
  
  if (error) throw error
  return data || []
}

/**
 * Create or update availability blocks for a user.
 * This replaces all blocks for the user in this group with the provided blocks.
 */
export async function setAvailability(
  groupId: string,
  userId: string,
  blocks: Array<{ date: string; start_time: string; end_time: string }>
): Promise<void> {
  const supabase = await createSupabaseServerClient()
  
  // Delete existing blocks for this user in this group
  const { error: deleteError } = await supabase
    .from("availability_blocks")
    .delete()
    .eq("group_id", groupId)
    .eq("user_id", userId)
  
  if (deleteError) throw deleteError
  
  // Insert new blocks if any
  if (blocks.length > 0) {
    const { error: insertError } = await supabase
      .from("availability_blocks")
      .insert(
        blocks.map(block => ({
          group_id: groupId,
          user_id: userId,
          date: block.date,
          start_time: block.start_time,
          end_time: block.end_time,
        }))
      )
    
    if (insertError) throw insertError
  }
}

/**
 * Calculate overlap: for each time slot, count how many users are available.
 * Returns a map of "YYYY-MM-DD:HH:MM" -> count.
 */
export async function calculateOverlap(
  groupId: string
): Promise<Map<string, number>> {
  const blocks = await getGroupAvailability(groupId)
  const overlap = new Map<string, number>()
  
  // For each block, increment counters for all 30-min slots it covers
  for (const block of blocks) {
    const date = block.date
    const startMinutes = timeToMinutes(block.start_time)
    const endMinutes = timeToMinutes(block.end_time)
    
    // Iterate through 30-minute slots
    for (let minutes = startMinutes; minutes < endMinutes; minutes += 30) {
      const timeStr = minutesToTime(minutes)
      const key = `${date}:${timeStr}`
      overlap.set(key, (overlap.get(key) || 0) + 1)
    }
  }
  
  return overlap
}

// Helper: Convert "HH:MM:SS" to minutes since midnight
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number)
  return hours * 60 + minutes
}

// Helper: Convert minutes since midnight to "HH:MM"
function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`
}