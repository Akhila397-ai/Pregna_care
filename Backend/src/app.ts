import express from 'express'
import 'reflect-metadata'
import { ROUTES } from './constants/routes.js';
import authRoutes from './routes/auth.routes.js';
import cors from 'cors';
import cookieParser from "cookie-parser";
import { errorMiddleware } from './middleware/error.middleware.js';
import adminRoutes from './routes/admin.routes.js'

const app = express();
app.use(
  cors({
    origin:[ "http://localhost:5173",
      "http://localhost:5174",
    ],

    credentials: true,
  })
);
app.use(express.json())
app.use(cookieParser());
app.use(ROUTES.AUTH.BASE,authRoutes);
app.use(ROUTES.ADMIN.BASE,adminRoutes);
app.use(errorMiddleware)




export default app;
