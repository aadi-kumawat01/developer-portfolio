import { Router } from "express";
import {
  createProjectCategory,
  deleteProjectCategory,
  getProjectCategories,
  updateProjectCategory,
} from "../controllers/projectCategory.controller.js";
import { requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.use(requireAdmin);
router.get("/", getProjectCategories);
router.post("/", createProjectCategory);
router.patch("/:id", updateProjectCategory);
router.delete("/:id", deleteProjectCategory);

export default router;
