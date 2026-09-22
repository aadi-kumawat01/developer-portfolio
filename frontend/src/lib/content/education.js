const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function getPublicItems(path) {
  try {
    const response = await fetch(`${apiBaseUrl}${path}`, { cache: "no-store" });
    if (!response.ok) return [];

    const payload = await response.json();
    return payload?.success && Array.isArray(payload.data) ? payload.data : [];
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
