import { Router } from "express";
import {
  createProject,
  deleteProject,
  getAdminProject,
  getAdminProjects,
  updateProject,
} from "../controllers/project.controller.js";
import { requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.use(requireAdmin);
router.get("/", getAdminProjects);
router.post("/", createProject);
router.get("/:id", getAdminProject);
router.patch("/:id", updateProject);
router.delete("/:id", deleteProject);

export default router;
