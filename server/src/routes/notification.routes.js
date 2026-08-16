import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import {
  getUserNotifications,
} from "../controllers/notification.controller.js";

const router = Router();

router.get(
  "/notifications",
  authenticate,
  getUserNotifications
);

export default router;