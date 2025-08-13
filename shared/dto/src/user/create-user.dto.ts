import z from "zod";
import { userSchema } from "./user.dto";

// Schema for creating a new user - omits system-managed fields
export const createUserSchema = userSchema.omit({
    id: true,
    created_at: true,
    updated_at: true,
    guide: true,
  });

export type CreateUserDto = z.infer<typeof createUserSchema>;