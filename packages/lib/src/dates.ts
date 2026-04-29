/**
 * Date helper stubs. Implementations ship in Phase 3.
 * Per D-05: Phase 1 carries empty stubs only.
 */

/** Format a Date as a human-readable label (e.g. "Mon, Apr 29"). */
export function formatDate(_date: Date): string {
  throw new Error("formatDate not implemented — ships in Phase 3");
}

/** Parse two ISO date strings into a {start, end} pair, validated and ordered. */
export function parseDateRange(
  _start: string,
  _end: string
): { start: Date; end: Date } {
  throw new Error("parseDateRange not implemented — ships in Phase 3");
}

/** Iterate every day between two dates inclusive. */
export function eachDayInRange(_start: Date, _end: Date): Date[] {
  throw new Error("eachDayInRange not implemented — ships in Phase 3");
}
