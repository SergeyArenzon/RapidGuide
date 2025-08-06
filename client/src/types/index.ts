import { CategorySchema } from "@/schema/category.schema";
import { z } from "zod";

type Category = z.infer<typeof CategorySchema>;

export type { Category };