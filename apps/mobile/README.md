# MouseTime mobile (v2)

> **Status: placeholder.** This folder exists so the monorepo is shaped for v2 from day one. No mobile code ships in v1.

## Plan

The mobile client is planned for v2. It will be a React Native app built with [Expo](https://expo.dev) and Expo Router, sharing as much code as possible with `apps/web`.

### What will live here

- `app/` — Expo Router file-based routing, mirroring the structure of `apps/web/app/`
- `components/` — Mobile-native components built with [NativeWind](https://www.nativewind.dev) (Tailwind for React Native) and React Native primitives
- `package.json` — `name: "mobile"`, depends on `@repo/db` and `@repo/lib` via `workspace:*`

### What will be reused from v1

- **`@repo/db`** — All Supabase access lives in this package (CLAUDE.md architecture constraint). The mobile client will consume the same query functions, types, and Supabase client factories that the web client uses.
  - One refactor needed: `createSupabaseServerClient()` currently imports `next/headers`. For mobile, it will be factored to accept a cookies adapter so React Native can plug in its own session storage (AsyncStorage / SecureStore). See `packages/db/src/client.ts` for the current shape.
- **`@repo/lib`** — Shared utilities (date helpers, overlap calculation) work identically on web and mobile.

### v2 requirements (from `.planning/REQUIREMENTS.md`)

- **MOB-02** — React Native / Expo app with Expo Router
- **MOB-03** — Mobile app imports `@repo/db` and `@repo/lib` — no data layer migration needed
- **MOB-04** — UI rebuilt with NativeWind + React Native components
- **MOB-05** — Feature parity with web app

### Why a placeholder now?

Reserving `apps/mobile/` from day one ensures the `pnpm-workspace.yaml` glob (`apps/*`) discovers it, and that all architecture decisions in v1 (especially the "all Supabase access through `@repo/db`" rule) are made with mobile in mind. Adding the mobile app later becomes a matter of running `npx create-expo-app@latest .` inside this folder, not refactoring the data layer.

## Roadmap

See `.planning/ROADMAP.md` for the full phase plan. The mobile app starts after v1 ships (Phases 1, 2, 3 complete).
