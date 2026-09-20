import { Router } from "express";

import { getCartController, addCartItemController, } from "../controllers/cart.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.get(
  "/",
  authenticate,
  getCartController
);

router.post(
  "/items",
  authenticate,
  addCartItemController
);

export default router;