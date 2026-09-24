import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, trim: true },
    review: { type: String, required: true, trim: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    initials: { type: String, trim: true },
    avatarUrl: { type: String, trim: true },
    avatarPublicId: { type: String, trim: true },
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    submittedByVisitor: { type: Boolean, default: false },
    submitterEmail: { type: String, trim: true, lowercase: true, select: false },
    moderatedAt: { type: Date },
  },
  { timestamps: true },
);

export default mongoose.models.Testimonial ||
  mongoose.model("Testimonial", testimonialSchema);
