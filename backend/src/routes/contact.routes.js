import { Router } from "express";
import { getPublicContact, sendContactMessage } from "../controllers/contact.controller.js";
import { contactMessageRateLimit } from "../middleware/rateLimit.middleware.js";

const router = Router();

router.get("/", getPublicContact);
router.post("/send", contactMessageRateLimit, sendContactMessage);

export default router;
