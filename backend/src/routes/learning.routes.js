import { Router } from "express";
import { getPublicLearning } from "../controllers/learning.controller.js";

const router = Router();

router.get("/", getPublicLearning);

export default router;
