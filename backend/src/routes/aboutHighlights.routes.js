import { Router } from "express";
import {
  createAboutHighlight,
  deleteAboutHighlight,
  getAboutHighlights,
  updateAboutHighlight,
} from "../controllers/aboutHighlights.controller.js";
import { requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.use(requireAdmin);
router.get("/", getAboutHighlights);
router.post("/", createAboutHighlight);
router.patch("/:id", updateAboutHighlight);
router.delete("/:id", deleteAboutHighlight);

export default router;
