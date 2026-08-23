import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import {
  getUserNotifications,
  markNotificationAsRead,
} from "../controllers/notification.controller.js";

const router = Router();

router.get(
  "/notifications",
  authenticate,
  getUserNotifications
);

router.patch(
  "/notifications/:id/read",
  authenticate,
  markNotificationAsRead
);

export default router;