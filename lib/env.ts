import { createEnv } from '@t3-oss/env-nextjs'
import * as z from 'zod'

/** Docker/build often set `VAR=` (empty); treat as unset so Zod defaults apply. */
function emptyEnvAsUndefined(value: string | undefined) {
  if (value === undefined || value.trim() === '') return undefined
  return value
}

export const env = createEnv({
  server: {
    DATABASE_URL: z.union([z.string().startsWith('postgresql://'), z.url()]),
  },
  client: {},
  runtimeEnv: {
    DATABASE_URL: emptyEnvAsUndefined(process.env.DATABASE_URL),
  },
  skipValidation:
    process.env.SKIP_ENV_VALIDATION === 'true' ||
    process.env.NODE_SCRIPT === 'build',
})
