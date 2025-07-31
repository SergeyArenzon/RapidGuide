import { z } from 'zod';

const SubCategorySchema = z.object({
    id: z.uuid(),
    name: z.string(),
    description: z.string()
});



const CategorySchema = z.object({
    id: z.uuid(),
    name: z.string(),
    description: z.string(),
    subcategories: z.array(SubCategorySchema)
});


const ISOSchema = z.object({
  code: z.string(),
  name: z.string(),
})

export { CategorySchema };