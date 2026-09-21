import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProjectCategory",
      required: true,
    },
    shortDescription: { type: String, trim: true },
    description: { type: String, trim: true },
    techStack: { type: [String], default: [] },
    thumbnailUrl: { type: String, trim: true },
    thumbnailPublicId: { type: String, trim: true },
    screenshots: { type: [String], default: [] },
    screenshotPublicIds: { type: [String], default: [] },
    liveUrl: { type: String, trim: true },
    githubUrl: { type: String, trim: true },
    status: {
      type: String,
      enum: ["live", "development", "private"],
      default: "development",
    },
    featured: { type: Boolean, default: false },
    featuredOrder: {
      type: Number,
      default: null,
      validate: {
        validator: (value) => value === null || [1, 2, 3].includes(value),
        message: "featuredOrder must be 1, 2, 3, or null",
      },
    },
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
  },
  { timestamps: true },
);

projectSchema.index(
  { featuredOrder: 1 },
  { unique: true, partialFilterExpression: { featured: true } },
);

export default mongoose.models.Project || mongoose.model("Project", projectSchema);
