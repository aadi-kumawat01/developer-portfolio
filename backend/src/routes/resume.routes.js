import { Router } from "express";
import { getPublicResume } from "../controllers/resume.controller.js";

const router = Router();
router.get("/", getPublicResume);
export default router;
