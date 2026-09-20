import mongoose from "mongoose";

const aboutStatSchema = new mongoose.Schema(
  {
    value: { type: String, required: true, trim: true },
    label: { type: String, required: true, trim: true },
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.models.AboutStat ||
  mongoose.model("AboutStat", aboutStatSchema);
