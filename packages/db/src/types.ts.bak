/**
 * Phase 1 minimal schema — only `profiles` is required for Phase 2 (auth).
 * Group, GroupMember, and AvailabilityBlock are forward-declared so query stubs
 * compile; their actual SQL tables are created in Phase 3.
 *
 * Decisions:
 *   D-01: Phase 1 schema is minimal (auth only).
 *   D-02: profiles links to Supabase auth.users by id.
 *   D-03: Availability is stored as continuous time blocks (start_time, end_time).
 */

export interface Profile {
  id: string; // uuid — references auth.users.id
  email: string;
  display_name: string | null;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

export interface Group {
  id: string;
  name: string;
  join_code: string;
  created_by: string; // user id
  date_range_permission: "creator_only" | "any_member";
  created_at: string;
}

export interface GroupMember {
  group_id: string;
  user_id: string;
  joined_at: string;
}

/**
 * Continuous time block (D-03). One row = "I'm free from start_time to end_time on `date`".
 */
export interface AvailabilityBlock {
  id: string;
  group_id: string;
  user_id: string;
  date: string; // "YYYY-MM-DD"
  start_time: string; // "HH:MM:SS"
  end_time: string; // "HH:MM:SS"
}

/**
 * Database type map — compatible with the @supabase/supabase-js generic.
 * Phase 1 only `profiles` is real; the rest are typed stubs for Phase 3.
 */
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "created_at" | "updated_at">;
        Update: Partial<Omit<Profile, "id" | "created_at">>;
      };
      groups: {
        Row: Group;
        Insert: Omit<Group, "id" | "created_at">;
        Update: Partial<Omit<Group, "id" | "created_at">>;
      };
      group_members: {
        Row: GroupMember;
        Insert: GroupMember;
        Update: never;
      };
      availability_blocks: {
        Row: AvailabilityBlock;
        Insert: Omit<AvailabilityBlock, "id">;
        Update: Partial<Omit<AvailabilityBlock, "id" | "group_id" | "user_id">>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
