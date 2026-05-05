# Roadmap: MouseTime

## Overview

Three phases take MouseTime from an empty repo to a working group availability scheduler. Phase 1 builds the entire monorepo scaffold so every future line of code lands in the right place. Phase 2 wires up authentication so users can securely access the app. Phase 3 delivers the full product — groups, availability entry, and the overlap view that is the core value.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Monorepo Scaffold** - Turborepo + pnpm workspace with packages/db, packages/lib, apps/web, and apps/mobile placeholder all wired up
- [ ] **Phase 2: Authentication** - Users can create accounts, log in, and stay logged in; protected routes enforced
- [ ] **Phase 3: Groups, Availability & Overlap** - Authenticated users can create groups, fill in availability, and see the overlap view

## Phase Details

### Phase 1: Monorepo Scaffold
**Goal**: The full monorepo structure exists, all packages export correctly, and `turbo build` runs clean
**Depends on**: Nothing (first phase)
**Requirements**: MONO-01, MONO-02, MONO-03, MONO-04, DB-01, DB-02, DB-03, DB-04, DB-05, LIB-01, LIB-02, MOB-01
**Success Criteria** (what must be TRUE):
  1. `pnpm install` at root succeeds and all workspace packages resolve
  2. `turbo build` completes without errors across all packages
  3. `apps/web` can import `@repo/db` and `@repo/lib` — TypeScript resolves the types
  4. `packages/db` exports a working Supabase client, all query stubs, and TypeScript types matching the schema
  5. `apps/mobile/` folder exists with a README describing the v2 Expo plan
**Plans**: 3 plans
- [x] 01-01-PLAN.md — Workspace foundation: Turborepo + pnpm + shared tsconfig + root docs (MONO-01..04)
- [x] 01-02-PLAN.md — @repo/db and @repo/lib packages with Supabase clients, types, and stubs (DB-01..05, LIB-01..02)
- [x] 01-03-PLAN.md — apps/web Next.js scaffold with (auth)/(app) route groups + apps/mobile placeholder (MOB-01)

### Phase 2: Authentication
**Goal**: Users can securely create accounts and log in; the app protects all routes that require a session
**Depends on**: Phase 1
**Requirements**: AUTH-01, AUTH-02, AUTH-03, AUTH-04, PROF-01, PROF-02
**Success Criteria** (what must be TRUE):
  1. User can create an account with email and password and set a display name on signup
  2. User can log in and remain logged in across browser sessions (session persists on refresh)
  3. User can log out from any page and is redirected to the login screen
  4. Visiting a protected route while unauthenticated redirects to the login page
  5. User can change their display name from a profile settings page
**Plans**: 3 plans
- [ ] 02-01-PLAN.md — Tailwind v4 + shadcn install, Sonner Toaster mount, handle_new_user trigger SQL
- [ ] 02-02-PLAN.md — signIn/signUp/signOut server actions and login + signup pages (AUTH-01, AUTH-02, PROF-01)
- [ ] 02-03-PLAN.md — Landing page, (app) layout auth guard with header, profile settings (AUTH-03, AUTH-04, PROF-02)
**UI hint**: yes

### Phase 3: Groups, Availability & Overlap
**Goal**: A logged-in user can create a group, invite others, record availability, and see when the group is free
**Depends on**: Phase 2
**Requirements**: GRP-01, GRP-02, GRP-03, GRP-04, GRP-05, AVAIL-01, AVAIL-02, AVAIL-03, OVL-01, OVL-02
**Success Criteria** (what must be TRUE):
  1. Authenticated user can create a named group and receive a shareable join code
  2. User with a join code can join the group; group creator can regenerate the code
  3. Authorized member(s) can add a date range to the group to poll availability for
  4. Group member can fill in their availability for the date range and update it later
  5. All group members can view the overlap heatmap or ranked list showing how many members are free at each slot
**Plans**: TBD
**UI hint**: yes

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Monorepo Scaffold | 2/3 | In Progress|  |
| 2. Authentication | 1/5 | In Progress|  |
| 3. Groups, Availability & Overlap | 0/? | Not started | - |
