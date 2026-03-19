import express from 'express'
import authRoutes from './routes/auth.routes.js';
import cors from 'cors';
import cookieParser from "cookie-parser";
import { errorMiddleware } from './middleware/error.middleware.js';



const app = express();
app.use(express.json())
app.use(cookieParser());
app.use(cors())
app.use("/api/auth",authRoutes);
app.use(errorMiddleware)




export default app;
