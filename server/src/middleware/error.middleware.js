import { ZodError } from "zod";
import { MulterError } from "multer";

import { ApiError } from "../utils/apiError.js";

export function errorHandler(err, req, res, next) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      errors: err.issues,
    });
  }

  if (err instanceof MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "Ukuran avatar maksimal 2 MB.",
      });
    }

    return res.status(400).json({
      success: false,
      message: "Upload file avatar gagal.",
    });
  }

  if (err.message === "INVALID_AVATAR_TYPE") {
    return res.status(400).json({
      success: false,
      message: "Format avatar harus JPG, PNG, atau WebP.",
    });
  }

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  console.error(err);

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
}