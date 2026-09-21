import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SkillCategory",
      required: true,
    },
    iconKey: { type: String, trim: true },
    iconUrl: { type: String, trim: true },
    proficiency: { type: Number, default: null, min: 0, max: 100 },
    description: { type: String, trim: true },
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.models.Skill || mongoose.model("Skill", skillSchema);
