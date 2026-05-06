"use server"

import {
  createGroup,
  getUserGroups,
  addMember,
  regenerateJoinCode,
  updateDateRange,
} from "@repo/db"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@repo/db"

/**
 * Create a new group and redirect to its detail page.
 * Returns { ok: true, groupId } on success, { ok: false, error } on failure.
 */
export async function createGroupAction(formData: FormData) {
  const name = formData.get("name") as string
  const permission = formData.get("date_range_permission") as "creator_only" | "any_member"
  
  if (!name || name.trim().length === 0) {
    return { ok: false, error: "Group name is required" }
  }
  
  if (name.length > 100) {
    return { ok: false, error: "Group name must be 100 characters or less" }
  }
  
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { ok: false, error: "Unauthorized" }
    }
    
    const group = await createGroup(name, user.id, permission)
    
    redirect(`/groups/${group.id}`)
  } catch (error) {
    console.error("Create group error:", error)
    return { ok: false, error: "Failed to create group" }
  }
}

/**
 * Join a group by join code.
 * Returns { ok: true, groupId } on success, { ok: false, error } on failure.
 */
export async function joinGroupAction(joinCode: string) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { ok: false, error: "Must be logged in to join a group" }
    }
    
    // Find group by join code
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: group, error: groupError } = await (supabase as any)
      .from("groups")
      .select("id")
      .eq("join_code", joinCode)
      .single()
    
    if (groupError || !group) {
      return { ok: false, error: "Invalid join code" }
    }
    
    await addMember(group.id, user.id)
    
    return { ok: true, groupId: group.id }
  } catch (error) {
    console.error("Join group error:", error)
    return { ok: false, error: "Failed to join group" }
  }
}

/**
 * Regenerate a group'\''s join code (creator only).
 */
export async function regenerateCodeAction(groupId: string) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { ok: false, error: "Unauthorized" }
    }
    
    const group = await regenerateJoinCode(groupId)
    
    revalidatePath(`/groups/${groupId}`)
    return { ok: true, joinCode: group.join_code }
  } catch (error) {
    console.error("Regenerate code error:", error)
    return { ok: false, error: "Failed to regenerate join code" }
  }
}

/**
 * Update a group'\''s date range (creator or any member, depending on permission).
 */
export async function updateDateRangeAction(
  groupId: string,
  startDate: string | null,
  endDate: string | null
) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { ok: false, error: "Unauthorized" }
    }
    
    await updateDateRange(groupId, startDate, endDate, user.id)
    
    revalidatePath(`/groups/${groupId}`)
    return { ok: true }
  } catch (error: any) {
    console.error("Update date range error:", error)
    return { ok: false, error: error.message || "Failed to update date range" }
  }
}