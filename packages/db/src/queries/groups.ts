/**
 * Group query stubs. Implementations ship in Phase 3.
 * All functions throw NotImplementedError at runtime; type signatures are stable.
 */
import { NotImplementedError } from "../errors";
import type { Group, GroupMember } from "../types";

export async function getGroup(_groupId: string): Promise<Group | null> {
  throw new NotImplementedError("getGroup", "Phase 3");
}

export async function createGroup(
  _name: string,
  _creatorId: string,
  _dateRangePermission: Group["date_range_permission"]
): Promise<Group> {
  throw new NotImplementedError("createGroup", "Phase 3");
}

export async function getGroupMembers(_groupId: string): Promise<GroupMember[]> {
  throw new NotImplementedError("getGroupMembers", "Phase 3");
}
