import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Education } from "@/components/sections/Education";
import { Skills } from "@/components/sections/Skills";
import { Projects } from "@/components/sections/Projects";
import { getPortfolio } from "@/lib/content/portfolio";
import { getPublicSiteContent, hasSiteContent } from "@/lib/content/site";
import { getPublicEducationContent } from "@/lib/content/education";
import { getPublicSkillsContent } from "@/lib/content/skills";
import { getFeaturedProjects } from "@/lib/content/projects";
import { getPublicTestimonials } from "@/lib/content/testimonials";
import { getPublicContactContent } from "@/lib/content/contact";
import Testimonials from "@/components/sections/Testimonials";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/layout/Footer";

export default async function HomePage() {
  const {
    hero,
    about,
    skills,
    projects,
    contact,
    profile,
  } = getPortfolio();
  const siteContent = await getPublicSiteContent();
  const publicEducationContent = await getPublicEducationContent();
  const publicSkillsContent = await getPublicSkillsContent();
  const featuredProjects = await getFeaturedProjects();
  const testimonials = await getPublicTestimonials();
  const publicContactContent = await getPublicContactContent();
  const cmsHeroIsReady = hasSiteContent(siteContent?.hero);
  const cmsAboutIsReady = hasSiteContent(siteContent?.about)
    || siteContent?.aboutStats?.length
    || siteContent?.aboutHighlights?.length;
  const cmsHero = siteContent?.hero;
  const cmsAbout = siteContent?.about;
  const cmsName = [cmsHero?.firstName, cmsHero?.lastName].filter(Boolean).join(" ");
  const cmsProfile = {
    ...profile,
    ...(cmsHeroIsReady && {
      name: cmsName || profile.name,
      role: cmsHero.role || profile.role,
    }),
    ...(cmsAboutIsReady && {
      location: cmsAbout.locationText || profile.location,
      profileImageUrl: cmsAbout.imageUrl || profile.profileImageUrl,
      developerLabel: cmsAbout.developerLabel || "Developer",
    }),
  };
  const cmsHeroData = cmsHeroIsReady
    ? {
      ...hero,
      availability: cmsHero.eyebrow || hero.availability,
      headline: cmsHero.role || hero.headline,
      description: cmsHero.description || hero.description,
      primaryCtaLabel: cmsHero.primaryCta?.label || hero.primaryCtaLabel,
      primaryCtaHref: cmsHero.primaryCta?.href || "/#projects",
      secondaryCtaLabel: cmsHero.secondaryCta?.label || hero.secondaryCtaLabel,
      secondaryCtaHref: cmsHero.secondaryCta?.href || "/#contact",
    }
    : hero;
  const cmsAboutData = cmsAboutIsReady
    ? {
      ...about,
      eyebrow: cmsAbout.eyebrow || about.eyebrow,
      heading: cmsAbout.heading || about.heading,
      description: cmsAbout.description || about.description,
      stats: siteContent.aboutStats?.length
        ? siteContent.aboutStats.map(({ value, label }) => ({ value, label }))
        : about.stats,
      services: siteContent.aboutHighlights?.length
        ? siteContent.aboutHighlights.map(({ title }) => title)
        : about.services,
    }
    : about;
  const cmsContact = publicContactContent.contact;
  const cmsContactIsReady = hasSiteContent(cmsContact);
  const cmsContactData = cmsContactIsReady ? { ...contact, ...cmsContact } : contact;

  return (
    <main id="main-content" tabIndex={-1}>
      {(!cmsHeroIsReady || cmsHero.visible !== false) && <Hero hero={cmsHeroData} profile={cmsProfile} />}

      {(!cmsAboutIsReady || cmsAbout.visible !== false) && <About about={cmsAboutData} profile={cmsProfile} />}
      <Education items={publicEducationContent.education} learningItems={publicEducationContent.learning} />

      <Skills skills={skills} cmsCategories={publicSkillsContent} />

      <Projects projects={projects} cmsItems={featuredProjects} />
      <Testimonials items={testimonials} />
      {(!cmsContactIsReady || cmsContact.visible !== false) && <Contact contact={cmsContactData} profile={profile} socialLinks={publicContactContent.socialLinks} />}
      <Footer />
    </main>
  );
}
