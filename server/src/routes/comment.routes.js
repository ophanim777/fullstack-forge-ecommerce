import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { createComment, getCommentsByPost, } from "../controllers/comment.controller.js";

const router = Router();

router.post("/posts/:id/comments", authenticate, createComment);

router.get(
  "/posts/:id/comments",
  getCommentsByPost
);

export default router;