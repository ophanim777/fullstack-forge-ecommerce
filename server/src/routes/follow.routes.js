import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { followUser, getFollowersByUser,
  getFollowingByUser, } from "../controllers/follow.controller.js";

const router = Router();

router.post(
  "/users/:id/follow",
  authenticate,
  followUser
);

router.get(
  "/users/:id/followers",
  authenticate,
  getFollowersByUser
);

router.get(
  "/users/:id/following",
  authenticate,
  getFollowingByUser
);

export default router;