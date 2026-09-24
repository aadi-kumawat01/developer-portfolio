import { Router } from "express";
import { getAdminResume, updateAdminResume } from "../controllers/resume.controller.js";
import { requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();
router.get("/", requireAdmin, getAdminResume);
router.patch("/", requireAdmin, updateAdminResume);
export default router;
