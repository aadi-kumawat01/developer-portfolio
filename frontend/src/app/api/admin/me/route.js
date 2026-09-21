import { forwardAdminRequest } from "@/lib/admin-auth-proxy";

export async function GET(request) {
  return forwardAdminRequest(request, "me");
}
