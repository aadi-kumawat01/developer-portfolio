import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Education } from "@/components/sections/Education";
import { Skills } from "@/components/sections/Skills";
import { Projects } from "@/components/sections/Projects";
import { getPortfolio } from "@/lib/content/portfolio";
import Testimonials from "@/components/sections/Testimonials";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/layout/Footer";

export default function HomePage() {
  const {
    hero,
    about,
    skills,
    projects,
    contact,
    profile,
  } = getPortfolio();

  return (
    <main id="main-content" tabIndex={-1}>
      <Hero hero={hero} profile={profile} />

      <About
        about={about}
        profile={profile}
      />
      <Education />

      <Skills skills={skills} />

      <Projects projects={projects} />
      <Testimonials />
      <Contact contact={contact} profile={profile} />
      <Footer />
    </main>
  );
}