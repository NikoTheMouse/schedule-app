# MouseTime

A group availability scheduling app — users create a group, invite members by email, define a date range, and each member fills in when they're free. The app surfaces overlapping availability so the group can find the best time. Think When2meet, but with real user accounts and persistent groups.

**Core value:** Show a group exactly when everyone (or most people) are free, with the least friction possible.

## Monorepo layout

```
MouseTime/
├── apps/
│   ├── web/         # Next.js 15 App Router web app (v1)
│   └── mobile/      # Placeholder for v2 React Native / Expo app
├── packages/
│   ├── db/          # @repo/db — all Supabase access (clients, types, queries)
│   ├── lib/         # @repo/lib — shared utilities (date helpers, overlap calc)
│   └── typescript-config/  # @repo/typescript-config — shared tsconfig bases
├── turbo.json       # Turborepo task pipeline
├── pnpm-workspace.yaml
└── package.json
```

## Architecture constraints

- **All Supabase access lives in `packages/db`.** No `@supabase/*` imports in `apps/web` components — enforced from day one so v2 mobile can share the same data layer.
- **pnpm workspaces only.** Not npm or yarn. The `workspace:*` protocol is used for internal package references.
- **Next.js App Router only.** No Pages Router.
- **TypeScript everywhere.** Shared base tsconfig in `packages/typescript-config`.

## Tech stack

- Turborepo 2.x — task orchestration and caching
- pnpm 10.x — package manager + workspaces
- Next.js 15.x — App Router web framework
- TypeScript 6.x
- Supabase Auth + Postgres — via `@supabase/ssr`

## Getting started

Prerequisites:
- Node.js >= 20
- Corepack enabled

```bash
corepack enable
corepack prepare pnpm@10.33.2 --activate
pnpm install
```

Common commands:

```bash
pnpm dev         # Start all dev servers (Turborepo)
pnpm build       # Build all packages and apps
pnpm lint        # Lint all packages
pnpm typecheck   # Type-check all packages
```

## Environment variables

Copy `.env.example` to `apps/web/.env.local` and fill in your Supabase project values. Never commit `.env`, `.env.local`, or `.env*.local`.

## v2 mobile plan

`apps/mobile/` is a placeholder for a future React Native / Expo client. It will share the data layer (`@repo/db`) and shared utilities (`@repo/lib`) with the web app — no data layer migration needed. UI will be rebuilt with NativeWind + React Native components, and Expo Router will mirror the App Router structure. See `apps/mobile/README.md` for the full plan.

## Phase status

- Phase 1: Monorepo Scaffold — in progress
- Phase 2: Authentication — pending
- Phase 3: Groups, Availability & Overlap — pending

See `.planning/ROADMAP.md` for full roadmap.
