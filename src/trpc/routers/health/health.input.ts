import * as z from 'zod'

export const healthHelloSchema = z.object({
  name: z.string().trim().min(1).max(64).optional(),
})
