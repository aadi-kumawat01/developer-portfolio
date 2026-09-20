import AboutHighlight from "../models/AboutHighlight.js";
import { getNextOrder, isValidId, isValidOrder } from "../utils/cms.js";

function getHighlightUpdates(body, isNew = false) {
  const updates = {};

  if ("title" in body) {
    if (typeof body.title !== "string" || !body.title.trim()) {
      return { error: "title is required" };
    }

    updates.title = body.title.trim();
  } else if (isNew) {
    return { error: "title is required" };
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
    return { error: "No valid highlight fields provided" };
  }

  return { updates };
}

export async function getAboutHighlights(req, res) {
  const highlights = await AboutHighlight.find().sort({ order: 1, createdAt: 1 });

  res.json({ success: true, data: highlights });
}

export async function createAboutHighlight(req, res) {
  const { updates, error } = getHighlightUpdates(req.body || {}, true);

  if (error) {
    return res.status(400).json({ success: false, message: error });
  }

  if (!("order" in updates)) {
    updates.order = await getNextOrder(AboutHighlight);
  }

  const highlight = await AboutHighlight.create(updates);

  return res.status(201).json({
    success: true,
    message: "About highlight created",
    data: highlight,
  });
}

export async function updateAboutHighlight(req, res) {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid highlight id" });
  }

  const { updates, error } = getHighlightUpdates(req.body || {});

  if (error) {
    return res.status(400).json({ success: false, message: error });
  }

  const highlight = await AboutHighlight.findByIdAndUpdate(
    req.params.id,
    updates,
    { new: true, runValidators: true },
  );

  if (!highlight) {
    return res.status(404).json({
      success: false,
      message: "About highlight not found",
    });
  }

  return res.json({
    success: true,
    message: "About highlight updated",
    data: highlight,
  });
}

export async function deleteAboutHighlight(req, res) {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid highlight id",
    });
  }

  const highlight = await AboutHighlight.findByIdAndDelete(req.params.id);

  if (!highlight) {
    return res.status(404).json({
      success: false,
      message: "About highlight not found",
    });
  }

  return res.json({ success: true, message: "About highlight deleted" });
}
