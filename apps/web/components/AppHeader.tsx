import Link from "next/link";
import { LogoutButton } from "@/components/LogoutButton";

export interface AppHeaderProps {
  displayName: string;
}

/**
 * Phase 3 header: app name + nav links on left, display name + logout on right.
 */
export function AppHeader({ displayName }: AppHeaderProps) {
  // Truncate display name at 24 chars with ellipsis (UI-SPEC).
  const shown =
    displayName.length > 24 ? `${displayName.slice(0, 24)}...` : displayName;

  return (
    <header className="sticky top-0 z-10 h-14 w-full border-b bg-card">
      <div className="mx-auto flex h-full max-w-5xl items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <Link href="/groups" className="font-semibold">
            MouseTime
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/groups" className="text-sm hover:text-primary transition-colors">
              Groups
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/profile" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Profile
          </Link>
          <span className="text-sm text-muted-foreground" title={displayName}>
            {shown}
          </span>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}