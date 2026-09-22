const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export function mapCmsProject(project) {
  const category = typeof project.category === "object" ? project.category : null;
  const statusLabels = { live: "Live Project", development: "In Development", private: "Private" };

  return {
    ...project,
    id: project._id,
    type: category?.name || "Web Development",
    category: category?.slug || "",
    image: project.thumbnailUrl || "",
    thumbnail: project.thumbnailUrl || "",
    description: project.shortDescription || project.description || "",
    shortDescription: project.shortDescription || project.description || "",
    fullDescription: project.description ? [project.description] : [],
    stack: project.techStack || [],
    techStack: project.techStack?.length ? [{ title: "Technology", items: project.techStack }] : [],
    screenshots: project.screenshots || [],
    status: statusLabels[project.status] || project.status || "Not specified",
    projectType: category?.name || "Web Development",
    responsive: "Not specified",
    admin: "Not Applicable",
    detailsHref: project.slug ? `/projects/${project.slug}` : null,
    liveHref: project.liveUrl || "",
    githubHref: project.githubUrl || "",
    features: [],
    technicalHighlights: [],
    challenges: [],
  };
}

async function getPublicData(path) {
  try {
    const response = await fetch(`${apiBaseUrl}${path}`, { cache: "no-store" });
    if (!response.ok) return null;
    const payload = await response.json();
    return payload?.success ? payload.data : null;
  } catch {
    return null;
  }
}

export async function getPublicProjects() {
  const data = await getPublicData("/api/projects");
  return Array.isArray(data) ? data.map(mapCmsProject) : [];
}

export async function getFeaturedProjects() {
  const data = await getPublicData("/api/projects/featured");
  return Array.isArray(data) ? data.map(mapCmsProject) : [];
}

export async function getPublicProject(slug) {
  const data = await getPublicData(`/api/projects/${encodeURIComponent(slug)}`);
  return data ? mapCmsProject(data) : null;
}
