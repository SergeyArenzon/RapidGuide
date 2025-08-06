import { z } from 'zod';
import { timeSchema } from './time.dto';


// Sub-category schema
const categorySchema = timeSchema.extend({
  id: z.uuid(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

// Export types
export type categoryDto = z.infer<typeof categorySchema>;

// Export schemas
export { categorySchema }; 