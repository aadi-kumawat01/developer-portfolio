import Learning from "../models/Learning.js";
import { getNextOrder, isValidId, isValidOrder } from "../utils/cms.js";

const textFields = [
  "type",
  "institution",
  "startDate",
  "endDate",
  "duration",
  "status",
  "certificateStatus",
  "description",
];

function getLearningUpdates(body, isNew = false) {
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
    return { error: "No valid learning fields provided" };
  }

  return { updates };
}

export async function getPublicLearning(req, res) {
  const learning = await Learning.find({ visible: true }).sort({ order: 1, createdAt: 1 });

  res.json({ success: true, data: learning });
}

export async function getAdminLearning(req, res) {
  const learning = await Learning.find().sort({ order: 1, createdAt: 1 });

  res.json({ success: true, data: learning });
}

export async function createLearning(req, res) {
  const { updates, error } = getLearningUpdates(req.body || {}, true);

  if (error) {
    return res.status(400).json({ success: false, message: error });
  }

  if (!("order" in updates)) {
    updates.order = await getNextOrder(Learning);
  }

  const learning = await Learning.create(updates);

  return res.status(201).json({
    success: true,
    message: "Learning item created",
    data: learning,
  });
}

export async function updateLearning(req, res) {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid learning id" });
  }

  const { updates, error } = getLearningUpdates(req.body || {});

  if (error) {
    return res.status(400).json({ success: false, message: error });
  }

  const learning = await Learning.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });

  if (!learning) {
    return res.status(404).json({ success: false, message: "Learning item not found" });
  }

  return res.json({
    success: true,
    message: "Learning item updated",
    data: learning,
  });
}

export async function deleteLearning(req, res) {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid learning id" });
  }

  const learning = await Learning.findByIdAndDelete(req.params.id);

  if (!learning) {
    return res.status(404).json({ success: false, message: "Learning item not found" });
  }

  return res.json({ success: true, message: "Learning item deleted" });
}
