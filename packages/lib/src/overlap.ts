/**
 * Overlap calculation stubs. Implementations ship in Phase 3.
 * Per D-05: Phase 1 carries stubs only — actual overlap math is Phase 3 work.
 *
 * The continuous-time-block model (D-03) means overlap is computed by intersecting
 * intervals per date, not by summing per-slot bitmasks.
 */
import type { AvailabilityBlock } from "@repo/db";

/**
 * Returned shape for the overlap heatmap / ranked list view.
 * Keys are slot identifiers ("YYYY-MM-DD HH:MM"), values are the count of members
 * free at that moment.
 */
export type OverlapMap = Record<string, number>;

/**
 * Calculate per-time-slot overlap counts across a set of availability blocks.
 * Returns a map keyed by "YYYY-MM-DD HH:MM" -> count of members free.
 */
export function calculateOverlap(_blocks: AvailabilityBlock[]): OverlapMap {
  throw new Error("calculateOverlap not implemented — ships in Phase 3");
}

/**
 * Rank time slots by descending overlap count.
 * Returns the top N slots — used for the "best times" view.
 */
export function rankTopOverlaps(
  _blocks: AvailabilityBlock[],
  _topN: number
): Array<{ slot: string; count: number }> {
  throw new Error("rankTopOverlaps not implemented — ships in Phase 3");
}
