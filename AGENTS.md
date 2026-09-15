<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- intent-skills:start -->
# Skill mappings - when working in these areas, load the linked skill file into context.
skills:
  - task: "Backend / server — tRPC routers and procedures, services, inputs; Drizzle schema and migrations"
    load: ".agents/skills/backend/SKILL.md"
  - task: "Frontend — page layout, UI patterns, component placement"
    load: ".agents/skills/frontend/SKILL.md"
<!-- intent-skills:end -->

## Project-specific conventions

- **Frontend and route/UI structure:** `.agents/skills/frontend/SKILL.md` and its `references/*`.
- **Backend, tRPC, and Drizzle:** `.agents/skills/backend/SKILL.md` and its `references/*`.

<!-- BEGIN:formatting -->
## Formatting and linting

- Use **oxfmt** for formatting and **oxlint** for linting (not Prettier / ESLint).
- After installing any shadcn component, run `bun format`.
- After making any codebase change, run `bun format` before finishing.
- Lint with `bun lint` (`oxlint --fix`). Check formatting with `bun format:check`.
<!-- END:formatting -->

<!-- BEGIN:drizzle-schema-workflow -->
## Drizzle schema workflow

- **DO NOT** manually edit, add, delete, rename, move, copy, paste, split, or merge any files under `src/db/migrations/`.
- After changing `src/db/schema/`, run `bun run db:generate` then `bun run db:migrate` immediately. Do **not** wait for the user to review or confirm.
- Place all DB seed scripts under `src/db/seed/` (do not create seed scripts outside `src/db/`).
<!-- END:drizzle-schema-workflow -->
