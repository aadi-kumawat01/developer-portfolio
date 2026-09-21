import { notFound } from "next/navigation";
import AdminPlaceholder from "@/components/admin/AdminPlaceholder";

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

  return <AdminPlaceholder title={title} />;
}
