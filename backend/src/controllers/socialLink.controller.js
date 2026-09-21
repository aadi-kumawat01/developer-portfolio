import SocialLink from "../models/SocialLink.js";
import { getNextOrder, isValidId, isValidOrder } from "../utils/cms.js";

const allowedFields = new Set(["label", "url", "iconKey", "order", "visible"]);

function isHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function getSocialLinkUpdates(body, isNew = false) {
  for (const field of Object.keys(body)) {
    if (!allowedFields.has(field)) {
      return { error: `${field} is not supported` };
    }
  }

  const updates = {};

  if ("label" in body) {
    if (typeof body.label !== "string" || !body.label.trim()) {
      return { error: "label is required" };
    }

    updates.label = body.label.trim();
  } else if (isNew) {
    return { error: "label is required" };
  }

  if ("url" in body) {
    if (typeof body.url !== "string" || !isHttpUrl(body.url.trim())) {
      return { error: "url must be a valid http or https URL" };
    }

    updates.url = body.url.trim();
  } else if (isNew) {
    return { error: "url is required" };
  }

  if ("iconKey" in body) {
    if (typeof body.iconKey !== "string") {
      return { error: "iconKey must be a string" };
    }

    updates.iconKey = body.iconKey.trim();
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
    return { error: "No valid social link fields provided" };
  }

  return { updates };
}

export async function getPublicSocialLinks(req, res) {
  const links = await SocialLink.find({ visible: true }).sort({ order: 1, createdAt: 1 });

  res.json({ success: true, data: links });
}

export async function getAdminSocialLinks(req, res) {
  const links = await SocialLink.find().sort({ order: 1, createdAt: 1 });

  res.json({ success: true, data: links });
}

export async function createSocialLink(req, res) {
  const { updates, error } = getSocialLinkUpdates(req.body || {}, true);

  if (error) {
    return res.status(400).json({ success: false, message: error });
  }

  if (!("order" in updates)) {
    updates.order = await getNextOrder(SocialLink);
  }

  const link = await SocialLink.create(updates);

  return res.status(201).json({
    success: true,
    message: "Social link created",
    data: link,
  });
}

export async function updateSocialLink(req, res) {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid social link id" });
  }

  const { updates, error } = getSocialLinkUpdates(req.body || {});

  if (error) {
    return res.status(400).json({ success: false, message: error });
  }

  const link = await SocialLink.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });

  if (!link) {
    return res.status(404).json({ success: false, message: "Social link not found" });
  }

  return res.json({
    success: true,
    message: "Social link updated",
    data: link,
  });
}

export async function deleteSocialLink(req, res) {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid social link id" });
  }

  const link = await SocialLink.findByIdAndDelete(req.params.id);

  if (!link) {
    return res.status(404).json({ success: false, message: "Social link not found" });
  }

  return res.json({ success: true, message: "Social link deleted" });
}
