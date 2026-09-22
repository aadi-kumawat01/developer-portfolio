import { Router } from "express";
import {
  getCurrentAdmin,
  login,
  logout,
} from "../controllers/admin.controller.js";
import { requireAdmin } from "../middleware/auth.middleware.js";
import { loginRateLimit } from "../middleware/rateLimit.middleware.js";

const router = Router();

router.post("/login", loginRateLimit, login);
router.post("/logout", logout);
router.get("/me", requireAdmin, getCurrentAdmin);

export default router;
