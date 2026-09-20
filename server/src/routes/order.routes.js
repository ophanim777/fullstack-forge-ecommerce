import { Router } from "express";

import {
  getOrdersController,
  getOrderByIdController,
} from "../controllers/order.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.get(
  "/",
  authenticate,
  getOrdersController
);

router.get(
  "/:id",
  authenticate,
  getOrderByIdController
);

export default router;