import { Router } from "express";
import {
  deleteCloudinaryImage,
  deleteCloudinaryResume,
  uploadResumeToCloudinary,
  uploadImageToCloudinary,
} from "../controllers/upload.controller.js";
import { requireAdmin } from "../middleware/auth.middleware.js";
import { uploadImage, uploadResume } from "../middleware/upload.middleware.js";

const router = Router();

router.use(requireAdmin);
router.post("/image", uploadImage, uploadImageToCloudinary);
router.delete("/image", deleteCloudinaryImage);
router.post("/resume", uploadResume, uploadResumeToCloudinary);
router.delete("/resume", deleteCloudinaryResume);

export default router;
