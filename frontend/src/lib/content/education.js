import { getPublicResponse } from "@/lib/content/public";

async function getPublicItems(path) {
  try {
    const response = await getPublicResponse(path);
    return response.ok && Array.isArray(response.data) ? response.data : [];
  } catch {
    return [];
  }
}

export async function getPublicEducationContent() {
  const [education, learning] = await Promise.all([
    getPublicItems("/api/education"),
    getPublicItems("/api/learning"),
  ]);

  return { education, learning };
}
