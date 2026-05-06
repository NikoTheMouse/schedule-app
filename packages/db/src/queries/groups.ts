/**
 * Group queries for Phase 3.
 * All functions use RLS-protected Supabase client for secure data access.
 */
import { createSupabaseServerClient } from "../client"
import type { Group, GroupMember } from "../types"

/**
 * Get a single group by ID. Returns null if not found or user not a member (RLS filtered).
 */
export async function getGroup(groupId: string): Promise<Group | null> {
  const supabase = await createSupabaseServerClient()
  
  const { data, error } = await (supabase as any)
    .from("groups")
    .select("*")
    .eq("id", groupId)
    .single()
  
  if (error) {
    if (error.code === "PGRST116") return null // Not found or RLS filtered
    throw error
  }
  
  return data
}

/**
 * Create a new group and automatically add the creator as the first member.
 */
export async function createGroup(
  name: string,
  creatorId: string,
  dateRangePermission: "creator_only" | "any_member"
): Promise<Group> {
  const supabase = await createSupabaseServerClient()
  
  // Insert group - let database set created_by via auth.uid()
  const { data: group, error: groupError } = await (supabase as any)
    .from("groups")
    .insert({
      name,
      created_by: creatorId,
      date_range_permission: dateRangePermission,
    })
    .select()
    .single()
  
  if (groupError) {
    console.error("Group insert error:", groupError)
    throw groupError
  }
  
  // Add creator as first member
  const { error: memberError } = await (supabase as any)
    .from("group_members")
    .insert({
      group_id: group.id,
      user_id: creatorId,
    })
  
  if (memberError) {
    console.error("Member insert error:", memberError)
    throw memberError
  }
  
  return group
}

/**
 * Get all members of a group with their profile information (display name, email).
 */
export async function getGroupMembers(
  groupId: string
): Promise<Array<GroupMember & { display_name: string; email: string }>> {
  const supabase = await createSupabaseServerClient()
  
  // Get members
  const { data: members, error: membersError } = await (supabase as any)
    .from("group_members")
    .select("*")
    .eq("group_id", groupId)
  
  if (membersError) throw membersError
  
  // Get profiles separately
  const userIds = members.map((m: any) => m.user_id)
  const { data: profiles, error: profilesError } = await (supabase as any)
    .from("profiles")
    .select("id, display_name, email")
    .in("id", userIds)
  
  if (profilesError) throw profilesError
  
  // Merge members with profiles
  return members.map((member: any) => {
    const profile = profiles.find((p: any) => p.id === member.user_id)
    return {
      group_id: member.group_id,
      user_id: member.user_id,
      joined_at: member.joined_at,
      display_name: profile?.display_name || profile?.email || "Unknown",
      email: profile?.email || "",
    }
  })
}

/**
 * Get all groups the user is a member of.
 */
export async function getUserGroups(userId: string): Promise<Group[]> {
  const supabase = await createSupabaseServerClient()
  
  // Get group IDs for user
  const { data: memberships, error: membershipsError } = await (supabase as any)
    .from("group_members")
    .select("group_id")
    .eq("user_id", userId)
  
  if (membershipsError) throw membershipsError
  
  if (memberships.length === 0) return []
  
  // Get full group details
  const groupIds = memberships.map((m: any) => m.group_id)
  const { data: groups, error: groupsError } = await (supabase as any)
    .from("groups")
    .select("*")
    .in("id", groupIds)
  
  if (groupsError) throw groupsError
  
  return groups || []
}

/**
 * Regenerate a group'\''s join code (creator only via RLS UPDATE policy).
 */
export async function regenerateJoinCode(groupId: string): Promise<Group> {
  const supabase = await createSupabaseServerClient()
  
  // Generate new 8-char code (same pattern as SQL default)
  const newCode = Math.random().toString(36).substring(2, 10)
  
  const { data, error } = await (supabase as any)
    .from("groups")
    .update({ join_code: newCode })
    .eq("id", groupId)
    .select()
    .single()
  
  if (error) throw error
  
  return data
}

/**
 * Add a user to a group. Ignores duplicate membership errors (PK violation).
 */
export async function addMember(groupId: string, userId: string): Promise<void> {
  const supabase = await createSupabaseServerClient()
  
  const { error } = await (supabase as any)
    .from("group_members")
    .insert({
      group_id: groupId,
      user_id: userId,
    })
  
  if (error) {
    // Ignore duplicate member errors (PK violation code 23505)
    if (error.code === "23505") return
    throw error
  }
}

/**
 * Update a group'\''s date range. Checks permission before updating.
 * Throws error if user lacks permission (creator_only groups require created_by match).
 */
export async function updateDateRange(
  groupId: string,
  startDate: string | null,
  endDate: string | null,
  userId: string
): Promise<Group> {
  const supabase = await createSupabaseServerClient()
  
  // Check permission
  const { data: group } = await (supabase as any)
    .from("groups")
    .select("created_by, date_range_permission")
    .eq("id", groupId)
    .single()
  
  if (!group) throw new Error("Group not found")
  
  if (group.date_range_permission === "creator_only" && group.created_by !== userId) {
    throw new Error("Only the group creator can update the date range")
  }
  
  const { data, error } = await (supabase as any)
    .from("groups")
    .update({
      date_range_start: startDate,
      date_range_end: endDate,
    })
    .eq("id", groupId)
    .select()
    .single()
  
  if (error) throw error
  
  return data
}