import { Router } from "express";

import healthRoutes from "./health.routes.js";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import postRoutes from "./post.routes.js";
import commentRoutes from "./comment.routes.js";
import followRoutes from "./follow.routes.js";
import feedRoutes from "./feed.routes.js";
import notificationRoutes from "./notification.routes.js";
import productRoutes from "./product.routes.js";


const router = Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/products", productRoutes);
router.use("/posts", postRoutes);
router.use(commentRoutes);
router.use(followRoutes);
router.use(feedRoutes);
router.use(notificationRoutes);

export default router;