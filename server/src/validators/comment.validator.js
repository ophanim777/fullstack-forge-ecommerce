import { z } from "zod";

export const createCommentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Komentar tidak boleh kosong.")
    .max(500, "Komentar maksimal 500 karakter."),

    parentId: z
    .string()
    .optional()
    .nullable(),
});

export const updateCommentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Komentar tidak boleh kosong.")
    .max(500, "Komentar maksimal 500 karakter."),
});