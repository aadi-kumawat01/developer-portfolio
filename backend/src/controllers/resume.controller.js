import ResumeContent from "../models/ResumeContent.js";
import SiteContent from "../models/SiteContent.js";

const text = (value) => (typeof value === "string" ? value.trim() : "");
const ordered = (items = []) => [...items].sort((a, b) => a.order - b.order);

const emptyResume = {
  basic: { fullName: "", role: "", location: "", phone: "", email: "", linkedin: { label: "", url: "" }, github: { label: "", url: "" } },
  summary: "",
  skillGroups: [], projects: [], education: [], training: [], achievements: [], languages: [], visible: true,
};

function safeUrl(value) {
  if (!value) return true;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function cleanStringList(value) {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) return null;
  return value.map(text).filter(Boolean);
}

function cleanItems(value, fields) {
  if (!Array.isArray(value)) return null;
  const result = [];
  for (let index = 0; index < value.length; index += 1) {
    const item = value[index];
    if (!item || typeof item !== "object" || Array.isArray(item)) return null;
    const next = { order: Number.isFinite(item.order) ? item.order : index + 1, visible: typeof item.visible === "boolean" ? item.visible : true };
    for (const field of fields) {
      if (field === "skills" || field === "techStack" || field === "bullets") {
        const list = cleanStringList(item[field] || []);
        if (!list) return null;
        next[field] = list;
      } else {
        if (field in item && typeof item[field] !== "string") return null;
        next[field] = text(item[field]);
      }
    }
    if (("liveUrl" in next && !safeUrl(next.liveUrl)) || ("githubUrl" in next && !safeUrl(next.githubUrl))) return null;
    result.push(next);
  }
  return result;
}

function sanitizeContent(source) {
  if (!source || typeof source !== "object" || Array.isArray(source)) return { error: "Resume content must be an object." };
  const basic = source.basic || {};
  if (!basic || typeof basic !== "object" || Array.isArray(basic)) return { error: "Basic information must be an object." };
  const linkedin = basic.linkedin || {};
  const github = basic.github || {};
  const urlFields = [linkedin.url, github.url];
  if (urlFields.some((value) => value && (typeof value !== "string" || !safeUrl(value)))) return { error: "Social links must use valid http or https URLs." };
  if ("visible" in source && typeof source.visible !== "boolean") return { error: "Resume visibility must be a boolean." };
  if ("summary" in source && typeof source.summary !== "string") return { error: "Summary must be text." };

  const content = {
    basic: {
      fullName: text(basic.fullName), role: text(basic.role), location: text(basic.location), phone: text(basic.phone), email: text(basic.email),
      linkedin: { label: text(linkedin.label), url: text(linkedin.url) },
      github: { label: text(github.label), url: text(github.url) },
    },
    summary: text(source.summary),
    skillGroups: cleanItems(source.skillGroups || [], ["name", "skills"]),
    projects: cleanItems(source.projects || [], ["title", "dateLabel", "techStack", "liveUrl", "githubUrl", "bullets"]),
    education: cleanItems(source.education || [], ["title", "institution", "details", "yearLabel", "score"]),
    training: cleanItems(source.training || [], ["title", "details", "certificateStatus"]),
    achievements: cleanItems(source.achievements || [], ["title", "description"]),
    languages: cleanItems(source.languages || [], ["name"]),
    visible: source.visible !== false,
  };
  if (Object.values(content).some((value) => value === null)) return { error: "Resume lists must contain valid text entries." };
  return { content };
}

function resumePdf(site) {
  const resume = site?.resume || {};
  return { downloadUrl: resume.downloadUrl || "", downloadFileName: resume.downloadFileName || "", publicId: resume.publicId || "" };
}

export async function getPublicResume(req, res) {
  const [content, site] = await Promise.all([ResumeContent.findOne({ singletonKey: "resume" }).lean(), SiteContent.findOne({ singletonKey: "site" }).lean()]);
  const source = content || emptyResume;
  const data = {
    ...source,
    skillGroups: ordered(source.skillGroups).filter((item) => item.visible),
    projects: ordered(source.projects).filter((item) => item.visible),
    education: ordered(source.education).filter((item) => item.visible),
    training: ordered(source.training).filter((item) => item.visible),
    achievements: ordered(source.achievements).filter((item) => item.visible),
    languages: ordered(source.languages).filter((item) => item.visible),
    pdf: resumePdf(site),
  };
  res.json({ success: true, data });
}

export async function getAdminResume(req, res) {
  const [content, site] = await Promise.all([ResumeContent.findOne({ singletonKey: "resume" }).lean(), SiteContent.findOne({ singletonKey: "site" }).lean()]);
  res.json({ success: true, data: { content: content || emptyResume, pdf: resumePdf(site) } });
}

export async function updateAdminResume(req, res) {
  const { content, error } = sanitizeContent(req.body?.content);
  if (error) return res.status(400).json({ success: false, message: error });
  const pdf = req.body?.pdf || {};
  if (!pdf || typeof pdf !== "object" || Array.isArray(pdf)) return res.status(400).json({ success: false, message: "PDF settings must be an object." });
  for (const field of ["pdfUrl", "downloadUrl", "downloadFileName", "publicId"]) {
    if (field in pdf && typeof pdf[field] !== "string") return res.status(400).json({ success: false, message: `${field} must be text.` });
  }
  if ((pdf.pdfUrl && !safeUrl(pdf.pdfUrl)) || (pdf.downloadUrl && !safeUrl(pdf.downloadUrl))) return res.status(400).json({ success: false, message: "PDF links must use valid http or https URLs." });

  const [savedContent, site] = await Promise.all([
    ResumeContent.findOneAndUpdate({ singletonKey: "resume" }, { $set: content, $setOnInsert: { singletonKey: "resume" } }, { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }),
    SiteContent.findOneAndUpdate({ singletonKey: "site" }, { $set: { "resume.pdfUrl": text(pdf.pdfUrl), "resume.downloadUrl": text(pdf.downloadUrl), "resume.downloadFileName": text(pdf.downloadFileName), "resume.publicId": text(pdf.publicId), "resume.viewUrl": "/resume", "resume.visible": true }, $setOnInsert: { singletonKey: "site" } }, { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }),
  ]);
  res.json({ success: true, message: "Resume saved successfully.", data: { content: savedContent, pdf: resumePdf(site) } });
}
