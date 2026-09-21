import { forwardAdminRequest } from "@/lib/admin-auth-proxy";

export async function POST(request) {
  return forwardAdminRequest(request, "login");
}
