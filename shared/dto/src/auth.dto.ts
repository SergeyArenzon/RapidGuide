import { z } from 'zod';

export const authSchema = z.object({
  jwt: z.string().min(1, 'JWT token is required'),
  provider: z.enum(["google", "facebook", "apple"])
});

export type AuthDto = z.infer<typeof authSchema>;
