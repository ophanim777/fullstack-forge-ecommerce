import { Router } from "express";

import {
  getProductsController,
  createProductController,
} from "../controllers/product.controller.js";

const router = Router();

router.get("/", getProductsController);

router.post("/", createProductController);

export default router;