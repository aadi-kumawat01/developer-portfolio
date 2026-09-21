import { Router } from "express";
import { getPublicContact } from "../controllers/contact.controller.js";

const router = Router();

router.get("/", getPublicContact);

export default router;
