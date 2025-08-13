import { z } from 'zod';

export const ProviderUserDto = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.email('Invalid email format'),
  image_url: z.string().url('Invalid URL format')
});

export type ProviderUserDto = z.infer<typeof ProviderUserDto>;
