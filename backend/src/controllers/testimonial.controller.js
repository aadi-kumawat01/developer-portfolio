import Testimonial from "../models/Testimonial.js";
import { getNextOrder, isValidId, isValidOrder } from "../utils/cms.js";

const textFields = ["role", "initials", "avatarPublicId"];
const adminAllowedFields = new Set([
  "name", "role", "review", "rating", "initials", "avatarUrl", "avatarPublicId",
  "order", "visible", "status",
]);
const visitorAllowedFields = new Set(["name", "email", "role", "rating", "review", "website"]);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function makeInitials(name) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

function validText(value, field, { required = false, max = 0, min = 0 } = {}) {
  if (typeof value !== "string") return { error: `${field} must be a string` };
  const text = value.trim();
  if (required && !text) return { error: `${field} is required` };
  if (min && text.length < min) return { error: `${field} must be at least ${min} characters` };
  if (max && text.length > max) return { error: `${field} must be ${max} characters or fewer` };
  return { value: text };
}

function getTestimonialUpdates(body, isNew = false) {
  for (const field of Object.keys(body)) {
    if (!adminAllowedFields.has(field)) return { error: `${field} is not supported` };
  }
  const updates = {};
  let name;
  if ("name" in body) {
    const result = validText(body.name, "name", { required: true, max: 80 });
    if (result.error) return result;
    name = result.value;
    updates.name = name;
  } else if (isNew) return { error: "name is required" };

  if ("review" in body) {
    const result = validText(body.review, "review", { required: true, max: 1500 });
    if (result.error) return result;
    updates.review = result.value;
  } else if (isNew) return { error: "review is required" };

  for (const field of textFields) {
    if (field in body) {
      const result = validText(body[field], field, { max: field === "role" ? 100 : 200 });
      if (result.error) return result;
      updates[field] = result.value;
    }
  }
  if ("avatarUrl" in body) {
    const result = validText(body.avatarUrl, "avatarUrl", { max: 2000 });
    if (result.error) return result;
    if (result.value && !isHttpUrl(result.value)) return { error: "avatarUrl must be a valid http or https URL" };
    updates.avatarUrl = result.value;
  }
  if ("rating" in body) {
    if (!Number.isInteger(body.rating) || body.rating < 1 || body.rating > 5) return { error: "rating must be an integer from 1 to 5" };
    updates.rating = body.rating;
  }
  if ("order" in body) {
    if (!isValidOrder(body.order)) return { error: "order must be a number" };
    updates.order = body.order;
  }
  if ("visible" in body) {
    if (typeof body.visible !== "boolean") return { error: "visible must be a boolean" };
    updates.visible = body.visible;
  }
  if ("status" in body) {
    if (!["pending", "approved", "rejected"].includes(body.status)) return { error: "status must be pending, approved or rejected" };
    updates.status = body.status;
    updates.moderatedAt = body.status === "pending" ? undefined : new Date();
  }
  if (isNew && !("initials" in updates)) updates.initials = makeInitials(name);
  if (!Object.keys(updates).length) return { error: "No valid testimonial fields provided" };
  return { updates };
}

function publicFields(testimonial) {
  return {
    _id: testimonial._id,
    name: testimonial.name,
    role: testimonial.role,
    review: testimonial.review,
    rating: testimonial.rating,
    initials: testimonial.initials,
    avatarUrl: testimonial.avatarUrl,
    order: testimonial.order,
  };
}

export async function getPublicTestimonials(req, res) {
  const testimonials = await Testimonial.find({
    visible: true,
    $or: [
      { status: "approved" },
      { status: { $exists: false }, submittedByVisitor: { $ne: true } },
    ],
  }).sort({ order: 1, createdAt: 1 }).lean();
  res.json({ success: true, data: testimonials.map(publicFields) });
}

export async function createVisitorTestimonial(req, res) {
  const body = req.body || {};
  for (const field of Object.keys(body)) {
    if (!visitorAllowedFields.has(field)) return res.status(400).json({ success: false, message: `${field} is not supported` });
  }
  const website = validText(body.website ?? "", "website", { max: 200 });
  if (website.error) return res.status(400).json({ success: false, message: website.error });
  if (website.value) return res.json({ success: true, message: "Thanks for your feedback." });

  const name = validText(body.name, "name", { required: true, max: 80 });
  const email = validText(body.email, "email", { required: true, max: 254 });
  const role = validText(body.role ?? "", "role", { max: 100 });
  const review = validText(body.review, "review", { required: true, min: 20, max: 1500 });
  if (name.error || email.error || role.error || review.error) {
    return res.status(400).json({ success: false, message: name.error || email.error || role.error || review.error });
  }
  if (!emailPattern.test(email.value)) return res.status(400).json({ success: false, message: "email must be valid" });
  if (body.rating !== undefined && (!Number.isInteger(body.rating) || body.rating < 1 || body.rating > 5)) {
    return res.status(400).json({ success: false, message: "rating must be an integer from 1 to 5" });
  }

  await Testimonial.create({
    name: name.value,
    submitterEmail: email.value.toLowerCase(),
    role: role.value,
    review: review.value,
    rating: body.rating,
    initials: makeInitials(name.value),
    order: 0,
    visible: false,
    status: "pending",
    submittedByVisitor: true,
  });
  return res.status(201).json({ success: true, message: "Thanks for your feedback. Your review will appear after approval." });
}

export async function getAdminTestimonials(req, res) {
  const testimonials = await Testimonial.find().select("+submitterEmail").sort({ order: 1, createdAt: 1 }).lean();
  const data = testimonials.map((item) => ({ ...item, status: item.status || "approved", submittedByVisitor: item.submittedByVisitor || false }));
  res.json({ success: true, data });
}

export async function createTestimonial(req, res) {
  const { updates, error } = getTestimonialUpdates(req.body || {}, true);
  if (error) return res.status(400).json({ success: false, message: error });
  if (!("order" in updates)) updates.order = await getNextOrder(Testimonial);
  updates.status ||= "approved";
  updates.submittedByVisitor = false;
  if (updates.status === "approved" && !("visible" in updates)) updates.visible = true;
  if (updates.status !== "approved") updates.visible = false;
  const testimonial = await Testimonial.create(updates);
  return res.status(201).json({ success: true, message: "Testimonial created", data: testimonial });
}

export async function updateTestimonial(req, res) {
  if (!isValidId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid testimonial id" });
  const { updates, error } = getTestimonialUpdates(req.body || {});
  if (error) return res.status(400).json({ success: false, message: error });
  const current = await Testimonial.findById(req.params.id);
  if (!current) return res.status(404).json({ success: false, message: "Testimonial not found" });
  if (updates.status === "approved") {
    updates.visible = true;
    if (current.submittedByVisitor && !current.order && !("order" in updates)) updates.order = await getNextOrder(Testimonial);
  }
  if (updates.status === "pending" || updates.status === "rejected") updates.visible = false;
  const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true }).select("+submitterEmail");
  return res.json({ success: true, message: "Testimonial updated", data: testimonial });
}

export async function deleteTestimonial(req, res) {
  if (!isValidId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid testimonial id" });
  const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
  if (!testimonial) return res.status(404).json({ success: false, message: "Testimonial not found" });
  return res.json({ success: true, message: "Testimonial deleted" });
}
