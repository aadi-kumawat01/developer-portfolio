import { connectDB } from "@/lib/db";
import { resources } from "@/lib/cms/resources";
import { apiError, json, readBody, requireAdmin } from "@/lib/cms/api";

export const runtime = "nodejs";

export async function GET(request, { params }) {
  const denied = requireAdmin(request);
  if (denied) return denied;
  const { resource } = await params;
  const config = resources[resource];
  if (!config) return json({ error: "Not found" }, 404);
  try {
    await connectDB();
    const data = config.single
      ? await config.Model.findOne({ key: "main" }).lean()
      : await config.Model.find().sort({ order: 1, createdAt: -1 }).lean();
    return json({ data });
  } catch (error) { return apiError(error); }
}

export async function POST(request, { params }) {
  const denied = requireAdmin(request, true);
  if (denied) return denied;
  const { resource } = await params;
  const config = resources[resource];
  if (!config || config.single) return json({ error: "Not found" }, 404);
  try {
    const body = await readBody(request);
    if (resource === "projects" && "featuredOrder" in body) return json({ error: "Use the featured-projects endpoint to set homepage projects" }, 400);
    await connectDB();
    const data = await config.Model.create(body);
    return json({ data }, 201);
  } catch (error) { return apiError(error); }
}

export async function PUT(request, { params }) {
  const denied = requireAdmin(request, true);
  if (denied) return denied;
  const { resource } = await params;
  if (resource !== "portfolio") return json({ error: "Not found" }, 404);
  try {
    const body = await readBody(request);
    if ("key" in body || "_id" in body) return json({ error: "Immutable fields cannot be changed" }, 400);
    await connectDB();
    const data = await resources.portfolio.Model.findOneAndUpdate(
      { key: "main" }, { $set: body }, { upsert: true, new: true, runValidators: true },
    );
    return json({ data });
  } catch (error) { return apiError(error); }
}
