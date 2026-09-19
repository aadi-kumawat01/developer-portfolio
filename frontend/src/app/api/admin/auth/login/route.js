import { NextResponse } from "next/server";
import {
  createAdminSession, isSameOrigin, SESSION_COOKIE, SESSION_SECONDS, validAdminCredentials,
} from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(request) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });

  const form = await request.formData();
  const username = String(form.get("username") || "");
  const password = String(form.get("password") || "");
  if (username.length > 200 || password.length > 500) {
    return NextResponse.redirect(new URL("/admin/login?error=1", request.url), 303);
  }

  try {
    if (!await validAdminCredentials(username, password)) {
      return NextResponse.redirect(new URL("/admin/login?error=1", request.url), 303);
    }
    const response = NextResponse.redirect(new URL("/admin", request.url), 303);
    response.cookies.set(SESSION_COOKIE, createAdminSession(), {
      httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict",
      path: "/", maxAge: SESSION_SECONDS,
    });
    return response;
  } catch {
    return NextResponse.json({ error: "Admin authentication is not configured" }, { status: 503 });
  }
}
