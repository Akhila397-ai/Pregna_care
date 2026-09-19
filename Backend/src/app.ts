import express from "express";
import "reflect-metadata";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { ROUTES } from "./constants/routes.js";
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import doctorRoutes from "./routes/doctor.routes.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import { env } from "./config/env.js";
import { logger } from "./shared/logger/logger.js";

const app = express();

app.use(
  cors({
    origin: [env.FRONT_URL, "http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);

app.use((req, _res, next) => {
  logger.debug(`[HTTP] ${req.method} ${req.originalUrl}`);
  next();
});

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));

app.use(ROUTES.AUTH.BASE, authRoutes);
app.use(ROUTES.ADMIN.BASE, adminRoutes);
app.use(ROUTES.DOCTOR.BASE, doctorRoutes);
app.use(errorMiddleware);

export default app;
