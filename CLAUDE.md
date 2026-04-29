<!-- GSD:project-start source:PROJECT.md -->
## Project

**MouseTime**

A group availability scheduling app — users create a group, invite members by email, define a date range to poll, and each member logs in to fill in when they're free. The app surfaces overlapping availability so the group can find the best time. Think When2meet, but with real user accounts and persistent groups.

**Core Value:** Show a group exactly when everyone (or most people) are free, with the least friction possible.

### Constraints

- **Architecture**: No Supabase imports inside `apps/web` components — all queries go through `@repo/db` — enforced from day one so v2 mobile can share the same data layer
- **Package manager**: pnpm workspaces — not npm or yarn
- **Framework**: Next.js 14+ with App Router only — no Pages Router
- **Auth**: Supabase Auth for all users — creator and participants both require accounts
<!-- GSD:project-end -->

<!-- GSD:stack-start source:STACK.md -->
## Technology Stack

Technology stack not yet documented. Will populate after codebase mapping or first phase.
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->
## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, or `.github/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
