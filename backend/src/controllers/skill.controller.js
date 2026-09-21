import Skill from "../models/Skill.js";
import SkillCategory from "../models/SkillCategory.js";
import { getNextOrder, isValidId, isValidOrder } from "../utils/cms.js";

const textFields = ["iconKey", "iconUrl", "description"];

async function categoryExists(categoryId) {
  return SkillCategory.exists({ _id: categoryId });
}

async function getSkillUpdates(body, isNew = false) {
  const updates = {};

  if ("name" in body) {
    if (typeof body.name !== "string" || !body.name.trim()) {
      return { error: "name is required" };
    }

    updates.name = body.name.trim();
  } else if (isNew) {
    return { error: "name is required" };
  }

  if ("category" in body) {
    if (!isValidId(body.category)) {
      return { error: "Invalid category id" };
    }

    if (!(await categoryExists(body.category))) {
      return { error: "Skill category not found" };
    }

    updates.category = body.category;
  } else if (isNew) {
    return { error: "category is required" };
  }

  for (const field of textFields) {
    if (field in body) {
      if (typeof body[field] !== "string") {
        return { error: `${field} must be a string` };
      }

      updates[field] = body[field].trim();
    }
  }

  if ("proficiency" in body) {
    if (body.proficiency === null) {
      updates.proficiency = null;
    } else if (
      typeof body.proficiency !== "number" ||
      !Number.isFinite(body.proficiency) ||
      body.proficiency < 0 ||
      body.proficiency > 100
    ) {
      return { error: "proficiency must be a number from 0 to 100" };
    } else {
      updates.proficiency = body.proficiency;
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
    return { error: "No valid skill fields provided" };
  }

  return { updates };
}

export async function getPublicSkills(req, res) {
  const categories = await SkillCategory.find({ visible: true }).sort({ order: 1, createdAt: 1 });
  const categoryIds = categories.map((category) => category._id);
  const skills = await Skill.find({
    category: { $in: categoryIds },
    visible: true,
  }).sort({ order: 1, createdAt: 1 });

  const data = categories.map((category) => ({
    ...category.toObject(),
    skills: skills.filter(
      (skill) => skill.category.toString() === category._id.toString(),
    ),
  }));

  res.json({ success: true, data });
}

export async function getAdminSkills(req, res) {
  const filter = {};

  if (req.query.category) {
    if (!isValidId(req.query.category)) {
      return res.status(400).json({ success: false, message: "Invalid category id" });
    }

    filter.category = req.query.category;
  }

  const skills = await Skill.find(filter)
    .sort({ order: 1, createdAt: 1 })
    .populate("category", "name slug");

  return res.json({ success: true, data: skills });
}

export async function createSkill(req, res) {
  const { updates, error } = await getSkillUpdates(req.body || {}, true);

  if (error) {
    return res.status(400).json({ success: false, message: error });
  }

  if (!("order" in updates)) {
    updates.order = await getNextOrder(Skill, { category: updates.category });
  }

  const skill = await Skill.create(updates);

  return res.status(201).json({
    success: true,
    message: "Skill created",
    data: skill,
  });
}

export async function updateSkill(req, res) {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid skill id" });
  }

  const { updates, error } = await getSkillUpdates(req.body || {});

  if (error) {
    return res.status(400).json({ success: false, message: error });
  }

  const skill = await Skill.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  }).populate("category", "name slug");

  if (!skill) {
    return res.status(404).json({ success: false, message: "Skill not found" });
  }

  return res.json({
    success: true,
    message: "Skill updated",
    data: skill,
  });
}

export async function deleteSkill(req, res) {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid skill id" });
  }

  const skill = await Skill.findByIdAndDelete(req.params.id);

  if (!skill) {
    return res.status(404).json({ success: false, message: "Skill not found" });
  }

  return res.json({ success: true, message: "Skill deleted" });
}
