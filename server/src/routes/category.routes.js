import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/admin.middleware.js";

import {
  getCategoriesController,
  getCategoryByIdController,
  createCategoryController,
  updateCategoryController,
  deleteCategoryController,
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

router.delete(
  "/:id",
  authenticate,
  requireAdmin,
  deleteCategoryController
);
export default router;