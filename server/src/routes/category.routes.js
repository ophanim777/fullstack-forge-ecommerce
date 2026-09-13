import { Router } from "express";

import {
  getCategoriesController,
  getCategoryByIdController,
  createCategoryController,
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

export default router;