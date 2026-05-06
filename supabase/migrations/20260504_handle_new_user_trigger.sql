-- Phase 02-authentication / Plan 01: profile auto-creation trigger.
-- Source: supabase.com/docs/guides/auth/managing-user-data
--
-- Why a trigger and not a server action:
--   If profile creation is a separate INSERT after auth.signUp(), a failure
--   between the two leaves an orphaned auth user with no profile row. A trigger
--   is transactional with the auth.users insert.
--
-- The display_name column is NULLABLE in the profiles table. The application
-- (signup form, D-08) enforces non-empty display_name; this trigger trusts the
-- caller to have validated.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'display_name'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
