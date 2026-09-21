import multer from "multer";

const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter(req, file, callback) {
    if (allowedMimeTypes.has(file.mimetype)) {
      callback(null, true);
      return;
    }

    const error = new Error("Only JPEG, PNG, and WebP images are allowed");
    error.statusCode = 400;
    callback(error);
  },
}).single("image");

export function uploadImage(req, res, next) {
  upload(req, res, (error) => {
    if (!error) {
      next();
      return;
    }

    const message = error.code === "LIMIT_FILE_SIZE"
      ? "Image must be 5 MB or smaller"
      : error.message;

    res.status(400).json({ success: false, message });
  });
}
