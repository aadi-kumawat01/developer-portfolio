import { getPublicResponse } from "@/lib/content/public";

export async function getPublicTestimonials() {
  try {
    const response = await getPublicResponse("/api/testimonials");
    return response.ok && Array.isArray(response.data) ? response.data : [];
  } catch {
    return [];
  }
}
