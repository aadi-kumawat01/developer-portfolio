import { Router } from "express";
import {
  createTestimonial,
  deleteTestimonial,
  getAdminTestimonials,
  updateTestimonial,
} from "../controllers/testimonial.controller.js";
import { requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.use(requireAdmin);
router.get("/", getAdminTestimonials);
router.post("/", createTestimonial);
router.patch("/:id", updateTestimonial);
router.delete("/:id", deleteTestimonial);

export default router;
