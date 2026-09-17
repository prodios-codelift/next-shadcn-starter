---
name: mock-data
description: >-
  Creates typed mock data for this wireframe app. Default: types and seed
  data in src/data/*.mock.ts. When the user asks for a UI that edits data,
  persist to src/data/*.mock.json. Use when building screens, features,
  forms, tables, lists, or any UI that needs sample data.
---

# Mock data

This app is a wireframe. Invent realistic mock data; do not call a real backend.

## Default (read-only screens)

Colocate **types and seed data** in `src/data/<entity>.mock.ts`. Use proper TypeScript types. No `any`. Reuse existing mock modules; do not duplicate datasets.

```ts
// src/data/users.mock.ts
export type User = { id: string; name: string; email: string }
export const users: User[] = [
  { id: "u1", name: "Ada Lovelace", email: "ada@example.com" },
]
```

## Editable UI

When the user asks for a UI that **edits** the data:

- Move the array to `src/data/<entity>.mock.json`.
- Keep types and a typed JSON import in the matching `*.mock.ts`.
- `resolveJsonModule` is already on in `tsconfig.json`.

```ts
import usersJson from "./users.mock.json"

export type User = { id: string; name: string; email: string }
export const users: User[] = usersJson
```
