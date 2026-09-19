import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { isAdminRequest, isSameOrigin } from "@/lib/admin-auth";

export function json(data, status = 200) {
  return NextResponse.json(data, { status, headers: { "Cache-Control": "no-store" } });
}

export function requireAdmin(request, mutation = false) {
  if (!isAdminRequest(request)) return json({ error: "Unauthorized" }, 401);
  if (mutation && !isSameOrigin(request)) return json({ error: "Invalid request origin" }, 403);
  return null;
}

export async function readBody(request) {
  const text = await request.text();
  if (text.length > 1_000_000) throw new Error("Request body is too large.");
  let body;
  try { body = JSON.parse(text); } catch { throw new Error("Invalid JSON body."); }
  if (!body || Array.isArray(body) || typeof body !== "object") throw new Error("Expected a JSON object.");
  function hasUnsafeKey(value) {
    if (!value || typeof value !== "object") return false;
    return Object.entries(value).some(([key, nested]) =>
      key.startsWith("$") || key.includes(".") || hasUnsafeKey(nested),
    );
  }
  if (hasUnsafeKey(body)) throw new Error("Invalid field name.");
  return body;
}

export function apiError(error) {
  if (error.message === "MONGODB_URI is not configured." || error.message.startsWith("MongoDB connection failed")) {
    return json({ error: "Database unavailable" }, 503);
  }
  if (error instanceof mongoose.Error.ValidationError || error instanceof mongoose.Error.CastError || error instanceof mongoose.Error.StrictModeError) {
    return json({ error: "Invalid content", details: error.message }, 400);
  }
  if (error.code === 11000) return json({ error: "A value must be unique" }, 409);
  if (error.message === "Invalid JSON body." || error.message === "Expected a JSON object." || error.message === "Request body is too large." || error.message === "Invalid field name.") {
    return json({ error: error.message }, 400);
  }
  return json({ error: "Request failed" }, 500);
}
