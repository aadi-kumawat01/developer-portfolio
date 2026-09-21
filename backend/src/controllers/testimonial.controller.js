import Testimonial from "../models/Testimonial.js";
import { getNextOrder, isValidId, isValidOrder } from "../utils/cms.js";

const textFields = ["role", "initials"];
const allowedFields = new Set([
  "name",
  "role",
  "review",
  "rating",
  "initials",
  "avatarUrl",
  "order",
  "visible",
]);

function isHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function makeInitials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function getTestimonialUpdates(body, isNew = false) {
  for (const field of Object.keys(body)) {
    if (!allowedFields.has(field)) {
      return { error: `${field} is not supported` };
    }
  }

  const updates = {};
  let name;

  if ("name" in body) {
    if (typeof body.name !== "string" || !body.name.trim()) {
      return { error: "name is required" };
    }

    name = body.name.trim();
    updates.name = name;
  } else if (isNew) {
    return { error: "name is required" };
  }

  if ("review" in body) {
    if (typeof body.review !== "string" || !body.review.trim()) {
      return { error: "review is required" };
    }

    updates.review = body.review.trim();
  } else if (isNew) {
    return { error: "review is required" };
  }

  for (const field of textFields) {
    if (field in body) {
      if (typeof body[field] !== "string") {
        return { error: `${field} must be a string` };
      }

      updates[field] = body[field].trim();
    }
  }

  if ("avatarUrl" in body) {
    if (typeof body.avatarUrl !== "string") {
      return { error: "avatarUrl must be a string" };
    }

    const avatarUrl = body.avatarUrl.trim();

    if (avatarUrl && !isHttpUrl(avatarUrl)) {
      return { error: "avatarUrl must be a valid http or https URL" };
    }

    updates.avatarUrl = avatarUrl;
  }

  if ("rating" in body) {
    if (
      typeof body.rating !== "number" ||
      !Number.isFinite(body.rating) ||
      body.rating < 1 ||
      body.rating > 5
    ) {
      return { error: "rating must be a number from 1 to 5" };
    }

    updates.rating = body.rating;
  }

  if ("order" in body) {
    if (!isValidOrder(body.order)) {
      return { error: "order must be a number" };
    }

    updates.order = body.order;
  }

  if ("visible" in body) {
    if (typeof body.visible !== "boolean") {
      return { error: "visible must be a boolean" };
    }

    updates.visible = body.visible;
  }

  if (isNew && !("initials" in updates)) {
    updates.initials = makeInitials(name);
  }

  if (!Object.keys(updates).length) {
    return { error: "No valid testimonial fields provided" };
  }

  return { updates };
}

export async function getPublicTestimonials(req, res) {
  const testimonials = await Testimonial.find({ visible: true }).sort({
    order: 1,
    createdAt: 1,
  });

  res.json({ success: true, data: testimonials });
}

export async function getAdminTestimonials(req, res) {
  const testimonials = await Testimonial.find().sort({ order: 1, createdAt: 1 });

  res.json({ success: true, data: testimonials });
}

export async function createTestimonial(req, res) {
  const { updates, error } = getTestimonialUpdates(req.body || {}, true);

  if (error) {
    return res.status(400).json({ success: false, message: error });
  }

  if (!("order" in updates)) {
    updates.order = await getNextOrder(Testimonial);
  }

  const testimonial = await Testimonial.create(updates);

  return res.status(201).json({
    success: true,
    message: "Testimonial created",
    data: testimonial,
  });
}

export async function updateTestimonial(req, res) {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid testimonial id" });
  }

  const { updates, error } = getTestimonialUpdates(req.body || {});

  if (error) {
    return res.status(400).json({ success: false, message: error });
  }

  const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });

  if (!testimonial) {
    return res.status(404).json({ success: false, message: "Testimonial not found" });
  }

  return res.json({
    success: true,
    message: "Testimonial updated",
    data: testimonial,
  });
}

export async function deleteTestimonial(req, res) {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid testimonial id" });
  }

  const testimonial = await Testimonial.findByIdAndDelete(req.params.id);

  if (!testimonial) {
    return res.status(404).json({ success: false, message: "Testimonial not found" });
  }

  return res.json({ success: true, message: "Testimonial deleted" });
}
