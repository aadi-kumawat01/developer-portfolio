import { Router } from "express";
import { getPublicSite } from "../controllers/site.controller.js";

const router = Router();

router.get("/", getPublicSite);

export default router;
