import { Router } from "express";
import {
  getPublicProject,
  getPublicProjects,
} from "../controllers/project.controller.js";

const router = Router();

router.get("/", getPublicProjects);
router.get("/:slug", getPublicProject);

export default router;
