import { TRPCError } from '@trpc/server'
import { initTRPC } from '@trpc/server'
import superjson from 'superjson'

type SessionUser = {
  id: string
  name?: string | null
  email?: string | null
}

/**
 * Accepts `headers` so it can be reused in both the RSC server caller
 * (pass `next/headers`) and the API route handler (pass request headers).
 *
 * Wire `session` / `user` here when auth is added.
 */
export const createTRPCContext = async (opts: { headers: Headers }) => {
  return {
    session: null as { id: string } | null,
    user: null as SessionUser | null,
    headers: opts.headers,
  }
}

const t = initTRPC
  .context<Awaited<ReturnType<typeof createTRPCContext>>>()
  .create({
    /**
     * @see https://trpc.io/docs/server/data-transformers
     */
    transformer: superjson,
  })

export const createTRPCRouter = t.router
export const createCallerFactory = t.createCallerFactory
export const baseProcedure = t.procedure
export const middleware = t.middleware

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user?.id) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be signed in to access this resource.',
    })
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  })
})
