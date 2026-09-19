import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";

export function proxy(request) {
  const path = request.nextUrl.pathname;
  if (path === "/admin/login" || path === "/api/admin/auth/login") return NextResponse.next();
  if (isAdminRequest(request)) return NextResponse.next();

  if (path.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.redirect(new URL("/admin/login", request.url));
}

export const config = { matcher: ["/admin/:path*", "/api/admin/:path*"] };
