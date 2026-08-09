import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { updateUserProfile } from "../controllers/user.controller.js";
import { upload } from "../middleware/upload.middleware.js";
import { uploadAvatar } from "../controllers/user.controller.js";
import { getUserProfile } from "../controllers/user.controller.js";

const router = Router();

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