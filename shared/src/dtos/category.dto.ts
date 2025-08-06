import { z } from 'zod';
import { timeSchema } from './time.dto';

// Base schema for category fields
const categorySchema = timeSchema.extend({
  id: z.uuid(),
  name: z.string().min(1, 'Name is required'),
  description: z.string(),
});


// Types derived from schemas
export type CategoryDto = z.infer<typeof categorySchema>;