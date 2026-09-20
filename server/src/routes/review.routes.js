import { Router } from "express";

import {
  getReviewsByProductController,
  getReviewByIdController,
  createReviewController,
} from "../controllers/review.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.get(
  "/product/:productId",
  getReviewsByProductController
);

router.get(
  "/:id",
  getReviewByIdController
);

router.post(
  "/",
  authenticate,
  createReviewController
);

export default router;