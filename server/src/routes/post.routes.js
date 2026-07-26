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

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Mendapatkan semua post
 *     tags:
 *       - Posts
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan daftar post
 */
router.get("/", optionalAuth, getPosts);

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Mendapatkan detail post
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: cmrrz0wku0000ssyn9v01kozu
 *     responses:
 *       200:
 *         description: Detail post berhasil diambil
 *       404:
 *         description: Post tidak ditemukan
 */
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

/**
 * @swagger
 * /posts/{id}/like:
 *   post:
 *     summary: Like atau Unlike sebuah post
 *     tags:
 *       - Likes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Berhasil mengubah status like
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Post tidak ditemukan
 */
router.post("/:id/like", authenticate, likePost);

router.patch("/:id", authenticate, updatePost);

router.delete("/:id", authenticate, deletePost);

export default router;