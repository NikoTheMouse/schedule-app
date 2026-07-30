# AGENTS.md

## Cursor Cloud specific instructions

MouseTime is a pnpm + Turborepo monorepo. The only runnable app is `apps/web`
(Next.js 15 App Router). `apps/mobile` is a v2 placeholder with no code. The data
layer (`@repo/db`) talks to Supabase (Auth + Postgres).

### Services & how to run them

Standard commands live in the root `README.md` / `package.json` (`pnpm dev`,
`pnpm build`, `pnpm lint`, `pnpm typecheck`). The non-obvious part is that the app
needs a running Supabase backend, provided locally by the Supabase CLI + Docker.

Bring-up order (services are NOT started by the update script — start them
manually each session):

1. Start the Docker daemon (needed by the Supabase CLI). `/etc/docker/daemon.json`
   is already configured for this VM (`fuse-overlayfs` + containerd-snapshotter
   disabled, required for Docker 29 here). Run `sudo dockerd` (e.g. in a tmux
   session) and, once up, `sudo chmod 666 /var/run/docker.sock` so non-root can
   reach it.
2. `supabase start` (run from repo root) boots Postgres/Auth/Studio and applies
   `supabase/migrations` on first start. Copy the printed `API URL` and `anon key`
   (or re-print later with `supabase status`) into `apps/web/.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key from supabase status>
   ```
   `.env.local` is gitignored, so it must exist on the VM (it persists in the
   snapshot; recreate from `supabase status` if missing). `@repo/db` throws a
   clear error if these vars are missing.
3. `pnpm dev` starts the web app at http://localhost:3000.

Useful local endpoints: Studio http://127.0.0.1:54323, Mailpit (captures signup
emails) http://127.0.0.1:54324, Postgres `postgresql://postgres:postgres@127.0.0.1:54322/postgres`.
Local auth has email confirmation disabled, so signup logs in immediately.

### Non-obvious caveats / gotchas

- `supabase db reset` is broken in the installed CLI (2.110.0): it errors with
  "Could not find the supabase-go binary". Use `supabase start` for the initial
  apply and `supabase migration up` to apply newly-added migrations to the
  running DB. To inspect/patch the DB directly:
  `docker exec supabase_db_workspace psql -U postgres -d postgres`.
- Migration filenames must be unique 14-digit timestamps (`YYYYMMDDHHMMSS_*.sql`);
  duplicate/short version prefixes make `supabase start` roll back the whole apply.
- Newer Supabase Postgres images no longer auto-grant table privileges to
  `anon`/`authenticated` on new `public` tables. Migrations that only add RLS
  policies will still fail with `42501 permission denied` unless the tables are
  explicitly granted SELECT/INSERT/UPDATE/DELETE (see
  `supabase/migrations/20260503000000_*` and `..._grant_table_privileges.sql`,
  which were added to make the local DB usable).

### Known pre-existing issues (repo is mid-Phase-3; do not treat as env problems)

- `pnpm lint`, `pnpm typecheck`, and the ESLint step of `pnpm build` fail on
  pre-existing violations in in-progress code (unescaped entities, `no-explicit-any`,
  a Supabase `.insert()` type mismatch). `next build` still compiles successfully;
  `pnpm dev` is unaffected.
- Group create/join/availability flows hit a pre-existing RLS bug: `createGroup`
  does `insert().select()` on `groups` before the creator is a member, but the
  `groups` SELECT policy requires membership, so PostgREST raises `42501`. Signup,
  login/logout, and profile editing work end-to-end.
