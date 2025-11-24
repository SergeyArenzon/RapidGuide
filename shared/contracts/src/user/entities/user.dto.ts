import { z } from 'zod';

// Base user schema

export const userSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.email({ message: 'Invalid email address' }),
  image: z.url({ message: 'Invalid image URL' }),
  emailVerified: z.boolean(),
  updatedAt: z.coerce.date(),
  createdAt: z.coerce.date(),
});

// Export types
export type UserDto = z.infer<typeof userSchema>;