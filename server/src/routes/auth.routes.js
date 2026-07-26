import { Router } from "express";
import { register, login, getMe, refresh, logout, } from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();


/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register user baru
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - username
 *               - email
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Ricky
 *               lastName:
 *                 type: string
 *                 example: Silaban
 *               username:
 *                 type: string
 *                 example: ricky97
 *               email:
 *                 type: string
 *                 example: ricky@gmail.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: Register berhasil
 *       400:
 *         description: Data tidak valid
 */

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);

router.get("/me", authenticate, getMe);

export default router;