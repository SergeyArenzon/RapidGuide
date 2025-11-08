import z from "zod"

const userSchema = z.object({
    id: z.string(),
    name: z.string().nullable().optional().default(null),
    email: z.string(),
    emailVerified: z
      .union([z.boolean(), z.date(), z.null(), z.undefined()])
      .transform((value) => {
        if (value instanceof Date) {
          return true
        }
  
        return Boolean(value)
      }),
    image: z.string().nullable().optional().default(null),
    createdAt: z.coerce.date().transform((date) => date.toISOString()),
    updatedAt: z.coerce.date().transform((date) => date.toISOString()),
  })

  export { userSchema }