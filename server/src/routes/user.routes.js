import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";
import {
  updateUserProfile,
  uploadAvatar,
  getUserProfile,
  getCurrentUser,
} from "../controllers/user.controller.js";

const router = Router();

router.get("/me", authenticate, getCurrentUser);

router.get(
  "/profile/:username",
  getUserProfile
);

router.put("/profile", authenticate, updateUserProfile);

router.post(
  "/avatar",
  authenticate,
  upload.single("avatar"),
  uploadAvatar
);

export default router;