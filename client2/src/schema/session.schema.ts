import z from "zod"

const sessionSchema = z.object({
  id: z.string(),
  token: z.string(),
  expiresAt: z.coerce.date().transform((date) => date.toISOString()),
  createdAt: z.coerce.date().transform((date) => date.toISOString()),
  updatedAt: z.coerce.date().transform((date) => date.toISOString()),
  ipAddress: z.string(),
  userAgent: z.string(),
  userId: z.string(),
})

export { sessionSchema }

