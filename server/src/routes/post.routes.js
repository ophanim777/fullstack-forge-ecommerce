import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { optionalAuth } from "../middleware/optionalAuth.middleware.js";
import { createPost, 
    getPosts,  
    getPost, 
    updatePost, 
    deletePost, 
    likePost, } from "../controllers/post.controller.js";

const router = Router();

router.get("/", optionalAuth, getPosts);

router.get("/:id", getPost);

router.post("/", authenticate, createPost);

router.post("/:id/like", authenticate, likePost);

router.patch("/:id", authenticate, updatePost);

router.delete("/:id", authenticate, deletePost);

export default router;