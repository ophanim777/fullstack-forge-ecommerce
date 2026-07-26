import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { createComment, getCommentsByPost, updateCommentById, deleteCommentById, } from "../controllers/comment.controller.js";

const router = Router();


/**
 * @swagger
 * /posts/{id}/comments:
 *   post:
 *     summary: Membuat komentar pada post
 *     tags:
 *       - Comments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: cmrrz0wku0000ssyn9v01kozu
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
 *                 example: Komentar pertama saya.
 *     responses:
 *       201:
 *         description: Komentar berhasil dibuat
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Post tidak ditemukan
 */
router.post("/posts/:id/comments", authenticate, createComment);



/**
 * @swagger
 * /posts/{id}/comments:
 *   get:
 *     summary: Mendapatkan semua komentar pada sebuah post
 *     tags:
 *       - Comments
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: cmrrz0wku0000ssyn9v01kozu
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan daftar komentar
 *       404:
 *         description: Post tidak ditemukan
 */
router.get(
  "/posts/:id/comments",
  getCommentsByPost
);



/**
 * @swagger
 * /comments/{id}:
 *   patch:
 *     summary: Mengubah komentar
 *     tags:
 *       - Comments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: cms18ko2a000064ynb87neaip
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
 *                 example: Komentar ini sudah saya edit.
 *     responses:
 *       200:
 *         description: Komentar berhasil diperbarui
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Tidak memiliki akses
 *       404:
 *         description: Komentar tidak ditemukan
 */
router.patch(
  "/comments/:id",
  authenticate,
  updateCommentById
);



/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     summary: Menghapus komentar
 *     tags:
 *       - Comments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: cms18ko2a000064ynb87neaip
 *     responses:
 *       200:
 *         description: Komentar berhasil dihapus
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Tidak memiliki akses
 *       404:
 *         description: Komentar tidak ditemukan
 */
router.delete(
  "/comments/:id",
  authenticate,
  deleteCommentById
);
export default router;