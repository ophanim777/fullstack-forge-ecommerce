import { z } from "zod";

export const createCommentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Komentar tidak boleh kosong.")
    .max(500, "Komentar maksimal 500 karakter."),
});

export const updateCommentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Komentar tidak boleh kosong.")
    .max(500, "Komentar maksimal 500 karakter."),
});