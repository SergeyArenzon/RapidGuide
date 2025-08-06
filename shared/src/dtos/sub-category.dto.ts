import { z } from 'zod';

// Base entity schema (common fields from BaseEntity)
const baseEntitySchema = z.object({
  id: z.uuid(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

// Sub-category schema
const subCategorySchema = baseEntitySchema.extend({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  category_id: z.uuid(), // For create/update operations
});

// Export types
export type SubCategoryDto = z.infer<typeof subCategorySchema>;

// Export schemas
export { subCategorySchema }; 