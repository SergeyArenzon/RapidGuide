import { z } from 'zod';

const sessionSchema = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  token: z.string(),
  ipAddress: z.ipv4(),
  userAgent: z.string(),
  expiresAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  createdAt: z.coerce.date(),
});

export { sessionSchema };
export type SessionDto = z.infer<typeof sessionSchema>;