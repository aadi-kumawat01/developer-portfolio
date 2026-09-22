import { AllProjects } from "@/components/projects/AllProjects";
import { portfolio } from "@/data/portfolio";
import { getPublicProjects } from "@/lib/content/projects";

export default async function ProjectsPage() {
  const cmsProjects = await getPublicProjects();
  return (
    <AllProjects projects={cmsProjects.length ? cmsProjects : portfolio.projects.items} />
  );
}
