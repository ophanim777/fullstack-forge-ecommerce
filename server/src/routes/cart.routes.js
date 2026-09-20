import { Router } from "express";

import { 
  getCartController, 
  addCartItemController, 
  updateCartItemController, 
  deleteCartItemController, 
} from "../controllers/cart.controller.js";

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

router.patch(
  "/items/:itemId",
  authenticate,
  updateCartItemController
);

router.delete(
  "/items/:itemId",
  authenticate,
  deleteCartItemController
);

export default router;