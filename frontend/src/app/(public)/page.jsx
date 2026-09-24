import { Suspense } from "react";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Education } from "@/components/sections/Education";
import { Skills } from "@/components/sections/Skills";
import { Projects } from "@/components/sections/Projects";
import Testimonials from "@/components/sections/Testimonials";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/layout/Footer";
import { ContactSkeleton, EducationSkeleton, FeaturedProjectsSkeleton, HeroAboutSkeleton, SkillsSkeleton, TestimonialsSkeleton } from "@/components/loading/PublicSectionSkeletons";
import { getPortfolio } from "@/lib/content/portfolio";
import { getPublicSiteContent, hasSiteContent } from "@/lib/content/site";
import { getPublicEducationContent } from "@/lib/content/education";
import { getPublicSkillsContent } from "@/lib/content/skills";
import { getFeaturedProjects } from "@/lib/content/projects";
import { getPublicTestimonials } from "@/lib/content/testimonials";
import { getPublicContactContent } from "@/lib/content/contact";

export default function HomePage() {
  const { hero, about, contact, profile } = getPortfolio();
  return <main id="main-content" tabIndex={-1}>
    <Suspense fallback={<HeroAboutSkeleton />}><HeroAboutContent hero={hero} about={about} profile={profile} /></Suspense>
    <Suspense fallback={<EducationSkeleton />}><EducationContent /></Suspense>
    <Suspense fallback={<SkillsSkeleton />}><SkillsContent /></Suspense>
    <Suspense fallback={<FeaturedProjectsSkeleton />}><FeaturedProjectsContent /></Suspense>
    <Suspense fallback={<TestimonialsSkeleton />}><TestimonialsContent /></Suspense>
    <Suspense fallback={<ContactSkeleton />}><ContactContent contact={contact} profile={profile} /></Suspense>
    <Footer />
  </main>;
}

async function HeroAboutContent({ hero, about, profile }) {
  const siteContent = await getPublicSiteContent();
  const cmsHeroIsReady = hasSiteContent(siteContent?.hero);
  const cmsAboutIsReady = hasSiteContent(siteContent?.about) || siteContent?.aboutStats?.length || siteContent?.aboutHighlights?.length;
  const cmsHero = siteContent?.hero;
  const cmsAbout = siteContent?.about;
  const cmsName = [cmsHero?.firstName, cmsHero?.lastName].filter(Boolean).join(" ");
  const cmsProfile = { ...profile, ...(cmsHeroIsReady && { name: cmsName || profile.name, role: cmsHero.role || profile.role }), ...(cmsAboutIsReady && { location: cmsAbout.locationText || profile.location, profileImageUrl: cmsAbout.imageUrl || profile.profileImageUrl, developerLabel: cmsAbout.developerLabel || "Developer" }) };
  const cmsHeroData = cmsHeroIsReady ? { ...hero, availability: cmsHero.eyebrow || hero.availability, headline: cmsHero.role || hero.headline, description: cmsHero.description || hero.description, primaryCtaLabel: cmsHero.primaryCta?.label || hero.primaryCtaLabel, primaryCtaHref: cmsHero.primaryCta?.href || "/#projects", secondaryCtaLabel: cmsHero.secondaryCta?.label || hero.secondaryCtaLabel, secondaryCtaHref: cmsHero.secondaryCta?.href || "/#contact" } : hero;
  const cmsAboutData = cmsAboutIsReady ? { ...about, eyebrow: cmsAbout.eyebrow || about.eyebrow, heading: cmsAbout.heading || about.heading, description: cmsAbout.description || about.description, stats: (siteContent.aboutStats || []).map(({ value, label }) => ({ value, label })), services: (siteContent.aboutHighlights || []).map(({ title }) => title) } : about;
  return <>{(!cmsHeroIsReady || cmsHero.visible !== false) && <Hero hero={cmsHeroData} profile={cmsProfile} />}{(!cmsAboutIsReady || cmsAbout.visible !== false) && <About about={cmsAboutData} profile={cmsProfile} />}</>;
}

async function EducationContent() { const content = await getPublicEducationContent(); return <Education items={content.education} learningItems={content.learning} />; }
async function SkillsContent() { return <Skills cmsCategories={await getPublicSkillsContent()} />; }
async function FeaturedProjectsContent() { return <Projects cmsItems={await getFeaturedProjects()} />; }
async function TestimonialsContent() { return <Testimonials items={await getPublicTestimonials()} />; }
async function ContactContent({ contact, profile }) { const content = await getPublicContactContent(); const cmsContactIsReady = hasSiteContent(content.contact); const cmsContactData = cmsContactIsReady ? { ...contact, ...content.contact } : contact; return (!cmsContactIsReady || content.contact.visible !== false) && <Contact contact={cmsContactData} profile={profile} socialLinks={content.socialLinks} />; }
