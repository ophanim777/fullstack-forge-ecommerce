import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { createComment, getCommentsByPost, updateCommentById, deleteCommentById, } from "../controllers/comment.controller.js";

const router = Router();

router.post("/posts/:id/comments", authenticate, createComment);

router.get(
  "/posts/:id/comments",
  getCommentsByPost
);

router.patch(
  "/comments/:id",
  authenticate,
  updateCommentById
);

router.delete(
  "/comments/:id",
  authenticate,
  deleteCommentById
);
export default router;