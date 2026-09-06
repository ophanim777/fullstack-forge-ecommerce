import { Router } from "express";

import {
  getProductsController,
  createProductController,
} from "../controllers/product.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/admin.middleware.js";

const router = Router();

router.get("/", getProductsController);

router.post(
  "/",
  authenticate,
  requireAdmin,
  createProductController
);

export default router;