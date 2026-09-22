import { getPublicResponse } from "@/lib/content/public";

export async function getPublicContactContent() {
  const [contactResponse, socialLinksResponse] = await Promise.all([
    getPublicResponse("/api/contact"),
    getPublicResponse("/api/social-links"),
  ]);

  return {
    contact: contactResponse.ok ? contactResponse.data : null,
    socialLinks: socialLinksResponse.ok && Array.isArray(socialLinksResponse.data)
      ? socialLinksResponse.data
      : null,
  };
}
