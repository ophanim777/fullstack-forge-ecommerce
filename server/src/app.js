import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";

import routes from "./routes/index.js";
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();


app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use("/uploads", express.static(path.resolve("uploads")));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

app.use("/api", routes);
app.use(errorHandler);

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server berjalan.",
  });
});

export default app;