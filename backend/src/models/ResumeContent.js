import mongoose from "mongoose";

const linkSchema = new mongoose.Schema(
  {
    label: { type: String, default: "", trim: true },
    url: { type: String, default: "", trim: true },
  },
  { _id: false },
);

const skillGroupSchema = new mongoose.Schema(
  {
    name: { type: String, default: "", trim: true },
    skills: [{ type: String, trim: true }],
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
  },
  { _id: true },
);

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, default: "", trim: true },
    dateLabel: { type: String, default: "", trim: true },
    techStack: [{ type: String, trim: true }],
    liveUrl: { type: String, default: "", trim: true },
    githubUrl: { type: String, default: "", trim: true },
    bullets: [{ type: String, trim: true }],
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
  },
  { _id: true },
);

const educationSchema = new mongoose.Schema(
  {
    title: { type: String, default: "", trim: true },
    institution: { type: String, default: "", trim: true },
    details: { type: String, default: "", trim: true },
    yearLabel: { type: String, default: "", trim: true },
    score: { type: String, default: "", trim: true },
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
  },
  { _id: true },
);

const trainingSchema = new mongoose.Schema(
  {
    title: { type: String, default: "", trim: true },
    details: { type: String, default: "", trim: true },
    certificateStatus: { type: String, default: "", trim: true },
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
  },
  { _id: true },
);

const achievementSchema = new mongoose.Schema(
  {
    title: { type: String, default: "", trim: true },
    description: { type: String, default: "", trim: true },
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
  },
  { _id: true },
);

const languageSchema = new mongoose.Schema(
  {
    name: { type: String, default: "", trim: true },
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
  },
  { _id: true },
);

const resumeContentSchema = new mongoose.Schema(
  {
    singletonKey: { type: String, default: "resume", unique: true, immutable: true },
    basic: {
      fullName: { type: String, default: "", trim: true },
      role: { type: String, default: "", trim: true },
      location: { type: String, default: "", trim: true },
      phone: { type: String, default: "", trim: true },
      email: { type: String, default: "", trim: true },
      linkedin: { type: linkSchema, default: () => ({}) },
      github: { type: linkSchema, default: () => ({}) },
    },
    summary: { type: String, default: "", trim: true },
    skillGroups: { type: [skillGroupSchema], default: [] },
    projects: { type: [projectSchema], default: [] },
    education: { type: [educationSchema], default: [] },
    training: { type: [trainingSchema], default: [] },
    achievements: { type: [achievementSchema], default: [] },
    languages: { type: [languageSchema], default: [] },
    visible: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const ResumeContent =
  mongoose.models.ResumeContent ||
  mongoose.model("ResumeContent", resumeContentSchema);

export default ResumeContent;
