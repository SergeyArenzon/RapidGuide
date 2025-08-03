import { z } from 'zod';
import { timeSchema } from '../time.dto';
import { guideSchema } from '../guide/guide.dto';

// Base user schema
export const userSchema = timeSchema.extend({
  id: z.uuid(),
  first_name: z.string().min(1, { message: 'First name is required' }),
  last_name: z.string().min(1, { message: 'Last name is required' }),
  email: z.email({ message: 'Invalid email address' }),
  image_url: z.url({ message: 'Invalid image URL' }),
  guide: guideSchema.optional(),
});

// Export types
export type UserDto = z.infer<typeof userSchema>;