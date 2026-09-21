import Project from "../models/Project.js";
import ProjectCategory from "../models/ProjectCategory.js";
import { getNextOrder, isValidId, isValidOrder } from "../utils/cms.js";

const textFields = [
  "shortDescription",
  "description",
  "thumbnailUrl",
  "liveUrl",
  "githubUrl",
];
const allowedFields = new Set([
  "title",
  "slug",
  "category",
  ...textFields,
  "techStack",
  "screenshots",
  "status",
  "order",
  "visible",
]);

function normalizeSlug(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function normalizeUrl(value, field) {
  if (typeof value !== "string") {
    return { error: `${field} must be a string` };
  }

  const url = value.trim();

  if (!url || isHttpUrl(url)) {
    return { value: url };
  }

  return { error: `${field} must be a valid http or https URL` };
}

function normalizeTechStack(value) {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    return { error: "techStack must be an array of strings" };
  }

  const techStack = [...new Set(value.map((item) => item.trim()).filter(Boolean))];
  return { value: techStack };
}

function normalizeScreenshots(value) {
  if (!Array.isArray(value)) {
    return { error: "screenshots must be an array" };
  }

  const screenshots = [];

  for (const item of value) {
    const result = normalizeUrl(item, "screenshots");

    if (result.error) {
      return result;
    }

    if (result.value) {
      screenshots.push(result.value);
    }
  }

  return { value: [...new Set(screenshots)] };
}

async function categoryExists(categoryId) {
  return ProjectCategory.exists({ _id: categoryId });
}

function slugIsTaken(slug, projectId) {
  const filter = projectId ? { slug, _id: { $ne: projectId } } : { slug };
  return Project.exists(filter);
}

async function getProjectUpdates(body, isNew = false) {
  for (const field of Object.keys(body)) {
    if (!allowedFields.has(field)) {
      return { error: `${field} is not supported` };
    }
  }

  const updates = {};
  let title;

  if ("title" in body) {
    if (typeof body.title !== "string" || !body.title.trim()) {
      return { error: "title is required" };
    }

    title = body.title.trim();
    updates.title = title;
  } else if (isNew) {
    return { error: "title is required" };
  }

  if ("slug" in body) {
    if (typeof body.slug !== "string" || !normalizeSlug(body.slug)) {
      return { error: "slug must contain letters or numbers" };
    }

    updates.slug = normalizeSlug(body.slug);
  } else if (isNew && title) {
    updates.slug = normalizeSlug(title);
  }

  if ("category" in body) {
    if (!isValidId(body.category)) {
      return { error: "Invalid category id" };
    }

    if (!(await categoryExists(body.category))) {
      return { error: "Project category not found" };
    }

    updates.category = body.category;
  } else if (isNew) {
    return { error: "category is required" };
  }

  for (const field of textFields) {
    if (!(field in body)) {
      continue;
    }

    const result = field.endsWith("Url")
      ? normalizeUrl(body[field], field)
      : typeof body[field] === "string"
        ? { value: body[field].trim() }
        : { error: `${field} must be a string` };

    if (result.error) {
      return result;
    }

    updates[field] = result.value;
  }

  if ("techStack" in body) {
    const result = normalizeTechStack(body.techStack);

    if (result.error) {
      return result;
    }

    updates.techStack = result.value;
  }

  if ("screenshots" in body) {
    const result = normalizeScreenshots(body.screenshots);

    if (result.error) {
      return result;
    }

    updates.screenshots = result.value;
  }

  if ("status" in body) {
    if (!["live", "development", "private"].includes(body.status)) {
      return { error: "status must be live, development, or private" };
    }

    updates.status = body.status;
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
    return { error: "No valid project fields provided" };
  }

  return { updates };
}

export async function getPublicProjects(req, res) {
  const filter = { visible: true, status: { $ne: "private" } };

  if (req.query.category) {
    const category = await ProjectCategory.findOne({
      slug: req.query.category,
      visible: true,
    });

    if (!category) {
      return res.json({ success: true, data: [] });
    }

    filter.category = category._id;
  }

  const projects = await Project.find(filter)
    .sort({ order: 1, createdAt: 1 })
    .populate("category", "name slug");

  return res.json({ success: true, data: projects });
}

export async function getPublicProject(req, res) {
  const project = await Project.findOne({
    slug: req.params.slug,
    visible: true,
    status: { $ne: "private" },
  }).populate("category", "name slug");

  if (!project) {
    return res.status(404).json({ success: false, message: "Project not found" });
  }

  return res.json({ success: true, data: project });
}

export async function getAdminProjects(req, res) {
  const filter = {};

  if (req.query.category) {
    if (!isValidId(req.query.category)) {
      return res.status(400).json({ success: false, message: "Invalid category id" });
    }

    filter.category = req.query.category;
  }

  const projects = await Project.find(filter)
    .sort({ order: 1, createdAt: 1 })
    .populate("category", "name slug");

  return res.json({ success: true, data: projects });
}

export async function getAdminProject(req, res) {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid project id" });
  }

  const project = await Project.findById(req.params.id).populate("category", "name slug");

  if (!project) {
    return res.status(404).json({ success: false, message: "Project not found" });
  }

  return res.json({ success: true, data: project });
}

export async function createProject(req, res) {
  const { updates, error } = await getProjectUpdates(req.body || {}, true);

  if (error) {
    return res.status(400).json({ success: false, message: error });
  }

  if (await slugIsTaken(updates.slug)) {
    return res.status(409).json({ success: false, message: "Project slug already exists" });
  }

  if (!("order" in updates)) {
    updates.order = await getNextOrder(Project);
  }

  const project = await Project.create(updates);

  return res.status(201).json({
    success: true,
    message: "Project created",
    data: project,
  });
}

export async function updateProject(req, res) {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid project id" });
  }

  const { updates, error } = await getProjectUpdates(req.body || {});

  if (error) {
    return res.status(400).json({ success: false, message: error });
  }

  if (updates.slug && (await slugIsTaken(updates.slug, req.params.id))) {
    return res.status(409).json({ success: false, message: "Project slug already exists" });
  }

  const project = await Project.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  }).populate("category", "name slug");

  if (!project) {
    return res.status(404).json({ success: false, message: "Project not found" });
  }

  return res.json({
    success: true,
    message: "Project updated",
    data: project,
  });
}

export async function deleteProject(req, res) {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid project id" });
  }

  const project = await Project.findByIdAndDelete(req.params.id);

  if (!project) {
    return res.status(404).json({ success: false, message: "Project not found" });
  }

  return res.json({ success: true, message: "Project deleted" });
}
