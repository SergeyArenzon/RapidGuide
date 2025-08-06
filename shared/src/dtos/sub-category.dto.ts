import { z } from 'zod';
import { timeSchema } from './time.dto';

// Sub-category schema
const subCategorySchema = timeSchema.extend({
  id: z.uuid(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  category_id: z.uuid(), // For create/update operations
});

// Export types
export type SubCategoryDto = z.infer<typeof subCategorySchema>;

// Export schemas
export { subCategorySchema }; 