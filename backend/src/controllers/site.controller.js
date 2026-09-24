import AboutHighlight from "../models/AboutHighlight.js";
import AboutStat from "../models/AboutStat.js";
import SiteContent from "../models/SiteContent.js";

const emptyContent = {
  hero: {
    eyebrow: "",
    firstName: "",
    lastName: "",
    role: "",
    description: "",
    primaryCta: { label: "", href: "" },
    secondaryCta: { label: "", href: "" },
    visible: true,
  },
  about: {
    eyebrow: "",
    heading: "",
    description: "",
    developerLabel: "",
    locationText: "",
    imageUrl: "",
    visible: true,
  },
  resume: {
    pdfUrl: "",
    viewUrl: "",
    downloadUrl: "",
    downloadFileName: "",
    publicId: "",
    visible: true,
  },
};

function buildSiteResponse(content, aboutStats, aboutHighlights) {
  return {
    hero: content?.hero || emptyContent.hero,
    about: content?.about || emptyContent.about,
    resume: content?.resume || emptyContent.resume,
    aboutStats,
    aboutHighlights,
  };
}

function isSafeResumeUrl(value) {
  if (!value) return true;
  if (value.startsWith("/") && !value.startsWith("//") && !value.includes("\\") && !value.includes("..")) {
    return true;
  }

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function addStringUpdates(updates, section, source, fields) {
  for (const field of fields) {
    if (field in source) {
      if (typeof source[field] !== "string") {
        return `${field} must be a string`;
      }

      updates[`${section}.${field}`] = source[field].trim();
    }
  }

  return null;
}

function addBooleanUpdate(updates, section, source) {
  if (!("visible" in source)) {
    return null;
  }

  if (typeof source.visible !== "boolean") {
    return "visible must be a boolean";
  }

  updates[`${section}.visible`] = source.visible;
  return null;
}

function addCtaUpdates(updates, section, source) {
  for (const field of ["primaryCta", "secondaryCta"]) {
    if (!(field in source)) {
      continue;
    }

    const cta = source[field];

    if (!cta || typeof cta !== "object" || Array.isArray(cta)) {
      return `${field} must be an object`;
    }

    for (const key of ["label", "href"]) {
      if (key in cta) {
        if (typeof cta[key] !== "string") {
          return `${field}.${key} must be a string`;
        }

        updates[`${section}.${field}.${key}`] = cta[key].trim();
      }
    }
  }

  return null;
}

function getSiteUpdates(body) {
  const updates = {};

  if ("hero" in body) {
    if (!body.hero || typeof body.hero !== "object" || Array.isArray(body.hero)) {
      return { error: "hero must be an object" };
    }

    const stringError = addStringUpdates(
      updates,
      "hero",
      body.hero,
      ["eyebrow", "firstName", "lastName", "role", "description"],
    );
    const ctaError = addCtaUpdates(updates, "hero", body.hero);
    const visibleError = addBooleanUpdate(updates, "hero", body.hero);

    if (stringError || ctaError || visibleError) {
      return { error: stringError || ctaError || visibleError };
    }
  }

  if ("about" in body) {
    if (!body.about || typeof body.about !== "object" || Array.isArray(body.about)) {
      return { error: "about must be an object" };
    }

    const stringError = addStringUpdates(
      updates,
      "about",
      body.about,
      [
        "eyebrow",
        "heading",
        "description",
        "developerLabel",
        "locationText",
        "imageUrl",
        "imagePublicId",
      ],
    );
    const visibleError = addBooleanUpdate(updates, "about", body.about);

    if (stringError || visibleError) {
      return { error: stringError || visibleError };
    }
  }

  if ("resume" in body) {
    if (!body.resume || typeof body.resume !== "object" || Array.isArray(body.resume)) {
      return { error: "resume must be an object" };
    }

    for (const field of ["pdfUrl", "viewUrl", "downloadUrl", "downloadFileName", "publicId"]) {
      if (!(field in body.resume)) continue;
      if (typeof body.resume[field] !== "string") return { error: `${field} must be a string` };
      if (["pdfUrl", "viewUrl", "downloadUrl"].includes(field) && !isSafeResumeUrl(body.resume[field].trim())) {
        return { error: `${field} must be a valid http, https, or local path` };
      }
      updates[`resume.${field}`] = body.resume[field].trim();
    }

    const visibleError = addBooleanUpdate(updates, "resume", body.resume);
    if (visibleError) return { error: visibleError };
  }

  if (Object.keys(updates).length === 0) {
    return { error: "Provide hero, about, or resume content to update" };
  }

  return { updates };
}

export async function getPublicSite(req, res) {
  const [content, aboutStats, aboutHighlights] = await Promise.all([
    SiteContent.findOne({ singletonKey: "site" }),
    AboutStat.find({ visible: true }).sort({ order: 1, createdAt: 1 }),
    AboutHighlight.find({ visible: true }).sort({ order: 1, createdAt: 1 }),
  ]);

  res.json({
    success: true,
    data: buildSiteResponse(content, aboutStats, aboutHighlights),
  });
}

export async function getAdminSite(req, res) {
  const [content, aboutStats, aboutHighlights] = await Promise.all([
    SiteContent.findOne({ singletonKey: "site" }),
    AboutStat.find().sort({ order: 1, createdAt: 1 }),
    AboutHighlight.find().sort({ order: 1, createdAt: 1 }),
  ]);

  res.json({
    success: true,
    data: buildSiteResponse(content, aboutStats, aboutHighlights),
  });
}

export async function updateAdminSite(req, res) {
  const { updates, error } = getSiteUpdates(req.body || {});

  if (error) {
    return res.status(400).json({ success: false, message: error });
  }

  const content = await SiteContent.findOneAndUpdate(
    { singletonKey: "site" },
    { $set: updates, $setOnInsert: { singletonKey: "site" } },
    { new: true, runValidators: true, upsert: true, setDefaultsOnInsert: true },
  );

  return res.json({
    success: true,
    message: "Site content updated",
    data: content,
  });
}
