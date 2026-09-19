import { connectDB } from "@/lib/db";
import { resources } from "@/lib/cms/resources";
import { apiError, json } from "@/lib/cms/api";

export const runtime = "nodejs";

export async function GET(_request, { params }) {
  const { resource } = await params;
  const config = resources[resource];
  if (!config) return json({ error: "Not found" }, 404);

  try {
    await connectDB();
    if (config.single) {
      const item = await config.Model.findOne({ key: "main" }).lean();
      return json({ data: item });
    }
    const items = await config.Model.find({ visible: true }).sort({ order: 1, createdAt: -1 }).lean();
    return json({ data: items });
  } catch (error) {
    return apiError(error);
  }
}
