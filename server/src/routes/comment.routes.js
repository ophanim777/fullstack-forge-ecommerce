import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { createComment } from "../controllers/comment.controller.js";

const router = Router();

router.post("/posts/:id/comments", authenticate, createComment);

export default router;