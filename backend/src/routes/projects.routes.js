import { Router } from "express";
import {
  getFeaturedProjects,
  getPublicProject,
  getPublicProjects,
} from "../controllers/project.controller.js";

const router = Router();

router.get("/", getPublicProjects);
router.get("/featured", getFeaturedProjects);
router.get("/:slug", getPublicProject);

export default router;
