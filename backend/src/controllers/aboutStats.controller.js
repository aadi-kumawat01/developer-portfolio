import AboutStat from "../models/AboutStat.js";
import { getNextOrder, isValidId, isValidOrder } from "../utils/cms.js";

function getStatUpdates(body, isNew = false) {
  const updates = {};

  for (const field of ["value", "label"]) {
    if (field in body) {
      if (typeof body[field] !== "string" || !body[field].trim()) {
        return { error: `${field} is required` };
      }

      updates[field] = body[field].trim();
    } else if (isNew) {
      return { error: `${field} is required` };
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
    return { error: "No valid stat fields provided" };
  }

  return { updates };
}

export async function getAboutStats(req, res) {
  const stats = await AboutStat.find().sort({ order: 1, createdAt: 1 });

  res.json({ success: true, data: stats });
}

export async function createAboutStat(req, res) {
  const { updates, error } = getStatUpdates(req.body || {}, true);

  if (error) {
    return res.status(400).json({ success: false, message: error });
  }

  if (!("order" in updates)) {
    updates.order = await getNextOrder(AboutStat);
  }

  const stat = await AboutStat.create(updates);

  return res.status(201).json({
    success: true,
    message: "About stat created",
    data: stat,
  });
}

export async function updateAboutStat(req, res) {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid stat id" });
  }

  const { updates, error } = getStatUpdates(req.body || {});

  if (error) {
    return res.status(400).json({ success: false, message: error });
  }

  const stat = await AboutStat.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });

  if (!stat) {
    return res.status(404).json({ success: false, message: "About stat not found" });
  }

  return res.json({
    success: true,
    message: "About stat updated",
    data: stat,
  });
}

export async function deleteAboutStat(req, res) {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid stat id" });
  }

  const stat = await AboutStat.findByIdAndDelete(req.params.id);

  if (!stat) {
    return res.status(404).json({ success: false, message: "About stat not found" });
  }

  return res.json({ success: true, message: "About stat deleted" });
}
