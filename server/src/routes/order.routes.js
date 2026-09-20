import { Router } from "express";

import {
  getOrdersController,
  getOrderByIdController,
  createOrderController,
  updateOrderStatusController,
} from "../controllers/order.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";

import { requireAdmin } from "../middleware/admin.middleware.js";

const router = Router();

router.get(
  "/",
  authenticate,
  getOrdersController
);

router.post(
  "/",
  authenticate,
  createOrderController
);

router.get(
  "/:id",
  authenticate,
  getOrderByIdController
);

router.patch(
  "/:id/status",
  authenticate,
  requireAdmin,
  updateOrderStatusController
);

export default router;