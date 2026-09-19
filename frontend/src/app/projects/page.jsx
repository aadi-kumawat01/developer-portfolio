import { AllProjects } from "@/components/projects/AllProjects";
import { portfolio } from "@/data/portfolio";

export default function ProjectsPage() {
  return (
    <AllProjects projects={portfolio.projects.items} />
  );
}