import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import aboutHighlightsRouter from "./routes/aboutHighlights.routes.js";
import aboutStatsRouter from "./routes/aboutStats.routes.js";
import adminRouter from "./routes/admin.routes.js";
import adminSiteRouter from "./routes/adminSite.routes.js";
import healthRouter from "./routes/health.routes.js";
import siteRouter from "./routes/site.routes.js";
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
app.use("/api/admin", adminRouter);
app.use("/api/site", siteRouter);
app.use("/api/admin/site", adminSiteRouter);
app.use("/api/admin/about-stats", aboutStatsRouter);
app.use("/api/admin/about-highlights", aboutHighlightsRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
