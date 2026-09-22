export const publicApiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function getPublicResponse(path) {
  try {
    const response = await fetch(`${publicApiBaseUrl}${path}`, { cache: "no-store" });
    if (!response.ok) return { ok: false, data: null };

    const payload = await response.json();
    return payload?.success ? { ok: true, data: payload.data } : { ok: false, data: null };
  } catch {
    return { ok: false, data: null };
  }
}
