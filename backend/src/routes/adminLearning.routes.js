import { Router } from "express";
import {
  createLearning,
  deleteLearning,
  getAdminLearning,
  updateLearning,
} from "../controllers/learning.controller.js";
import { requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.use(requireAdmin);
router.get("/", getAdminLearning);
router.post("/", createLearning);
router.patch("/:id", updateLearning);
router.delete("/:id", deleteLearning);

export default router;
