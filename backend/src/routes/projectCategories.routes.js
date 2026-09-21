import { Router } from "express";
import { getPublicProjectCategories } from "../controllers/projectCategory.controller.js";

const router = Router();

router.get("/", getPublicProjectCategories);

export default router;
