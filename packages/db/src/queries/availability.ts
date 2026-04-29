/**
 * Availability query stubs. Implementations ship in Phase 3.
 * All functions throw NotImplementedError at runtime; type signatures are stable.
 */
import { NotImplementedError } from "../errors";
import type { AvailabilityBlock } from "../types";

export async function getUserAvailability(
  _groupId: string,
  _userId: string
): Promise<AvailabilityBlock[]> {
  throw new NotImplementedError("getUserAvailability", "Phase 3");
}

export async function setAvailability(
  _block: Omit<AvailabilityBlock, "id">
): Promise<AvailabilityBlock> {
  throw new NotImplementedError("setAvailability", "Phase 3");
}

export async function getGroupAvailability(
  _groupId: string
): Promise<AvailabilityBlock[]> {
  throw new NotImplementedError("getGroupAvailability", "Phase 3");
}
