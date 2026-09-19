import {
  SiteContent, Education, Learning, SkillCategory, Skill,
  ProjectCategory, Project, Testimonial, SocialLink,
} from "@/lib/cms/models";

export const resources = {
  portfolio: { Model: SiteContent, single: true },
  education: { Model: Education },
  learning: { Model: Learning },
  "skill-categories": { Model: SkillCategory },
  skills: { Model: Skill },
  "project-categories": { Model: ProjectCategory },
  projects: { Model: Project },
  testimonials: { Model: Testimonial },
  "social-links": { Model: SocialLink },
};
