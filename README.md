# Next.js template

This is a Next.js template with shadcn/ui, tRPC, and PostgreSQL via Drizzle ORM.

## Database

1. Copy `.env.example` to `.env` and set `DATABASE_URL`.
2. After schema changes, generate and apply migrations:

```bash
bun run db:generate
bun run db:migrate
```

Schema lives in `src/db/schema/`. The Drizzle client is `src/db/index.ts`.

## Adding components

To add components to your app, run the following command:

```bash
npx shadcn@latest add button
```

This will place the ui components in the `src/components` directory.

## Using components

To use the components in your app, import them as follows:

```tsx
import { Button } from '@/components/ui/button'
```
