import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { followUser, getFollowersByUser,
  getFollowingByUser, } from "../controllers/follow.controller.js";

const router = Router();



/**
 * @swagger
 * /users/{id}/follow:
 *   post:
 *     summary: Follow atau Unfollow user
 *     tags:
 *       - Follow
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: cmrhtcc440000akynn5c4lhul
 *     responses:
 *       200:
 *         description: Status follow berhasil diubah
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User tidak ditemukan
 */
router.post(
  "/users/:id/follow",
  authenticate,
  followUser
);



/**
 * @swagger
 * /users/{id}/followers:
 *   get:
 *     summary: Mendapatkan daftar followers
 *     tags:
 *       - Follow
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: cmrhtcc440000akynn5c4lhul
 *     responses:
 *       200:
 *         description: Daftar followers berhasil diambil
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User tidak ditemukan
 */
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