/**
 * SSR-compatible Supabase client factories.
 *
 * - `createSupabaseBrowserClient()` — for Client Components only.
 * - `createSupabaseServerClient()` — for Server Components, Server Actions, Route Handlers.
 *   MUST be called inside a request scope (not at module top level) because it reads
 *   from `next/headers` cookies(), which is request-scoped.
 *
 * Source: supabase.com/docs/guides/auth/server-side/creating-a-client
 */
import { createBrowserClient, createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. ` +
        `Copy .env.example to apps/web/.env.local and fill in your Supabase project values.`
    );
  }
  return value;
}

/**
 * Create a Supabase client suitable for Client Components.
 * Reads `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from env.
 */
export function createSupabaseBrowserClient(): SupabaseClient<Database> {
  return createBrowserClient<Database>(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
  );
}

/**
 * Create a Supabase client suitable for Server Components, Server Actions, and Route Handlers.
 * MUST be called inside a request scope.
 */
export async function createSupabaseServerClient(): Promise<SupabaseClient<Database>> {
  const cookieStore = await cookies();
  return createServerClient<Database>(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Components cannot mutate cookies — silently ignored.
            // Cookie writes succeed in Server Actions and Route Handlers.
          }
        },
      },
    }
  );
}
