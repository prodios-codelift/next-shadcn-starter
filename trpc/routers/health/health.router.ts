import { baseProcedure, createTRPCRouter } from '@/trpc/init'

import { healthHelloSchema } from './health.input'
import { getHealthHello } from './health.service'

export const healthRouter = createTRPCRouter({
  hello: baseProcedure
    .input(healthHelloSchema.nullish())
    .query(({ input }) => getHealthHello(input?.name)),
})
