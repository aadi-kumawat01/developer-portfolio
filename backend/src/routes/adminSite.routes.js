import { Router } from "express";
import {
  getAdminSite,
  updateAdminSite,
} from "../controllers/site.controller.js";
import { requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", requireAdmin, getAdminSite);
router.patch("/", requireAdmin, updateAdminSite);

export default router;
