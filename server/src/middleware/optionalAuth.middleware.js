import { verifyToken } from "../utils/jwt.js";

export function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next();
  }

  if (!authHeader.startsWith("Bearer ")) {
    return next();
  }

  try {
    const token = authHeader.split(" ")[1];

    req.user = verifyToken(token);
  } catch {}

  next();
}