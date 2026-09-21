import mongoose from "mongoose";

const learningSchema = new mongoose.Schema(
  {
    type: { type: String, trim: true },
    title: { type: String, required: true, trim: true },
    institution: { type: String, trim: true },
    startDate: { type: String, trim: true },
    endDate: { type: String, trim: true },
    duration: { type: String, trim: true },
    status: { type: String, trim: true },
    certificateStatus: { type: String, trim: true },
    description: { type: String, trim: true },
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.models.Learning ||
  mongoose.model("Learning", learningSchema);
