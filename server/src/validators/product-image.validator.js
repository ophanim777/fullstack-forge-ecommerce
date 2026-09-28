import { z } from "zod";

export const createProductImageSchema = z.object({
  productId: z.string().min(1, "productId wajib diisi."),
  url: z.string().url("url harus berupa URL yang valid."),
});