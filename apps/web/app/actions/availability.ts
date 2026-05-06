"use server"

import { setAvailability } from "@repo/db"
import { createSupabaseServerClient } from "@repo/db"
import { revalidatePath } from "next/cache"

/**
 * Save user's availability blocks for a group.
 */
export async function saveAvailabilityAction(
  groupId: string,
  blocks: Array<{ date: string; start_time: string; end_time: string }>
) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { ok: false, error: "Unauthorized" }
    }
    
    await setAvailability(groupId, user.id, blocks)
    
    revalidatePath(`/groups/${groupId}`)
    return { ok: true }
  } catch (error) {
    console.error("Save availability error:", error)
    return { ok: false, error: "Failed to save availability" }
  }
}
