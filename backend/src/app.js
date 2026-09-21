import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import aboutHighlightsRouter from "./routes/aboutHighlights.routes.js";
import aboutStatsRouter from "./routes/aboutStats.routes.js";
import adminRouter from "./routes/admin.routes.js";
import adminContactRouter from "./routes/adminContact.routes.js";
import adminSiteRouter from "./routes/adminSite.routes.js";
import adminEducationRouter from "./routes/adminEducation.routes.js";
import adminLearningRouter from "./routes/adminLearning.routes.js";
import adminProjectCategoriesRouter from "./routes/adminProjectCategories.routes.js";
import adminProjectsRouter from "./routes/adminProjects.routes.js";
import adminSkillCategoriesRouter from "./routes/adminSkillCategories.routes.js";
import adminSkillsRouter from "./routes/adminSkills.routes.js";
import adminTestimonialsRouter from "./routes/adminTestimonials.routes.js";
import educationRouter from "./routes/education.routes.js";
import contactRouter from "./routes/contact.routes.js";
import healthRouter from "./routes/health.routes.js";
import learningRouter from "./routes/learning.routes.js";
import projectCategoriesRouter from "./routes/projectCategories.routes.js";
import projectsRouter from "./routes/projects.routes.js";
import siteRouter from "./routes/site.routes.js";
import skillsRouter from "./routes/skills.routes.js";
import testimonialsRouter from "./routes/testimonials.routes.js";
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
app.use("/api/contact", contactRouter);
app.use("/api/admin/contact", adminContactRouter);
app.use("/api/site", siteRouter);
app.use("/api/admin/site", adminSiteRouter);
app.use("/api/admin/about-stats", aboutStatsRouter);
app.use("/api/admin/about-highlights", aboutHighlightsRouter);
app.use("/api/education", educationRouter);
app.use("/api/admin/education", adminEducationRouter);
app.use("/api/learning", learningRouter);
app.use("/api/admin/learning", adminLearningRouter);
app.use("/api/skills", skillsRouter);
app.use("/api/admin/skill-categories", adminSkillCategoriesRouter);
app.use("/api/admin/skills", adminSkillsRouter);
app.use("/api/project-categories", projectCategoriesRouter);
app.use("/api/admin/project-categories", adminProjectCategoriesRouter);
app.use("/api/projects", projectsRouter);
app.use("/api/admin/projects", adminProjectsRouter);
app.use("/api/testimonials", testimonialsRouter);
app.use("/api/admin/testimonials", adminTestimonialsRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
