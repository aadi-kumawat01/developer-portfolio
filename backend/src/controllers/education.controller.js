import Education from "../models/Education.js";
import { getNextOrder, isValidId, isValidOrder } from "../utils/cms.js";

const textFields = [
  "type",
  "institution",
  "college",
  "university",
  "board",
  "startDate",
  "endDate",
  "yearLabel",
  "marksLabel",
  "status",
  "badgeText",
  "description",
];

function getEducationUpdates(body, isNew = false) {
  const updates = {};

  if ("title" in body) {
    if (typeof body.title !== "string" || !body.title.trim()) {
      return { error: "title is required" };
    }

    updates.title = body.title.trim();
  } else if (isNew) {
    return { error: "title is required" };
  }

  for (const field of textFields) {
    if (field in body) {
      if (typeof body[field] !== "string") {
        return { error: `${field} must be a string` };
      }

      updates[field] = body[field].trim();
    }
  }

  if ("percentage" in body) {
    if (typeof body.percentage !== "string" && typeof body.percentage !== "number") {
      return { error: "percentage must be a string or number" };
    }

    updates.percentage = String(body.percentage).trim();
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

  if (!Object.keys(updates).length) {
    return { error: "No valid education fields provided" };
  }

  return { updates };
}

export async function getPublicEducation(req, res) {
  const education = await Education.find({ visible: true }).sort({ order: 1, createdAt: 1 });

  res.json({ success: true, data: education });
}

export async function getAdminEducation(req, res) {
  const education = await Education.find().sort({ order: 1, createdAt: 1 });

  res.json({ success: true, data: education });
}

export async function createEducation(req, res) {
  const { updates, error } = getEducationUpdates(req.body || {}, true);

  if (error) {
    return res.status(400).json({ success: false, message: error });
  }

  if (!("order" in updates)) {
    updates.order = await getNextOrder(Education);
  }

  const education = await Education.create(updates);

  return res.status(201).json({
    success: true,
    message: "Education created",
    data: education,
  });
}

export async function updateEducation(req, res) {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid education id" });
  }

  const { updates, error } = getEducationUpdates(req.body || {});

  if (error) {
    return res.status(400).json({ success: false, message: error });
  }

  const education = await Education.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });

  if (!education) {
    return res.status(404).json({ success: false, message: "Education not found" });
  }

  return res.json({
    success: true,
    message: "Education updated",
    data: education,
  });
}

export async function deleteEducation(req, res) {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid education id" });
  }

  const education = await Education.findByIdAndDelete(req.params.id);

  if (!education) {
    return res.status(404).json({ success: false, message: "Education not found" });
  }

  return res.json({ success: true, message: "Education deleted" });
}
