import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { FeaturedSelection, Project } from "@/lib/cms/models";
import { apiError, json, readBody, requireAdmin } from "@/lib/cms/api";

export const runtime = "nodejs";

export async function PUT(request) {
  const denied = requireAdmin(request, true);
  if (denied) return denied;
  try {
    const { ids } = await readBody(request);
    if (!Array.isArray(ids) || ids.length !== 3 || new Set(ids).size !== 3 || !ids.every(mongoose.isValidObjectId)) {
      return json({ error: "Choose exactly three different project IDs in display order" }, 400);
    }
    await connectDB();
    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        await FeaturedSelection.findOneAndUpdate(
          { key: "main" }, { $inc: { revision: 1 } }, { upsert: true, session },
        );
        const count = await Project.countDocuments({ _id: { $in: ids }, visible: true }).session(session);
        if (count !== 3) throw new Error("FEATURED_SELECTION_INVALID");
        await Project.updateMany({ featuredOrder: { $ne: null } }, { $set: { featuredOrder: null } }, { session });
        for (let index = 0; index < ids.length; index++) {
          await Project.updateOne({ _id: ids[index] }, { $set: { featuredOrder: index + 1 } }, { session });
        }
      });
    } finally { await session.endSession(); }
    return json({ data: ids });
  } catch (error) {
    if (error.message === "FEATURED_SELECTION_INVALID") return json({ error: "All selected projects must exist and be visible" }, 400);
    return apiError(error);
  }
}
