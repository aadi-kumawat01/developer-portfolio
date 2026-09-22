import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPublicProject } from "@/lib/content/projects";

function ProjectAction({ href, children, primary = false }) {
  const className = `inline-flex min-h-11 items-center justify-center rounded-full px-5 text-sm font-bold transition-colors ${
    primary
      ? "bg-[var(--primary)] text-white hover:brightness-110"
      : "border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] hover:border-[var(--primary)]/60 hover:text-[var(--accent)]"
  }`;

  if (!href) {
    return (
      <span
        aria-disabled="true"
        className={`${className} cursor-not-allowed opacity-45`}
      >
        {children} unavailable
      </span>
    );
  }

  return (
    <a href={href} target="_blank" rel="noreferrer" className={className}>
      {children}
    </a>
  );
}

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="max-w-2xl">
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[var(--accent)]">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-2xl font-bold tracking-[-0.045em] text-[var(--foreground)] sm:text-3xl">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
          {description}
        </p>
      )}
    </div>
  );
}

function ProjectImage({ src, alt, className = "" }) {
  if (!src) {
    return (
      <div
        className={`grid min-h-56 place-items-center bg-[var(--foreground)]/[0.035] px-6 text-center text-sm font-semibold text-[var(--muted)] ${className}`}
      >
        Project preview will be added soon.
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="object-cover object-top"
      />
    </div>
  );
}

export default async function ProjectDetailsPage({ params }) {
  const { slug } = await params;
  const project = await getPublicProject(slug);

  if (!project) {
    notFound();
  }

  const overview = Array.isArray(project.fullDescription)
    ? project.fullDescription
    : [project.fullDescription || project.description];
  const techStack = project.techStack || [];
  const features = project.features || [];
  const highlights = project.technicalHighlights || [];
  const challenges = project.challenges || [];
  const screenshots = project.screenshots || [];
  const quickInfo = [
    { label: "Project Type", value: project.projectType || project.type },
    { label: "Status", value: project.status || "Not specified" },
    { label: "Responsive", value: project.responsive || "Not specified" },
    { label: "Admin", value: project.admin || "Not Applicable" },
  ];

  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <div className="mx-auto w-full max-w-6xl">
        <Link
          href="/projects"
          className="inline-flex min-h-10 items-center rounded-full border border-[var(--border)] bg-[var(--surface)]/60 px-4 text-xs font-semibold text-[var(--muted)] transition-colors hover:border-[var(--primary)]/50 hover:text-[var(--foreground)]"
        >
          ← All Projects
        </Link>

        <section className="mt-8 overflow-hidden rounded-[28px] border border-[var(--border)] bg-[var(--surface)]/45 sm:mt-10">
          <div className="grid lg:grid-cols-[1fr_1.05fr]">
            <div className="flex flex-col justify-center p-6 sm:p-9 lg:p-12">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[var(--accent)]">
                Projects / {project.title}
              </p>
              <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--muted)]">
                {project.type}
              </p>
              <h1 className="mt-3 text-4xl font-bold leading-[0.95] tracking-[-0.06em] text-[var(--foreground)] sm:text-5xl">
                {project.title}
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-7 text-[var(--muted)] sm:text-base">
                {project.shortDescription || project.description}
              </p>

              {project.stack?.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {project.stack.map((technology) => (
                    <span
                      key={technology}
                      className="rounded-full border border-[var(--border)] bg-[var(--foreground)]/[0.035] px-3 py-1.5 text-[10px] font-bold text-[var(--muted)]"
                    >
                      {technology}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <ProjectAction href={project.liveHref} primary>
                  Live Demo ↗
                </ProjectAction>
                <ProjectAction href={project.githubHref}>
                  GitHub
                </ProjectAction>
              </div>
            </div>

            <div className="min-h-72 border-t border-[var(--border)] bg-black/20 lg:min-h-full lg:border-l lg:border-t-0">
              <ProjectImage
                src={project.thumbnail || project.image}
                alt={`${project.title} project preview`}
                className="min-h-72 lg:min-h-full"
              />
            </div>
          </div>
        </section>

        <section className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickInfo.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/45 p-5"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--muted)]/65">
                {item.label}
              </p>
              <p className="mt-2 text-sm font-bold text-[var(--foreground)]">
                {item.value}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-16">
          <SectionHeading eyebrow="Overview" title="Project Overview" />
          <div className="mt-6 max-w-3xl space-y-4 text-sm leading-7 text-[var(--muted)] sm:text-base">
            {overview.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>

        {features.length > 0 && (
          <section className="mt-16">
            <SectionHeading eyebrow="Capabilities" title="Key Features" />
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {features.map((feature) => (
                <article
                  key={feature.title}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/45 p-5 sm:p-6"
                >
                  <h3 className="text-base font-bold text-[var(--foreground)]">
                    {feature.title}
                  </h3>
                  <ul className="mt-4 space-y-2.5 text-sm leading-6 text-[var(--muted)]">
                    {feature.items.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>
        )}

        {techStack.length > 0 && (
          <section className="mt-16">
            <SectionHeading eyebrow="Technology" title="Tech Stack" />
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {techStack.map((group) => (
                <article
                  key={group.title}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/45 p-5"
                >
                  <h3 className="text-sm font-bold text-[var(--foreground)]">
                    {group.title}
                  </h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-[var(--border)] px-2.5 py-1 text-[10px] font-bold text-[var(--muted)]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {highlights.length > 0 && (
          <section className="mt-16">
            <SectionHeading
              eyebrow="Implementation"
              title="Technical Highlights"
            />
            <div className="mt-6 flex flex-wrap gap-3">
              {highlights.map((highlight) => (
                <span
                  key={highlight}
                  className="rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/[0.06] px-4 py-2 text-xs font-bold text-[var(--foreground)]"
                >
                  {highlight}
                </span>
              ))}
            </div>
          </section>
        )}

        {challenges.length > 0 && (
          <section className="mt-16">
            <SectionHeading eyebrow="Problem Solving" title="Project Challenges" />
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {challenges.map((challenge) => (
                <article
                  key={challenge.title}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/45 p-5"
                >
                  <h3 className="text-base font-bold text-[var(--foreground)]">
                    {challenge.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                    {challenge.description}
                  </p>
                </article>
              ))}
            </div>
          </section>
        )}

        {screenshots.length > 0 && (
          <section className="mt-16">
            <SectionHeading eyebrow="Visuals" title="Project Preview" />
            <div
              className={`mt-6 grid gap-4 ${
                screenshots.length === 1 ? "grid-cols-1" : "md:grid-cols-2"
              }`}
            >
              {screenshots.map((screenshot, index) => (
                <div
                  key={screenshot}
                  className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]"
                >
                  <ProjectImage
                    src={screenshot}
                    alt={`${project.title} preview ${index + 1}`}
                    className="aspect-[16/10]"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mt-16 rounded-[28px] border border-[var(--primary)]/30 bg-[var(--primary)]/[0.06] p-6 sm:p-9">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--accent)]">
            Explore More
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-[-0.045em] text-[var(--foreground)] sm:text-3xl">
            Interested in exploring this project?
          </h2>
          <div className="mt-6 grid gap-3 sm:flex sm:flex-wrap">
            <ProjectAction href={project.liveHref} primary>
              Live Demo ↗
            </ProjectAction>
            <ProjectAction href={project.githubHref}>
              GitHub Repository
            </ProjectAction>
            <Link
              href="/#projects"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-5 text-sm font-bold text-[var(--foreground)] transition-colors hover:border-[var(--primary)]/60 hover:text-[var(--accent)]"
            >
              Back to Projects
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
