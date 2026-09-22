import { notFound } from "next/navigation";
import AdminPlaceholder from "@/components/admin/AdminPlaceholder";
import HeroManager from "@/components/admin/HeroManager";
import AboutManager from "@/components/admin/AboutManager";
import EducationManager from "@/components/admin/EducationManager";
import LearningManager from "@/components/admin/LearningManager";
import SkillsManager from "@/components/admin/SkillsManager";
import ProjectsManager from "@/components/admin/ProjectsManager";
import TestimonialsManager from "@/components/admin/TestimonialsManager";

const sections = {
  hero: "Hero",
  about: "About",
  education: "Education",
  learning: "Learning",
  skills: "Skills",
  projects: "Projects",
  testimonials: "Testimonials",
  contact: "Contact",
  "social-links": "Social Links",
};

export default async function AdminSectionPage({ params }) {
  const { section } = await params;
  const title = sections[section];

  if (!title) notFound();

  if (section === "hero") return <HeroManager />;
  if (section === "about") return <AboutManager />;
  if (section === "education") return <EducationManager />;
  if (section === "learning") return <LearningManager />;
  if (section === "skills") return <SkillsManager />;
  if (section === "projects") return <ProjectsManager />;
  if (section === "testimonials") return <TestimonialsManager />;

  return <AdminPlaceholder title={title} />;
}
