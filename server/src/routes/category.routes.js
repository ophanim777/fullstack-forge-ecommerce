import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/admin.middleware.js";

import {
  getCategoriesController,
  getCategoryByIdController,
  createCategoryController,
  updateCategoryController,
} from "../controllers/category.controller.js";

const router = Router();

router.get("/", getCategoriesController);
router.get("/:id", getCategoryByIdController);
router.post(
  "/",
  authenticate,
  requireAdmin,
  createCategoryController
);
router.patch(
  "/:id",
  authenticate,
  requireAdmin,
  updateCategoryController
);
export default router;