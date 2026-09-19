import mongoose from "mongoose";

const { Schema } = mongoose;
const options = { timestamps: true, strict: "throw" };
const string = { type: String, trim: true };
const requiredString = { ...string, required: true };
const order = { type: Number, default: 0 };
const visible = { type: Boolean, default: true };
const image = new Schema({ url: requiredString, publicId: string, alt: string }, { _id: false });

const siteContentSchema = new Schema({
  key: { type: String, default: "main", immutable: true, unique: true },
  hero: {
    introduction: string, headline: string, availability: string,
    description: string, primaryCtaLabel: string, secondaryCtaLabel: string,
  },
  about: {
    eyebrow: string, heading: string, description: string,
    photo: image,
    stats: [{ value: string, label: string }],
    highlights: [string],
    primaryCtaLabel: string, secondaryCtaLabel: string,
  },
  contact: { eyebrow: string, description: string, email: string, location: string },
  profile: { name: string, role: string, publicEmail: string, location: string, cvUrl: string },
  settings: { title: string, description: string, defaultTheme: string },
}, options);

const educationSchema = new Schema({
  title: requiredString, institution: requiredString, university: string,
  status: string, startDate: Date, endDate: Date, marks: string,
  description: string, order, visible,
}, options);

const learningSchema = new Schema({
  title: requiredString, kind: { type: String, enum: ["course", "certification", "training"], default: "course" },
  institute: string, startDate: Date, endDate: Date, status: string,
  description: string, certificateUrl: string, order, visible,
}, options);

const skillCategorySchema = new Schema({
  name: requiredString, slug: { ...requiredString, unique: true }, order, visible,
}, options);

const skillSchema = new Schema({
  name: requiredString, category: { type: Schema.Types.ObjectId, ref: "SkillCategory", required: true },
  proficiency: { type: Number, min: 0, max: 100, default: null },
  iconUrl: string, iconKey: string, order, visible,
}, options);

const projectCategorySchema = new Schema({
  name: requiredString, slug: { ...requiredString, unique: true }, order, visible,
}, options);

const projectSchema = new Schema({
  title: requiredString, slug: { ...requiredString, unique: true },
  category: { type: Schema.Types.ObjectId, ref: "ProjectCategory", required: true },
  shortDescription: requiredString, detailedDescription: string,
  techStack: [string], thumbnail: image, screenshots: [image],
  liveUrl: string, githubUrl: string, status: string, visible,
  featuredOrder: { type: Number, enum: [1, 2, 3], default: null },
  order,
}, options);
const featuredSelectionSchema = new Schema({
  key: { type: String, default: "main", unique: true, immutable: true },
  revision: { type: Number, default: 0 },
}, options);

const testimonialSchema = new Schema({
  name: requiredString, role: string, review: requiredString,
  rating: { type: Number, min: 1, max: 5 }, order, visible,
}, options);

const socialLinkSchema = new Schema({
  label: requiredString, url: requiredString, iconKey: string, order, visible,
}, options);

function model(name, schema) {
  return mongoose.models[name] || mongoose.model(name, schema);
}

export const SiteContent = model("SiteContent", siteContentSchema);
export const Education = model("Education", educationSchema);
export const Learning = model("Learning", learningSchema);
export const SkillCategory = model("SkillCategory", skillCategorySchema);
export const Skill = model("Skill", skillSchema);
export const ProjectCategory = model("ProjectCategory", projectCategorySchema);
export const Project = model("Project", projectSchema);
export const FeaturedSelection = model("FeaturedSelection", featuredSelectionSchema);
export const Testimonial = model("Testimonial", testimonialSchema);
export const SocialLink = model("SocialLink", socialLinkSchema);
