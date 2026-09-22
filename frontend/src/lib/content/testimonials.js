import { publicApiBaseUrl } from "@/lib/content/public";

export async function getPublicTestimonials() {
  try {
    const response = await fetch(`${publicApiBaseUrl}/api/testimonials`, { cache: "no-store" });
    if (!response.ok) return [];
    const payload = await response.json();
    return payload?.success && Array.isArray(payload.data) ? payload.data : [];
  } catch {
    return [];
  }
}
