import { publicApiBaseUrl } from "@/lib/content/public";

export async function getPublicSkillsContent() {
  try {
    const response = await fetch(`${publicApiBaseUrl}/api/skills`, { cache: "no-store" });
    if (!response.ok) return [];

    const payload = await response.json();
    return payload?.success && Array.isArray(payload.data) ? payload.data : [];
  } catch {
    return [];
  }
}
