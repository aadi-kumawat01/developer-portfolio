import { Router } from "express";
import { downloadPublicResume, getPublicResume } from "../controllers/resume.controller.js";

const router = Router();
router.get("/", getPublicResume);
router.get("/download", downloadPublicResume);
export default router;
