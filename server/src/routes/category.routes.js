import { Router } from "express";

import {
  getCategoriesController,
  getCategoryByIdController,
} from "../controllers/category.controller.js";

const router = Router();

router.get("/", getCategoriesController);
router.get("/:id", getCategoryByIdController);

export default router;