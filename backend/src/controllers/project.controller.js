import Project from "../models/Project.js";
import ProjectCategory from "../models/ProjectCategory.js";
import { getNextOrder, isValidId, isValidOrder } from "../utils/cms.js";

const textFields = [
  "shortDescription",
  "description",
  "thumbnailUrl",
  "thumbnailPublicId",
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
  "screenshotPublicIds",
  "status",
  "featured",
  "featuredOrder",
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

function isSafeLocalImagePath(value) {
  return value.startsWith("/")
    && !value.startsWith("//")
    && !value.includes("\\")
    && !value.includes("..");
}

function normalizeUrl(value, field) {
  if (typeof value !== "string") {
    return { error: `${field} must be a string` };
  }

  const url = value.trim();

  const isProjectImage = field === "thumbnailUrl" || field === "screenshots";

  if (!url || isHttpUrl(url) || (isProjectImage && isSafeLocalImagePath(url))) {
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

function normalizeStringArray(value, field) {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    return { error: `${field} must be an array of strings` };
  }

  return { value: [...new Set(value.map((item) => item.trim()).filter(Boolean))] };
}

async function categoryExists(categoryId) {
  return ProjectCategory.exists({ _id: categoryId });
}

function slugIsTaken(slug, projectId) {
  const filter = projectId ? { slug, _id: { $ne: projectId } } : { slug };
  return Project.exists(filter);
}

async function featuredPositionIsTaken(featuredOrder, projectId) {
  const filter = projectId
    ? { featured: true, featuredOrder, _id: { $ne: projectId } }
    : { featured: true, featuredOrder };

  return Project.exists(filter);
}

function applyFeaturedRules(body, updates, currentProject) {
  if ("featured" in body && typeof body.featured !== "boolean") {
    return "featured must be a boolean";
  }

  if (
    "featuredOrder" in body &&
    body.featuredOrder !== null &&
    ![1, 2, 3].includes(body.featuredOrder)
  ) {
    return "featuredOrder must be 1, 2, 3, or null";
  }

  const visible = "visible" in updates
    ? updates.visible
    : currentProject?.visible ?? true;
  const status = "status" in updates
    ? updates.status
    : currentProject?.status ?? "development";
  const featured = "featured" in body
    ? body.featured
    : currentProject?.featured ?? false;
  const featuredOrder = "featuredOrder" in body
    ? body.featuredOrder
    : currentProject?.featuredOrder ?? null;
  const featureRequested = body.featured === true || body.featuredOrder != null;

  if (!visible || status === "private") {
    if (featureRequested) {
      return "Only visible, non-private projects can be featured";
    }

    updates.featured = false;
    updates.featuredOrder = null;
    return null;
  }

  if (!featured) {
    updates.featured = false;
    updates.featuredOrder = null;
    return null;
  }

  if (![1, 2, 3].includes(featuredOrder)) {
    return "featuredOrder is required when featured is true";
  }

  updates.featured = true;
  updates.featuredOrder = featuredOrder;
  return null;
}

async function getProjectUpdates(body, isNew = false, currentProject = null) {
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

  if ("screenshotPublicIds" in body) {
    const result = normalizeStringArray(body.screenshotPublicIds, "screenshotPublicIds");

    if (result.error) {
      return result;
    }

    updates.screenshotPublicIds = result.value;
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

  const featuredError = applyFeaturedRules(body, updates, currentProject);

  if (featuredError) {
    return { error: featuredError };
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

export async function getFeaturedProjects(req, res) {
  const projects = await Project.find({
    featured: true,
    visible: true,
    status: { $ne: "private" },
  })
    .sort({ featuredOrder: 1 })
    .limit(3)
    .populate("category", "name slug");

  return res.json({ success: true, data: projects });
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

  if (
    updates.featured &&
    (await featuredPositionIsTaken(updates.featuredOrder))
  ) {
    return res.status(409).json({
      success: false,
      message: `Featured position ${updates.featuredOrder} is already assigned to another project.`,
    });
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

  const currentProject = await Project.findById(req.params.id);

  if (!currentProject) {
    return res.status(404).json({ success: false, message: "Project not found" });
  }

  const { updates, error } = await getProjectUpdates(
    req.body || {},
    false,
    currentProject,
  );

  if (error) {
    return res.status(400).json({ success: false, message: error });
  }

  if (updates.slug && (await slugIsTaken(updates.slug, req.params.id))) {
    return res.status(409).json({ success: false, message: "Project slug already exists" });
  }

  if (
    updates.featured &&
    (await featuredPositionIsTaken(updates.featuredOrder, req.params.id))
  ) {
    return res.status(409).json({
      success: false,
      message: `Featured position ${updates.featuredOrder} is already assigned to another project.`,
    });
  }

  const project = await Project.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  }).populate("category", "name slug");

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
