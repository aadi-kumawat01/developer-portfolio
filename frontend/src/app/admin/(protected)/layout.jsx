import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, validAdminSession } from "@/lib/admin-auth";

export default async function ProtectedAdminLayout({ children }) {
  const session = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!validAdminSession(session)) redirect("/admin/login");
  return children;
}
