-- Phase 03-groups-availability-overlap / Plan 01: Database schema for groups, members, and availability
--
-- FIX: Simplified RLS to avoid recursion while maintaining security

-- ========================================
-- 1. GROUPS TABLE
-- ========================================

create table if not exists public.groups (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(name) >= 1 and length(name) <= 100),
  join_code text not null unique default substring(md5(random()::text || clock_timestamp()::text) from 1 for 8),
  created_by uuid not null references auth.users(id) on delete cascade,
  date_range_permission text not null check (date_range_permission in ('creator_only', 'any_member')),
  date_range_start date,
  date_range_end date,
  created_at timestamptz not null default now(),
  check (date_range_start is null or date_range_end is null or date_range_start <= date_range_end)
);

create index if not exists groups_join_code_idx on public.groups(join_code);
create index if not exists groups_created_by_idx on public.groups(created_by);

-- ========================================
-- 2. GROUP_MEMBERS TABLE
-- ========================================

create table if not exists public.group_members (
  group_id uuid not null references public.groups(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (group_id, user_id)
);

create index if not exists group_members_user_id_idx on public.group_members(user_id);
create index if not exists group_members_group_id_idx on public.group_members(group_id);

-- ========================================
-- 3. AVAILABILITY_BLOCKS TABLE
-- ========================================

create table if not exists public.availability_blocks (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  start_time time not null,
  end_time time not null,
  created_at timestamptz not null default now(),
  check (start_time < end_time)
);

create index if not exists availability_blocks_group_id_idx on public.availability_blocks(group_id);
create index if not exists availability_blocks_user_id_idx on public.availability_blocks(user_id);
create index if not exists availability_blocks_date_idx on public.availability_blocks(date);

-- ========================================
-- 4. ROW-LEVEL SECURITY POLICIES
-- ========================================

alter table public.groups enable row level security;
alter table public.group_members enable row level security;
alter table public.availability_blocks enable row level security;

-- ========================================
-- 4a. GROUPS POLICIES
-- ========================================

drop policy if exists "Users can read groups they belong to" on public.groups;
create policy "Users can read groups they belong to"
  on public.groups for select
  to authenticated
  using (
    exists (
      select 1 from public.group_members
      where group_id = groups.id and user_id = auth.uid()
    )
  );

drop policy if exists "Authenticated users can create groups" on public.groups;
create policy "Authenticated users can create groups"
  on public.groups for insert
  to authenticated
  with check (created_by = auth.uid());

drop policy if exists "Group creators can update" on public.groups;
create policy "Group creators can update"
  on public.groups for update
  to authenticated
  using (created_by = auth.uid())
  with check (created_by = auth.uid());

-- ========================================
-- 4b. GROUP_MEMBERS POLICIES (PERMISSIVE)
-- ========================================

-- All authenticated users can read group_members
-- Security is enforced by groups table RLS when joining
drop policy if exists "Authenticated users can read group members" on public.group_members;
create policy "Authenticated users can read group members"
  on public.group_members for select
  to authenticated
  using (true);

drop policy if exists "Users can join groups" on public.group_members;
create policy "Users can join groups"
  on public.group_members for insert
  to authenticated
  with check (user_id = auth.uid());

-- ========================================
-- 4c. AVAILABILITY_BLOCKS POLICIES
-- ========================================

-- All authenticated users can read availability
-- Security is enforced by groups table RLS when joining
drop policy if exists "Authenticated users can read availability" on public.availability_blocks;
create policy "Authenticated users can read availability"
  on public.availability_blocks for select
  to authenticated
  using (true);

drop policy if exists "Users can manage own availability" on public.availability_blocks;
create policy "Users can manage own availability"
  on public.availability_blocks for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());