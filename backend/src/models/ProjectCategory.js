import mongoose from "mongoose";

const projectCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true },
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.models.ProjectCategory ||
  mongoose.model("ProjectCategory", projectCategorySchema);
