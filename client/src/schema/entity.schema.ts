import { z } from "zod";

const EntitySchema = z.object({
    id: z.uuid(),
    created_at: z.string().transform((val) => new Date(val)),
    updated_at: z.string().transform((val) => new Date(val)),
});

export { EntitySchema };