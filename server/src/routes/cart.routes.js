import { Router } from "express";

import { getCartController } from "../controllers/cart.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.get(
  "/",
  authenticate,
  getCartController
);

export default router;