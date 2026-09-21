import { Router } from "express";
import {
  createSkill,
  deleteSkill,
  getAdminSkills,
  updateSkill,
} from "../controllers/skill.controller.js";
import { requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.use(requireAdmin);
router.get("/", getAdminSkills);
router.post("/", createSkill);
router.patch("/:id", updateSkill);
router.delete("/:id", deleteSkill);

export default router;
