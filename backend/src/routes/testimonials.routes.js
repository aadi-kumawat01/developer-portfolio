import { Router } from "express";
import {
  createVisitorTestimonial,
  getPublicTestimonials,
} from "../controllers/testimonial.controller.js";
import { testimonialSubmissionRateLimit } from "../middleware/rateLimit.middleware.js";

const router = Router();

router.get("/", getPublicTestimonials);
router.post("/", testimonialSubmissionRateLimit, createVisitorTestimonial);

export default router;
