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

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Membuat post baru
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: Halo Odin Book!
 *     responses:
 *       201:
 *         description: Post berhasil dibuat
 *       401:
 *         description: Unauthorized
 */
router.post("/", authenticate, createPost);

router.post("/:id/like", authenticate, likePost);

router.patch("/:id", authenticate, updatePost);

router.delete("/:id", authenticate, deletePost);

export default router;