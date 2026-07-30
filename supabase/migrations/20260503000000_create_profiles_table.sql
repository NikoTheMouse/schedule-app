-- Phase 01/02 base schema: the `profiles` table.
--
-- Environment-setup note: the original repository was missing the SQL that
-- creates public.profiles even though later migrations (the handle_new_user
-- trigger and the profiles RLS policies) and the application code all depend
-- on it. This migration recreates that base table so a clean database
-- (`supabase db reset`) can apply every subsequent migration successfully.
--
-- Schema mirrors the Profile interface in packages/db/src/types.ts:
--   id (uuid, PK -> auth.users.id), email, display_name (nullable),
--   created_at, updated_at.
--
-- Idempotent: guarded with "if not exists" so re-running is safe.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
