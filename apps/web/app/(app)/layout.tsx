/**
 * Layout for the protected (app) route group. Phase 2 will:
 *   - Read the Supabase session via createSupabaseServerClient()
 *   - Redirect unauthenticated users to /login (AUTH-04)
 *   - Render a header with logout button + display name (PROF-01)
 *
 * Phase 1 ships the layout shell only.
 */
export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div data-route-group="app">{children}</div>;
}
