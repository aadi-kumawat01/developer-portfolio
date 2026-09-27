import { getPublicResponse } from "@/lib/content/public";

export async function getPublicSiteContent() {
  try {
    const response = await getPublicResponse("/api/site");
    return response.ok ? response.data : null;
  } catch {
    return null;
  }
}

export function hasSiteContent(section) {
  if (!section || typeof section !== "object") return false;
  if (section.visible === false) return true;

  return Object.entries(section).some(([key, value]) => {
    if (key === "visible") return false;
    if (typeof value === "string") return Boolean(value.trim());
    if (value && typeof value === "object") {
      return Object.values(value).some((item) => typeof item === "string" && item.trim());
    }
    return false;
  });
}
