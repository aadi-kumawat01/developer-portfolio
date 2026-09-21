import { Router } from "express";
import {
  getAdminContact,
  updateAdminContact,
} from "../controllers/contact.controller.js";
import { requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.use(requireAdmin);
router.get("/", getAdminContact);
router.patch("/", updateAdminContact);

export default router;
