import { getPublicResponse } from "@/lib/content/public";

export async function getPublicSkillsContent() {
  try {
    const response = await getPublicResponse("/api/skills");
    return response.ok && Array.isArray(response.data) ? response.data : [];
  } catch {
    return [];
  }
}
