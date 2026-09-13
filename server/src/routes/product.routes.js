import { Router } from "express";

import {
  getProductsController,
  createProductController,
  getProductByIdController,
  updateProductController,
  deleteProductController,
} from "../controllers/product.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/admin.middleware.js";

const router = Router();

router.get("/", getProductsController);

router.get("/:id", getProductByIdController);

router.post(
  "/",
  authenticate,
  requireAdmin,
  createProductController
);

router.patch(
  "/:id",
  authenticate,
  requireAdmin,
  updateProductController
);

router.delete(
  "/:id",
  authenticate,
  requireAdmin,
  deleteProductController
);

export default router;