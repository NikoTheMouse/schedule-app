---
phase: 02-authentication
plan: "05"
subsystem: ui
tags: [shadcn, tailwind, cva, alert, destructive-variant]

requires:
  - phase: 02-authentication
    provides: alert.tsx installed by Plan 01 Task 1 via shadcn add alert; --destructive CSS variable defined in globals.css

provides:
  - Corrected destructive Alert variant with red border (border-destructive) and red-tinted background (bg-destructive/10)
  - All three call sites (login error, signup duplicate-email error, profile save error) gain red styling with zero call-site code changes

affects:
  - 02-authentication (UAT Gap 2 closure; AUTH-02 UAT scenario 10)
  - any future phase using Alert variant="destructive"

tech-stack:
  added: []
  patterns:
    - "shadcn cva variant strings use CSS variable-based Tailwind utilities (border-destructive, bg-destructive/10) rather than hardcoded colors for theme-aware light/dark mode styling"

key-files:
  created: []
  modified:
    - apps/web/components/ui/alert.tsx
    - apps/web/app/actions/profile.ts

key-decisions:
  - "Used bg-destructive/10 (10% opacity tint) rather than full bg-destructive saturation — keeps text legible against both light and dark themes while clearly signalling an error state"
  - "Used 'as any' cast in profile.ts instead of @ts-ignore comment — the comment only suppresses the immediately following line but the chained method call error was on a later line"

patterns-established:
  - "Alert variant='destructive' renders as a visually distinct red box: red border + red-tinted background + red text — consistent across login, signup, and profile error paths"

requirements-completed: [AUTH-02]

duration: 5min
completed: "2026-05-05"
---

# Phase 2 Plan 05: Alert Destructive Variant Fix Summary

**shadcn Alert destructive variant corrected to render red border + bg-destructive/10 tint, closing UAT Gap 2 (login error visually indistinguishable from body text)**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-05-05T08:01:55Z
- **Completed:** 2026-05-05T08:06:27Z
- **Tasks:** 1 of 2 (Task 2 is human-verify checkpoint — pending)
- **Files modified:** 2

## Accomplishments

- Updated `destructive` cva variant in alert.tsx: replaced `bg-card` with `bg-destructive/10` and added `border-destructive`
- All three existing call sites (`/login`, `/signup`, `/profile`) now render the error Alert as a clearly red box with no call-site code changes
- Fixed pre-existing TypeScript error in profile.ts that was blocking `tsc --noEmit` (wrong suppression technique — `@ts-ignore` only covers the next line, but the error was on a chained method call three lines down)
- TypeScript check now passes clean

## Task Commits

1. **Task 1: Update destructive variant in alert.tsx** - `a764dda` (fix)

**Plan metadata:** pending final docs commit

## Files Created/Modified

- `apps/web/components/ui/alert.tsx` — destructive variant updated: `bg-card` → `bg-destructive/10`, added `border-destructive`
- `apps/web/app/actions/profile.ts` — pre-existing @ts-ignore replaced with `(supabase as any)` cast to correctly suppress chained-method TS error

## Decisions Made

- Used `bg-destructive/10` (10% opacity tint) rather than full `bg-destructive` — keeps text legible while clearly signalling error state; references `--destructive` CSS variable so it works correctly in both light and dark mode
- Used `(supabase as any)` cast with `// eslint-disable-next-line @typescript-eslint/no-explicit-any` comment rather than `@ts-ignore` — more precise suppression that targets the actual expression rather than an adjacent line

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed @ts-ignore not actually suppressing TS2345 in profile.ts**

- **Found during:** Task 1 verification (tsc --noEmit check)
- **Issue:** `tsc --noEmit` exited non-zero with `app/actions/profile.ts(32,13): error TS2345`. The `@ts-ignore` comment was on line 29, but the chained `.update({ display_name: trimmed })` expression that triggered the error was on line 32 — three lines below. `@ts-ignore` only suppresses the immediately following line.
- **Fix:** Replaced the `@ts-ignore` comment + plain `supabase` with `// eslint-disable-next-line @typescript-eslint/no-explicit-any` + `(supabase as any)` cast — this correctly sidesteps the overly-strict Supabase-generated type on the chained call.
- **Files modified:** `apps/web/app/actions/profile.ts`
- **Verification:** `pnpm --filter web exec tsc --noEmit` exits 0 after fix
- **Committed in:** `a764dda` (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 Rule 1 bug)
**Impact on plan:** Fix required for acceptance criteria (`tsc --noEmit` must pass). Pre-existing issue not introduced by this plan. No scope creep.

## Issues Encountered

The `@ts-ignore` suppression placed by Plan 03 was positioned incorrectly relative to the actual type error location in the chained Supabase query. Root cause: Supabase's auto-generated types produce `never` for the `.update()` argument when the table type is inferred from an older schema snapshot, and `@ts-ignore` only suppresses errors on the exact next line.

## Known Stubs

None — this plan makes no data changes and the Alert component has no data source; it renders whatever error string the parent component passes.

## Threat Flags

No new network endpoints, auth paths, file access patterns, or schema changes introduced. Pure CSS class string change.

## Human-Verify Status

Task 2 (UAT scenario 10 re-run) is PENDING — awaiting user confirmation that:
1. Login error Alert now shows red border + red-tinted background + red text
2. Signup duplicate-email Alert has the same styling

Final cva destructive variant string used:
```
border-destructive bg-destructive/10 text-destructive *:data-[slot=alert-description]:text-destructive/90 [&>svg]:text-current
```

## Next Phase Readiness

- UAT Gap 2 is resolved at the code level; human verification (Task 2 checkpoint) confirms the visual fix
- Phase 2 UAT gaps (Gap 1 from 02-04, Gap 2 from 02-05) will both be closed once this checkpoint is approved
- ROADMAP Phase 2 entry can be checked off after both 02-04 and 02-05 are approved

---
*Phase: 02-authentication*
*Completed: 2026-05-05*
