import mongoose from "mongoose";

const aboutHighlightSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.models.AboutHighlight ||
  mongoose.model("AboutHighlight", aboutHighlightSchema);
