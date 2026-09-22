const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function getPublicTestimonials() {
  try {
    const response = await fetch(`${apiBaseUrl}/api/testimonials`, { cache: "no-store" });
    if (!response.ok) return [];
    const payload = await response.json();
    return payload?.success && Array.isArray(payload.data) ? payload.data : [];
  } catch {
    return [];
  }
}
