import type { Profile } from "@repo/db";

/**
 * Landing page. Imports a type from @repo/db as a Phase 1 smoke test —
 * if this file typechecks and builds, cross-package type resolution is wired correctly.
 * Phase 2 will replace this with a real landing / redirect to (app)/groups.
 */
export default function HomePage() {
  // Reference the Profile type to prove cross-package type resolution works.
  // Cast through unknown so TypeScript does not narrow to `never` when the
  // value is null at runtime — the type annotation is the test, not the value.
  const _profileShape = null as unknown as Profile | null;

  return (
    <main>
      <h1>MouseTime</h1>
      <p>
        Group availability scheduling — when is everyone free? Coming together in
        Phase 2 (authentication) and Phase 3 (groups + availability).
      </p>
      {_profileShape !== null && <span>{_profileShape.email}</span>}
    </main>
  );
}
