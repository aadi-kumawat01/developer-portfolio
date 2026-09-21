import mongoose from "mongoose";

const educationSchema = new mongoose.Schema(
  {
    type: { type: String, trim: true },
    title: { type: String, required: true, trim: true },
    institution: { type: String, trim: true },
    college: { type: String, trim: true },
    university: { type: String, trim: true },
    board: { type: String, trim: true },
    startDate: { type: String, trim: true },
    endDate: { type: String, trim: true },
    yearLabel: { type: String, trim: true },
    percentage: { type: String, trim: true },
    marksLabel: { type: String, trim: true },
    status: { type: String, trim: true },
    badgeText: { type: String, trim: true },
    description: { type: String, trim: true },
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.models.Education ||
  mongoose.model("Education", educationSchema);
