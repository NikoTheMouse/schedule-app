/**
 * @repo/db — public surface.
 *
 * All Supabase access in the monorepo flows through this package (CLAUDE.md constraint).
 * apps/web and future apps/mobile consume this package via the workspace:* protocol.
 */
export { createSupabaseBrowserClient, createSupabaseServerClient } from "./src/client";
export { NotImplementedError } from "./src/errors";
export type {
  Profile,
  Group,
  GroupMember,
  AvailabilityBlock,
  Database,
} from "./src/types";
export { getGroup, createGroup, getGroupMembers, getUserGroups, addMember, regenerateJoinCode, updateDateRange } from "./src/queries/groups";
export {
  getUserAvailability,
  setAvailability,
  getGroupAvailability,
  calculateOverlap,
} from "./src/queries/availability";