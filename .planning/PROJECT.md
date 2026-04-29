# MouseTime

## What This Is

A group availability scheduling app — users create a group, invite members by email, define a date range to poll, and each member logs in to fill in when they're free. The app surfaces overlapping availability so the group can find the best time. Think When2meet, but with real user accounts and persistent groups.

## Core Value

Show a group exactly when everyone (or most people) are free, with the least friction possible.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] User can create an account and log in via Supabase Auth (email/password or magic link)
- [ ] Authenticated user can create a named group and invite members by email
- [ ] Group members can log in and fill in their availability for a given date range
- [ ] App shows an overlap view (heatmap or ranked list) of when members are free
- [ ] All data access goes through `@repo/db` — no Supabase imports in UI components
- [ ] Turborepo monorepo with pnpm workspaces, TypeScript throughout
- [ ] `packages/db` exports Supabase client, all query functions, and TypeScript types
- [ ] `packages/lib` exports shared utility functions and business logic
- [ ] `apps/web` is a full Next.js 14+ App Router app wired to the shared packages
- [ ] `apps/mobile` is a placeholder folder with README describing v2 Expo plan

### Out of Scope

- React Native / Expo mobile app — deferred to v2; placeholder folder only in v1
- `packages/ui` shared component library — optional, not required for v1
- Calendar sync (Google Calendar, iCal) — out of scope for v1
- SMS or push notifications — out of scope for v1
- Public/anonymous participation (no-login links) — all participants must have accounts

## Context

- The monorepo is structured so the mobile app in v2 can import `@repo/db` and `@repo/lib` without any data-layer migration — the decoupling is intentional from day one.
- Supabase handles both Auth and PostgreSQL. The SSR-compatible Supabase client lives in `packages/db` so Next.js server components can use it safely.
- shadcn/ui + Tailwind CSS is scoped to `apps/web` only. The shared `packages/ui` is optional and not a v1 priority.
- pnpm is the package manager; Turborepo manages build/lint/type-check pipelines across the monorepo.

## Constraints

- **Architecture**: No Supabase imports inside `apps/web` components — all queries go through `@repo/db` — enforced from day one so v2 mobile can share the same data layer
- **Package manager**: pnpm workspaces — not npm or yarn
- **Framework**: Next.js 14+ with App Router only — no Pages Router
- **Auth**: Supabase Auth for all users — creator and participants both require accounts

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| All participants must log in | Persistent group membership, named availability entries, no anonymous string-matching | — Pending |
| Supabase client lives in `packages/db` only | Enables v2 mobile to share the data layer without refactoring | — Pending |
| `packages/ui` is optional for v1 | Avoid premature abstraction before knowing what components are truly shared | — Pending |
| apps/mobile is placeholder only in v1 | Ship web first, validate product, then build native | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-29 after initialization*
