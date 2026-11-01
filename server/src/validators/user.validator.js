
import { z } from "zod";

export const updateProfileSchema = z.object({
  firstName: z.string().trim().min(2).max(50),

  lastName: z.string().trim().min(2).max(50),

  phone: z.string().trim().max(20).optional(),

  address: z.string().trim().max(500).optional(),

  city: z.string().trim().max(100).optional(),

  bio: z
    .string()
    .trim()
    .max(500)
    .optional(),

  avatar: z
    .string()
    .url()
    .optional(),
});
