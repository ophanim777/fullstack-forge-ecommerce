import { ApiError } from "../utils/apiError.js";

export function requireAdmin(req, res, next) {
  if (!req.user) {
    return next(new ApiError(401, "Authentication diperlukan."));
  }

  if (req.user.role !== "ADMIN") {
    return next(new ApiError(403, "Akses hanya untuk admin."));
  }

  next();
}