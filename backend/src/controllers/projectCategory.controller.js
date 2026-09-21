import ProjectCategory from "../models/ProjectCategory.js";
import { getNextOrder, isValidId, isValidOrder } from "../utils/cms.js";

function normalizeSlug(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getCategoryUpdates(body, isNew = false) {
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

  if ("slug" in body) {
    if (typeof body.slug !== "string" || !normalizeSlug(body.slug)) {
      return { error: "slug must contain letters or numbers" };
    }

    updates.slug = normalizeSlug(body.slug);
  } else if (isNew && name) {
    updates.slug = normalizeSlug(name);
  }

  if ("description" in body) {
    if (typeof body.description !== "string") {
      return { error: "description must be a string" };
    }

    updates.description = body.description.trim();
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
    return { error: "No valid project category fields provided" };
  }

  return { updates };
}

async function slugIsTaken(slug, categoryId) {
  const filter = categoryId ? { slug, _id: { $ne: categoryId } } : { slug };
  return ProjectCategory.exists(filter);
}

export async function getPublicProjectCategories(req, res) {
  const categories = await ProjectCategory.find({ visible: true }).sort({
    order: 1,
    createdAt: 1,
  });

  res.json({ success: true, data: categories });
}

export async function getProjectCategories(req, res) {
  const categories = await ProjectCategory.find().sort({ order: 1, createdAt: 1 });

  res.json({ success: true, data: categories });
}

export async function createProjectCategory(req, res) {
  const { updates, error } = getCategoryUpdates(req.body || {}, true);

  if (error) {
    return res.status(400).json({ success: false, message: error });
  }

  if (await slugIsTaken(updates.slug)) {
    return res.status(409).json({
      success: false,
      message: "Project category slug already exists",
    });
  }

  if (!("order" in updates)) {
    updates.order = await getNextOrder(ProjectCategory);
  }

  const category = await ProjectCategory.create(updates);

  return res.status(201).json({
    success: true,
    message: "Project category created",
    data: category,
  });
}

export async function updateProjectCategory(req, res) {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid project category id" });
  }

  const { updates, error } = getCategoryUpdates(req.body || {});

  if (error) {
    return res.status(400).json({ success: false, message: error });
  }

  if (updates.slug && (await slugIsTaken(updates.slug, req.params.id))) {
    return res.status(409).json({
      success: false,
      message: "Project category slug already exists",
    });
  }

  const category = await ProjectCategory.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });

  if (!category) {
    return res.status(404).json({
      success: false,
      message: "Project category not found",
    });
  }

  return res.json({
    success: true,
    message: "Project category updated",
    data: category,
  });
}

export async function deleteProjectCategory(req, res) {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid project category id" });
  }

  const category = await ProjectCategory.findByIdAndDelete(req.params.id);

  if (!category) {
    return res.status(404).json({
      success: false,
      message: "Project category not found",
    });
  }

  return res.json({ success: true, message: "Project category deleted" });
}
