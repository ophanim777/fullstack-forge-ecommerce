import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/admin.middleware.js";

import {
  getProductImagesController,
  getProductImageByIdController,
  createProductImageController,
  deleteProductImageController,
} from "../controllers/product-image.controller.js";

const router = Router();

router.get(
  "/product/:productId",
  getProductImagesController
);

router.get(
  "/:id",
  getProductImageByIdController
);

router.post(
  "/",
  authenticate,
  requireAdmin,
  createProductImageController
);

router.delete(
  "/:id",
  authenticate,
  requireAdmin,
  deleteProductImageController
);

export default router;