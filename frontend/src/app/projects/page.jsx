import { AllProjects } from "@/components/projects/AllProjects";
import { getPublicProjectCategories, getPublicProjects } from "@/lib/content/projects";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const [cmsProjects, cmsCategories] = await Promise.all([
    getPublicProjects(),
    getPublicProjectCategories(),
  ]);

  return (
    <AllProjects projects={cmsProjects} categories={cmsCategories} />
  );
}
