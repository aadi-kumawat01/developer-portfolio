const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function getPublicData(path, fallback) {
  try {
    const response = await fetch(`${apiBaseUrl}${path}`, { cache: "no-store" });
    if (!response.ok) return fallback;
    const payload = await response.json();
    return payload?.success ? payload.data : fallback;
  } catch {
    return fallback;
  }
}

export async function getPublicContactContent() {
  const [contact, socialLinks] = await Promise.all([
    getPublicData("/api/contact", null),
    getPublicData("/api/social-links", []),
  ]);

  return { contact, socialLinks: Array.isArray(socialLinks) ? socialLinks : [] };
}
