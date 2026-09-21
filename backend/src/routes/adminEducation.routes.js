import { Router } from "express";
import {
  createEducation,
  deleteEducation,
  getAdminEducation,
  updateEducation,
} from "../controllers/education.controller.js";
import { requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.use(requireAdmin);
router.get("/", getAdminEducation);
router.post("/", createEducation);
router.patch("/:id", updateEducation);
router.delete("/:id", deleteEducation);

export default router;
