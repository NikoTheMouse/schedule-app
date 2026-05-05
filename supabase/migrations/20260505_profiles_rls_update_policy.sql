-- Phase 02-authentication / Plan 04: profiles RLS policies (UAT Gap 1 fix).
--
-- Problem (from 02-UAT.md):
--   updateDisplayName silently succeeds with 0 rows written. Supabase RLS
--   filters out rows that don't match any UPDATE policy and returns no error;
--   the server action sees `{ data: null, error: null }` and returns `{ ok: true }`.
--   The layout then reads the still-NULL display_name and falls back to user.email.
--
-- Fix:
--   1. Ensure RLS is enabled on public.profiles (no-op if already enabled).
--   2. Add a SELECT policy so a user can read their own row (the layout depends on this).
--   3. Add an UPDATE policy so a user can update only their own row.
--   4. Backfill display_name for any existing user whose profile row was created
--      before the handle_new_user trigger could populate it (e.g. test accounts
--      created during the email-confirmation-enabled window per 02-UAT.md note on test 3).
--
-- Idempotency: every statement is guarded so re-running the migration is safe.

-- 1. Ensure RLS is enabled. `enable row level security` is idempotent — running it
--    on an already-enabled table is a no-op.
alter table public.profiles enable row level security;

-- 2. SELECT policy: a user can read their own profile row.
--    Drop-then-create makes this idempotent.
drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
  on public.profiles
  for select
  to authenticated
  using (id = (select auth.uid()));

-- 3. UPDATE policy: a user can update their own profile row.
--    USING controls which rows are visible to the UPDATE; WITH CHECK ensures
--    the new row still belongs to the same user (prevents a user from
--    rewriting their id to point at someone else).
drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles
  for update
  to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- 4. Backfill display_name for any existing profile row where it is NULL.
--    Pulls from auth.users.raw_user_meta_data (the same source the trigger
--    reads on INSERT). Rows where the metadata is also missing remain NULL.
--    This runs server-side in the Supabase SQL context and bypasses RLS
--    (the SQL editor / migration runner uses the service role).
update public.profiles p
set display_name = u.raw_user_meta_data ->> 'display_name'
from auth.users u
where p.id = u.id
  and p.display_name is null
  and (u.raw_user_meta_data ->> 'display_name') is not null
  and length(trim(u.raw_user_meta_data ->> 'display_name')) > 0;
