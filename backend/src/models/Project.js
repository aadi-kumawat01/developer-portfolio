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
    screenshots: { type: [String], default: [] },
    liveUrl: { type: String, trim: true },
    githubUrl: { type: String, trim: true },
    status: {
      type: String,
      enum: ["live", "development", "private"],
      default: "development",
    },
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.models.Project || mongoose.model("Project", projectSchema);
