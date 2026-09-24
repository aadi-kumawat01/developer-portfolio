import { notFound } from "next/navigation";
import AdminPlaceholder from "@/components/admin/AdminPlaceholder";
import HeroManager from "@/components/admin/HeroManager";
import AboutManager from "@/components/admin/AboutManager";
import EducationManager from "@/components/admin/EducationManager";
import LearningManager from "@/components/admin/LearningManager";
import SkillsManager from "@/components/admin/SkillsManager";
import ProjectsManager from "@/components/admin/ProjectsManager";
import TestimonialsManager from "@/components/admin/TestimonialsManager";
import ContactManager from "@/components/admin/ContactManager";
import SocialLinksManager from "@/components/admin/SocialLinksManager";
import ResumeManager from "@/components/admin/ResumeManager";

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
  resume: "Resume",
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
  if (section === "contact") return <ContactManager />;
  if (section === "social-links") return <SocialLinksManager />;
  if (section === "resume") return <ResumeManager />;

  return <AdminPlaceholder title={title} />;
}
