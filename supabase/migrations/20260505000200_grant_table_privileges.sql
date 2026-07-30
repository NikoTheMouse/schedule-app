-- Environment-compat migration: grant table-level data privileges to the
-- `anon` and `authenticated` roles for the public schema.
--
-- Why this is needed:
--   The Phase-3 schema migration enables Row-Level Security and defines RLS
--   policies, but never issues table-level GRANTs. On hosted Supabase (and on
--   older Postgres images) new tables in `public` were automatically granted
--   SELECT/INSERT/UPDATE/DELETE to anon/authenticated via default privileges,
--   so RLS was the only visible gate. Newer Supabase Postgres images tightened
--   those default privileges — new tables now only receive TRUNCATE/TRIGGER/
--   REFERENCES, which makes every PostgREST query fail with
--   `42501: permission denied for table ...` even though RLS policies exist.
--
--   This migration restores the classic behaviour by explicitly granting the
--   data privileges. Row visibility is still fully controlled by the RLS
--   policies defined in the other migrations.
--
-- Idempotent: GRANT is naturally idempotent, and ALTER DEFAULT PRIVILEGES can
-- be re-run safely.

grant usage on schema public to anon, authenticated;

grant select, insert, update, delete
  on all tables in schema public
  to anon, authenticated;

grant usage, select
  on all sequences in schema public
  to anon, authenticated;

-- Ensure any future tables/sequences created by the postgres role in public
-- keep working without a manual grant.
alter default privileges in schema public
  grant select, insert, update, delete on tables to anon, authenticated;

alter default privileges in schema public
  grant usage, select on sequences to anon, authenticated;
