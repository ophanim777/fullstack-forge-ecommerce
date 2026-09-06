import { Router } from "express";

import {
  getProductsController,
  createProductController,
  getProductByIdController,
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

export default router;