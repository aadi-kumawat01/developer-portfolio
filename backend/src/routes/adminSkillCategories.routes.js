import { Router } from "express";
import {
  createSkillCategory,
  deleteSkillCategory,
  getSkillCategories,
  updateSkillCategory,
} from "../controllers/skillCategory.controller.js";
import { requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.use(requireAdmin);
router.get("/", getSkillCategories);
router.post("/", createSkillCategory);
router.patch("/:id", updateSkillCategory);
router.delete("/:id", deleteSkillCategory);

export default router;
