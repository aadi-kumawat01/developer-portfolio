import { HeroBackground } from "@/components/hero/HeroBackground";
import { HeroContent } from "@/components/hero/HeroContent";

export function Hero({ hero, profile }) {
  return (
    <section
      id="home"
      className="relative isolate grid min-h-[min(42rem,82svh)] scroll-mt-24 items-end overflow-clip bg-[var(--background)] px-4 pb-8 pt-24 sm:px-6 md:min-h-[min(44rem,70svh)] md:px-8 md:pb-10 min-[1152px]:!min-h-svh min-[1152px]:items-center min-[1152px]:px-12 min-[1152px]:pb-16 min-[1152px]:pt-28"
    >
      <HeroBackground />
      <HeroContent hero={hero} profile={profile} />
    </section>
  );
}
