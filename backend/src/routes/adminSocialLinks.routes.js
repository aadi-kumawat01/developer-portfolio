import { Router } from "express";
import {
  createSocialLink,
  deleteSocialLink,
  getAdminSocialLinks,
  updateSocialLink,
} from "../controllers/socialLink.controller.js";
import { requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.use(requireAdmin);
router.get("/", getAdminSocialLinks);
router.post("/", createSocialLink);
router.patch("/:id", updateSocialLink);
router.delete("/:id", deleteSocialLink);

export default router;
