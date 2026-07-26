import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { followUser } from "../controllers/follow.controller.js";

const router = Router();

router.post(
  "/users/:id/follow",
  authenticate,
  followUser
);

export default router;