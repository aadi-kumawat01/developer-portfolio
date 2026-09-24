"use client";

import { useEffect } from "react";
import { useSiteEntry } from "@/components/loading/SiteEntryLoader";

function Block({ className = "" }) { return <span className={`block animate-pulse rounded-xl bg-white/[0.07] ${className}`} />; }

export function HeroAboutSkeleton() {
  const { markHeroSettled } = useSiteEntry();
  useEffect(() => { markHeroSettled(); }, [markHeroSettled]);
  return <><section id="home" className="min-h-[620px] px-4 pb-20 pt-32 sm:px-6 lg:px-8"><div className="mx-auto max-w-6xl"><Block className="h-4 w-36" /><Block className="mt-6 h-16 max-w-2xl" /><Block className="mt-5 h-24 max-w-xl" /><div className="mt-9 flex gap-3"><Block className="h-11 w-32" /><Block className="h-11 w-32" /></div></div></section><section id="about" className="px-4 py-16 sm:px-6 lg:px-8"><div className="mx-auto grid max-w-6xl gap-7 lg:grid-cols-[.8fr_1.2fr]"><Block className="h-80" /><div><Block className="h-4 w-24" /><Block className="mt-5 h-11 max-w-xl" /><Block className="mt-5 h-28" /></div></div></section></>;
}

export function EducationSkeleton() { return <SectionSkeleton id="education" titleWidth="w-32" cards={3} cardClass="h-52" />; }
export function SkillsSkeleton() { return <SectionSkeleton id="skills" titleWidth="w-24" cards={6} cardClass="h-28" gridClass="sm:grid-cols-2 lg:grid-cols-3" />; }
export function FeaturedProjectsSkeleton() { return <SectionSkeleton id="projects" titleWidth="w-40" cards={3} cardClass="h-72" gridClass="md:grid-cols-3" />; }
export function TestimonialsSkeleton() { return <SectionSkeleton id="testimonials" titleWidth="w-28" cards={3} cardClass="h-72" gridClass="md:grid-cols-3" />; }
export function ContactSkeleton() { return <SectionSkeleton id="contact" titleWidth="w-24" cards={2} cardClass="h-56" gridClass="md:grid-cols-2" />; }

function SectionSkeleton({ id, titleWidth, cards, cardClass, gridClass = "sm:grid-cols-3" }) {
  return <section id={id} aria-label="Loading section" className="px-4 py-16 sm:px-6 lg:px-8 lg:py-28"><div className="mx-auto max-w-6xl"><Block className={`h-4 ${titleWidth}`} /><Block className="mt-5 h-11 max-w-xl" /><Block className="mt-4 h-6 max-w-2xl" /><div className={`mt-10 grid gap-4 ${gridClass}`}>{Array.from({ length: cards }, (_, index) => <Block key={index} className={cardClass} />)}</div></div></section>;
}
