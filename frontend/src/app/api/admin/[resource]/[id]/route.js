import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { resources } from "@/lib/cms/resources";
import { apiError, json, readBody, requireAdmin } from "@/lib/cms/api";

export const runtime = "nodejs";

async function target(params) {
  const { resource, id } = await params;
  const config = resources[resource];
  if (!config || config.single) return { error: json({ error: "Not found" }, 404) };
  if (!mongoose.isValidObjectId(id)) return { error: json({ error: "Invalid ID" }, 400) };
  return { resource, id, Model: config.Model };
}

export async function PATCH(request, { params }) {
  const denied = requireAdmin(request, true);
  if (denied) return denied;
  const entry = await target(params);
  if (entry.error) return entry.error;
  try {
    const body = await readBody(request);
    if ("_id" in body || "createdAt" in body || "updatedAt" in body || (entry.resource === "projects" && "featuredOrder" in body)) {
      return json({ error: "Immutable or managed fields cannot be changed" }, 400);
    }
    await connectDB();
    const data = await entry.Model.findByIdAndUpdate(entry.id, { $set: body }, { new: true, runValidators: true });
    return data ? json({ data }) : json({ error: "Not found" }, 404);
  } catch (error) { return apiError(error); }
}

export async function DELETE(request, { params }) {
  const denied = requireAdmin(request, true);
  if (denied) return denied;
  const entry = await target(params);
  if (entry.error) return entry.error;
  try {
    await connectDB();
    const data = await entry.Model.findByIdAndDelete(entry.id);
    return data ? json({ data: { id: entry.id } }) : json({ error: "Not found" }, 404);
  } catch (error) { return apiError(error); }
}
