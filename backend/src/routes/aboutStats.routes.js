import { Router } from "express";
import {
  createAboutStat,
  deleteAboutStat,
  getAboutStats,
  updateAboutStat,
} from "../controllers/aboutStats.controller.js";
import { requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.use(requireAdmin);
router.get("/", getAboutStats);
router.post("/", createAboutStat);
router.patch("/:id", updateAboutStat);
router.delete("/:id", deleteAboutStat);

export default router;
