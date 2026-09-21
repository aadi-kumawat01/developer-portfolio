import { Router } from "express";
import {
  deleteCloudinaryImage,
  uploadImageToCloudinary,
} from "../controllers/upload.controller.js";
import { requireAdmin } from "../middleware/auth.middleware.js";
import { uploadImage } from "../middleware/upload.middleware.js";

const router = Router();

router.use(requireAdmin);
router.post("/image", uploadImage, uploadImageToCloudinary);
router.delete("/image", deleteCloudinaryImage);

export default router;
