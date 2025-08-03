import { z } from 'zod';
import { timeSchema } from '@rapid-guide-io/shared/src/dtos/time.dto';
import { guideSchema } from '@rapid-guide-io/shared';

// Base user schema
export const userSchema = timeSchema.extend({
  id: z.uuid(),
  first_name: z.string().min(1, { message: 'First name is required' }),
  last_name: z.string().min(1, { message: 'Last name is required' }),
  email: z.email({ message: 'Invalid email address' }),
  image_url: z.url({ message: 'Invalid image URL' }),
  guide: guideSchema.optional(),
});

// Schema for creating a new user - omits system-managed fields
export const createUserSchema = userSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  guide: true,
});

// Schema for updating a user - omits timestamps
export const updateUserSchema = userSchema.omit({
  created_at: true,
  updated_at: true,
});

// Export types
export type UserDto = z.infer<typeof userSchema>;
export type CreateUserDto = z.infer<typeof createUserSchema>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;