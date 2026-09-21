import cloudinary, { isCloudinaryConfigured } from "../config/cloudinary.js";

const uploadFolders = {
  about: "portfolio/about",
  "project-thumbnail": "portfolio/projects/thumbnails",
  "project-screenshot": "portfolio/projects/screenshots",
  "testimonial-avatar": "portfolio/testimonials",
};

function uploadBuffer(buffer, folder) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        fetch_format: "auto",
        quality: "auto",
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      },
    );

    stream.end(buffer);
  });
}

export async function uploadImageToCloudinary(req, res) {
  const folder = uploadFolders[req.body.type];

  if (!folder) {
    return res.status(400).json({ success: false, message: "Invalid upload type" });
  }

  if (!req.file) {
    return res.status(400).json({ success: false, message: "Image file is required" });
  }

  if (!isCloudinaryConfigured()) {
    return res.status(500).json({
      success: false,
      message: "Cloudinary is not configured",
    });
  }

  try {
    const result = await uploadBuffer(req.file.buffer, folder);

    return res.status(201).json({
      success: true,
      message: "Image uploaded successfully",
      data: {
        url: result.secure_url,
        publicId: result.public_id,
      },
    });
  } catch {
    return res.status(502).json({
      success: false,
      message: "Image upload failed",
    });
  }
}

export async function deleteCloudinaryImage(req, res) {
  const { publicId } = req.body || {};

  if (typeof publicId !== "string" || !publicId.startsWith("portfolio/")) {
    return res.status(400).json({
      success: false,
      message: "publicId must belong to the portfolio folder",
    });
  }

  if (!isCloudinaryConfigured()) {
    return res.status(500).json({
      success: false,
      message: "Cloudinary is not configured",
    });
  }

  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: "image" });

    return res.json({ success: true, message: "Image deleted successfully" });
  } catch {
    return res.status(502).json({
      success: false,
      message: "Image deletion failed",
    });
  }
}
