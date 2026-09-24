import mongoose from "mongoose";

const ctaSchema = new mongoose.Schema(
  {
    label: { type: String, default: "", trim: true },
    href: { type: String, default: "", trim: true },
  },
  { _id: false },
);

const heroSchema = new mongoose.Schema(
  {
    eyebrow: { type: String, default: "", trim: true },
    firstName: { type: String, default: "", trim: true },
    lastName: { type: String, default: "", trim: true },
    role: { type: String, default: "", trim: true },
    description: { type: String, default: "", trim: true },
    primaryCta: { type: ctaSchema, default: () => ({}) },
    secondaryCta: { type: ctaSchema, default: () => ({}) },
    visible: { type: Boolean, default: true },
  },
  { _id: false },
);

const aboutSchema = new mongoose.Schema(
  {
    eyebrow: { type: String, default: "", trim: true },
    heading: { type: String, default: "", trim: true },
    description: { type: String, default: "", trim: true },
    developerLabel: { type: String, default: "", trim: true },
    locationText: { type: String, default: "", trim: true },
    imageUrl: { type: String, default: "", trim: true },
    imagePublicId: { type: String, default: "", trim: true },
    visible: { type: Boolean, default: true },
  },
  { _id: false },
);

const contactSchema = new mongoose.Schema(
  {
    eyebrow: { type: String, default: "", trim: true },
    heading: { type: String, default: "", trim: true },
    description: { type: String, default: "", trim: true },
    availabilityText: { type: String, default: "", trim: true },
    email: { type: String, default: "", trim: true },
    location: { type: String, default: "", trim: true },
    formHeading: { type: String, default: "", trim: true },
    formDescription: { type: String, default: "", trim: true },
    visible: { type: Boolean, default: true },
  },
  { _id: false },
);

const resumeSchema = new mongoose.Schema(
  {
    pdfUrl: { type: String, default: "", trim: true },
    viewUrl: { type: String, default: "", trim: true },
    downloadUrl: { type: String, default: "", trim: true },
    downloadFileName: { type: String, default: "", trim: true },
    publicId: { type: String, default: "", trim: true },
    visible: { type: Boolean, default: true },
  },
  { _id: false },
);

const siteContentSchema = new mongoose.Schema(
  {
    singletonKey: {
      type: String,
      default: "site",
      unique: true,
      immutable: true,
    },
    hero: { type: heroSchema, default: () => ({}) },
    about: { type: aboutSchema, default: () => ({}) },
    contact: { type: contactSchema, default: () => ({}) },
    resume: { type: resumeSchema, default: () => ({}) },
  },
  { timestamps: true },
);

const SiteContent =
  mongoose.models.SiteContent ||
  mongoose.model("SiteContent", siteContentSchema);

export default SiteContent;
