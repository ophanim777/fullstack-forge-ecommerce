import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { getHomeFeed } from "../controllers/feed.controller.js";

const router = Router();

router.get(
  "/feed",
  authenticate,
  getHomeFeed
);

export default router;