-- Drop ALL existing policies on group_members to clean slate
DROP POLICY IF EXISTS "Users can read members of their groups" ON public.group_members;
DROP POLICY IF EXISTS "Authenticated users can read group members" ON public.group_members;
DROP POLICY IF EXISTS "Users can join groups" ON public.group_members;

-- Recreate with correct permissive policy
CREATE POLICY "Authenticated users can read group members"
  ON public.group_members FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can join groups"
  ON public.group_members FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());
