# Requirements: MouseTime

**Defined:** 2026-04-29
**Core Value:** Show a group exactly when everyone (or most people) are free, with the least friction possible.

## v1 Requirements

### Monorepo Infrastructure

- [ ] **MONO-01**: Turborepo + pnpm workspace config at root with TypeScript throughout
- [ ] **MONO-02**: `turbo.json` pipeline for build, lint, and type-check across all packages
- [ ] **MONO-03**: Root `README.md` explaining monorepo structure and v2 mobile plan
- [ ] **MONO-04**: `.env.example` with all required Supabase environment variables

### packages/db

- [x] **DB-01**: SSR-compatible Supabase client setup (works in Next.js server components and route handlers)
- [x] **DB-02**: All TypeScript types and interfaces matching the DB schema
- [x] **DB-03**: Group query functions — `getGroup`, `createGroup`, `getGroupMembers`
- [x] **DB-04**: Availability query functions — `getUserAvailability`, `setAvailability`, `getGroupAvailability`
- [x] **DB-05**: Exported as `@repo/db` — importable by `apps/web` and future `apps/mobile`

### packages/lib

- [x] **LIB-01**: Shared utility functions (date helpers, overlap calculation logic)
- [x] **LIB-02**: Exported as `@repo/lib`

### Authentication

- [ ] **AUTH-01**: User can create an account with email and password via Supabase Auth
- [x] **AUTH-02**: User can log in and stay logged in across sessions
- [ ] **AUTH-03**: User can log out from any page
- [ ] **AUTH-04**: Protected routes redirect unauthenticated users to login

### Profile

- [ ] **PROF-01**: User sets a display name on signup — shown in groups and availability views instead of email
- [ ] **PROF-02**: User can change their display name later from a profile settings page

### Groups

- [ ] **GRP-01**: Authenticated user can create a named group
- [ ] **GRP-02**: Group has a shareable join code — anyone with the code can join the group
- [ ] **GRP-03**: Group creator can regenerate the join code to invalidate old links
- [ ] **GRP-04**: Group creator sets date range permission on creation ("Only creator" or "Any member") — can be changed later
- [ ] **GRP-05**: User can view all groups they belong to

### Availability

- [ ] **AVAIL-01**: Authorized member(s) can add a date range to poll availability for
- [ ] **AVAIL-02**: Group member can fill in which days/times they're free within the date range
- [ ] **AVAIL-03**: Member can update their availability after submitting

### Overlap View

- [ ] **OVL-01**: Group members can see overlapping availability as a heatmap or ranked list
- [ ] **OVL-02**: View shows how many members are free at each time slot

### Mobile Placeholder

- [ ] **MOB-01**: `apps/mobile/` folder exists with a README explaining the v2 Expo plan

## v2 Requirements

### Mobile App

- **MOB-02**: React Native / Expo app with Expo Router
- **MOB-03**: Mobile app imports `@repo/db` and `@repo/lib` — no data layer migration needed
- **MOB-04**: UI rebuilt with NativeWind + React Native components
- **MOB-05**: Feature parity with web app

### packages/ui

- **UI-01**: Shared UI primitive library exportable to both web and mobile

### Enhanced Auth

- **AUTH-05**: Magic link login (passwordless)
- **AUTH-06**: Password reset via email

### Notifications

- **NOTF-01**: Email notification when someone fills in availability
- **NOTF-02**: Email notification when a new date range is added to a group

## Out of Scope

| Feature | Reason |
|---------|--------|
| Anonymous participation (no-login links) | All participants must have accounts — required for persistent group membership |
| Calendar sync (Google Calendar, iCal) | High complexity, not core to v1 value |
| SMS / push notifications | Deferred to v2+ |
| `packages/ui` shared component library | Premature abstraction before knowing what's truly shared |
| Admin / moderation tools | Not needed for v1 scope |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| MONO-01 | Phase 1 | Pending |
| MONO-02 | Phase 1 | Pending |
| MONO-03 | Phase 1 | Pending |
| MONO-04 | Phase 1 | Pending |
| DB-01 | Phase 1 | Complete |
| DB-02 | Phase 1 | Complete |
| DB-03 | Phase 1 | Complete |
| DB-04 | Phase 1 | Complete |
| DB-05 | Phase 1 | Complete |
| LIB-01 | Phase 1 | Complete |
| LIB-02 | Phase 1 | Complete |
| MOB-01 | Phase 1 | Pending |
| AUTH-01 | Phase 2 | Pending |
| AUTH-02 | Phase 2 | Complete |
| AUTH-03 | Phase 2 | Pending |
| AUTH-04 | Phase 2 | Pending |
| PROF-01 | Phase 2 | Pending |
| PROF-02 | Phase 2 | Pending |
| GRP-01 | Phase 3 | Pending |
| GRP-02 | Phase 3 | Pending |
| GRP-03 | Phase 3 | Pending |
| GRP-04 | Phase 3 | Pending |
| GRP-05 | Phase 3 | Pending |
| AVAIL-01 | Phase 3 | Pending |
| AVAIL-02 | Phase 3 | Pending |
| AVAIL-03 | Phase 3 | Pending |
| OVL-01 | Phase 3 | Pending |
| OVL-02 | Phase 3 | Pending |

**Coverage:**
- v1 requirements: 28 total
- Mapped to phases: 28 ✓
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-29*
*Last updated: 2026-04-29 after roadmap creation*
