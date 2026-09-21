import { notFound } from "next/navigation";
import AdminPlaceholder from "@/components/admin/AdminPlaceholder";
import HeroManager from "@/components/admin/HeroManager";
import AboutManager from "@/components/admin/AboutManager";

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

  return <AdminPlaceholder title={title} />;
}
