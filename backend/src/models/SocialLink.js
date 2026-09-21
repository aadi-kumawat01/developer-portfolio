import mongoose from "mongoose";

const socialLinkSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    iconKey: { type: String, trim: true },
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.models.SocialLink ||
  mongoose.model("SocialLink", socialLinkSchema);
