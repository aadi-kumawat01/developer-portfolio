import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import healthRouter from "./routes/health.routes.js";
import { notFound } from "./middleware/notFound.middleware.js";
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/health", healthRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
