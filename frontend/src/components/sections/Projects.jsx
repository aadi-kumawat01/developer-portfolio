"use client";

import Link from "next/link";
import { useState } from "react";

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-4 w-4"
    >
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-4 w-4"
    >
      <path
        d="M14 5h5v5M19 5l-8 8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M19 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="h-4 w-4"
    >
      <path d="M12 .8a11.4 11.4 0 0 0-3.6 22.2c.6.1.8-.2.8-.5v-2.2c-3.3.7-4-1.4-4-1.4-.5-1.4-1.3-1.8-1.3-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.6-.3-5.4-1.3-5.4-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0C15.2 4.8 16.2 5 16.2 5c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.4 5.7.4.4.8 1.1.8 2.1v3.2c0 .3.2.7.8.5A11.4 11.4 0 0 0 12 .8Z" />
    </svg>
  );
}

function ViewAllProjectsButton() {
  return (
    <Link
      href="/projects"
      className={`
        group relative isolate
        min-h-14 items-center justify-center gap-4
        overflow-hidden rounded-2xl
        border border-[var(--primary)]/55
        bg-[var(--surface)]/55
        px-5 py-2
        text-[var(--foreground)]
        shadow-[0_10px_35px_color-mix(in_srgb,var(--primary)_12%,transparent)]
        backdrop-blur-xl
        transition-all duration-300
        hover:-translate-y-1
        hover:border-[var(--primary)]/85
        hover:shadow-[0_16px_50px_color-mix(in_srgb,var(--primary)_24%,transparent)]
        active:translate-y-0
        active:scale-[0.98]
        inline-flex w-full max-w-[360px]
      `}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 bg-gradient-to-r from-[var(--primary)]/[0.04] via-[var(--primary)]/[0.13] to-[var(--accent)]/[0.06] opacity-70 transition-opacity duration-300 group-hover:opacity-100"
      />

      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-8 -top-10 -z-10 h-24 w-24 rounded-full bg-[var(--primary)]/20 blur-2xl transition-all duration-500 group-hover:scale-150 group-hover:bg-[var(--primary)]/30"
      />

      <span className="relative flex h-2.5 w-2.5 shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)] opacity-35" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--accent)] shadow-[0_0_12px_var(--primary)]" />
      </span>

      <span className="relative flex flex-col text-left">
        <span className="text-sm font-bold tracking-[-0.02em]">
          View All Projects
        </span>

        <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.13em] text-[var(--muted)] transition-colors duration-300 group-hover:text-[var(--foreground)]/70">
          Explore my complete work
        </span>
      </span>

      <span
        className="
          relative ml-auto grid h-9 w-9 shrink-0
          place-items-center rounded-full
          border border-[var(--primary)]/25
          bg-[var(--primary)]/10
          text-[var(--accent)]
          transition-all duration-300
          group-hover:translate-x-1
          group-hover:border-[var(--primary)]
          group-hover:bg-[var(--primary)]
          group-hover:text-white
          group-hover:shadow-[0_0_22px_color-mix(in_srgb,var(--primary)_35%,transparent)]
        "
      >
        <ArrowIcon />
      </span>
    </Link>
  );
}

function ProjectStatus({ children = "Live Project" }) {
  const isDevelopment =
    String(children).toLowerCase().includes("development");

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--background)]/55 px-2 py-1 text-[8px] font-semibold text-[var(--foreground)] backdrop-blur-xl sm:gap-2 sm:px-3 sm:py-1.5 sm:text-[9px]">
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isDevelopment
            ? "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,.7)]"
            : "bg-emerald-400 shadow-[0_0_8px_rgba(74,222,128,.7)]"
        }`}
      />

      <span className="sm:hidden">{isDevelopment ? "WIP" : "Live"}</span>
      <span className="hidden sm:inline">{children}</span>
    </span>
  );
}

function TechTags({ items = [] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((tech) => (
        <span
          key={tech}
          className="rounded-full border border-[var(--border)] bg-[var(--background)]/55 px-3 py-1.5 text-[10px] font-medium text-[var(--muted)]"
        >
          {tech}
        </span>
      ))}
    </div>
  );
}

function ProjectButton({
  href,
  children,
  primary = false,
  icon,
  compact = false,
}) {
  const classes = primary
    ? `
        ${compact ? "inline-flex min-h-9 justify-center gap-1.5 px-3 text-[11px] whitespace-nowrap [&>svg]:h-3.5 [&>svg]:w-3.5 sm:min-h-10 sm:text-xs lg:col-span-2 lg:min-h-11 lg:gap-2 lg:px-4 lg:text-sm [&>svg]:h-4 [&>svg]:w-4" : "col-span-2 inline-flex min-h-11 justify-center gap-2 px-4 text-sm"}
        rounded-xl border border-[var(--primary)]
        bg-[var(--primary)]/15
        font-semibold text-[var(--foreground)]
        shadow-[0_0_28px_color-mix(in_srgb,var(--primary)_22%,transparent)]
        transition-all duration-300
        hover:-translate-y-0.5
        hover:bg-[var(--primary)]
        hover:text-white
      `
    : `
        ${compact ? "inline-flex min-h-9 justify-center gap-1.5 px-3 text-[11px] whitespace-nowrap [&>svg]:h-3.5 [&>svg]:w-3.5 sm:min-h-10 sm:text-xs lg:min-h-11 lg:gap-2 lg:px-4 lg:text-sm [&>svg]:h-4 [&>svg]:w-4" : "inline-flex min-h-11 justify-center gap-2 px-4 text-sm"}
        rounded-xl border border-[var(--border)]
        bg-[var(--background)]/40
        font-medium text-[var(--foreground)]
        transition-all duration-300
        hover:border-[var(--primary)]/50
        hover:text-[var(--accent)]
      `;

  if (!href) {
    return (
      <span
        aria-disabled="true"
        className={`${classes} cursor-not-allowed opacity-45`}
      >
        {children}
        {icon}
      </span>
    );
  }

  if (href.startsWith("/")) {
    return (
      <Link href={href} className={classes}>
        {children}
        {icon}
      </Link>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={classes}
    >
      {children}
      {icon}
    </a>
  );
}

function ProjectImage({ project, big = false }) {
  const [hasImageError, setHasImageError] = useState(false);

  return (
    <div
      className={`
        relative overflow-hidden
        border border-[var(--border)]
        bg-[var(--background)]
        ${
          big
            ? "aspect-[2/1] rounded-[20px] md:aspect-[16/9] lg:aspect-[4/3] xl:aspect-[16/12]"
            : "aspect-[16/9] rounded-[16px] lg:aspect-[16/10]"
        }
      `}
    >
      {!hasImageError && (
        <img
          src={project.image}
          alt={`${project.title} project screenshot`}
          loading="lazy"
          onError={() => setHasImageError(true)}
          className="
            h-full w-full object-cover object-top
            transition-transform duration-700
            group-hover:scale-[1.025]
          "
        />
      )}

      {hasImageError && (
        <div className="absolute inset-0 flex flex-col justify-end bg-[linear-gradient(135deg,color-mix(in_srgb,var(--surface)_90%,var(--background)),var(--background))] p-4">
          <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
            Project preview
          </span>
          <span className="mt-1 text-sm font-bold text-[var(--foreground)]">
            {project.title}
          </span>
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
    </div>
  );
}

function FeaturedProject({ project, total }) {
  return (
    <article
      className="
        group relative flex h-full flex-col overflow-hidden
        rounded-[28px]
        border border-[var(--primary)]/45
        bg-[var(--surface)]/45
        p-4
        shadow-[0_30px_100px_rgba(0,0,0,.14)]
        backdrop-blur-xl
        sm:p-5 lg:p-6
      "
    >
      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute
          -right-32 -top-32
          h-80 w-80 rounded-full
          bg-[var(--primary)]/10
          blur-[110px]
        "
      />

      <div className="relative flex items-center justify-between">
        <p className="text-sm font-semibold">
          <span className="text-[var(--accent)]">
            01
          </span>

          <span className="mx-1.5 text-[var(--muted)]">
            /
          </span>

          <span className="text-[var(--muted)]">
            {String(total).padStart(2, "0")}
          </span>
        </p>

        <ProjectStatus>
          {project.status}
        </ProjectStatus>
      </div>

      <div className="relative mt-3 grid flex-1 gap-3 sm:mt-4 sm:gap-4 lg:grid-cols-[1fr_1fr] lg:gap-6 xl:grid-cols-[1.2fr_.8fr]">
        <ProjectImage
          project={project}
          big
        />

        <div className="flex flex-col">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
            {project.type}
          </p>

          <h3 className="mt-1.5 text-xl font-bold leading-[1.05] tracking-[-0.055em] text-[var(--foreground)] sm:mt-2 sm:text-[2rem] lg:text-[2.4rem]">
            {project.title}
          </h3>

          <p className="mt-2 line-clamp-2 text-[13px] leading-5 text-[var(--muted)] sm:mt-3 sm:text-[15px] sm:leading-6 lg:line-clamp-none">
            {project.description}
          </p>

          <div className="mt-3 hidden sm:mt-4 sm:block">
            <TechTags items={project.stack} />
          </div>

          <div className="mt-3 grid grid-cols-1 gap-2 sm:mt-5 sm:grid-cols-2 sm:gap-2.5 xl:mt-auto xl:pt-8">
            <div className="sm:col-span-2">
              <ProjectButton
                href={project.detailsHref || "/projects"}
                primary
                icon={<ArrowIcon />}
                compact
              >
                Explore Project
              </ProjectButton>
            </div>

            {project.liveHref && (
              <ProjectButton
                href={project.liveHref}
                icon={<ExternalIcon />}
                compact
              >
                Live Demo
              </ProjectButton>
            )}

            {project.githubHref && (
              <ProjectButton
                href={project.githubHref}
                icon={<GithubIcon />}
                compact
              >
                GitHub
              </ProjectButton>
            )}
          </div>
        </div>
      </div>

      {project.metrics?.length > 0 && (
        <div className="relative mt-5 hidden grid-cols-3 gap-3 border-t border-[var(--border)] pt-4 sm:grid">
          {project.metrics.map((metric) => (
            <div
              key={metric.label}
              className="border-r border-[var(--border)] last:border-r-0"
            >
              <p className="text-lg font-bold tracking-[-0.04em] text-[var(--foreground)]">
                {metric.value}
              </p>

              <p className="mt-1 text-[9px] text-[var(--muted)] sm:text-[10px]">
                {metric.label}
              </p>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}

function SideProject({
  project,
  number,
  total,
}) {
  return (
    <article
      className="
        group relative w-full overflow-hidden
        rounded-[26px]
        border border-[var(--border)]
        bg-[var(--surface)]/45
        p-3 backdrop-blur-xl
        transition-all duration-300
        hover:-translate-y-1
        hover:border-[var(--primary)]/40
        sm:p-5
      "
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold">
          <span className="text-[var(--accent)]">
            {number}
          </span>

          <span className="mx-1.5 text-[var(--muted)]">
            /
          </span>

          <span className="text-[var(--muted)]">
            {String(total).padStart(2, "0")}
          </span>
        </p>

        <ProjectStatus>
          {project.status}
        </ProjectStatus>
      </div>

      <div className="mt-3 grid gap-2 sm:mt-4 sm:gap-4 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
        <ProjectImage project={project} />

        <div>
          <p className="mt-2 text-[8px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)] sm:mt-0 sm:text-[9px] sm:tracking-[0.15em]">
            {project.type}
          </p>

          <h3 className="mt-1 text-sm font-bold leading-5 tracking-[-0.04em] text-[var(--foreground)] sm:mt-2 sm:text-xl">
            {project.title}
          </h3>

          <p className="mt-1 hidden text-xs leading-5 text-[var(--muted)] min-[480px]:block sm:mt-2 sm:text-sm">
            {project.description}
          </p>

          <div className="mt-2 hidden sm:mt-4 sm:block">
            <TechTags
              items={project.stack?.slice(0, 3)}
            />
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-1.5 sm:mt-4 sm:grid-cols-2 sm:gap-2">
        <ProjectButton
          href={project.detailsHref || "/projects"}
          primary
          icon={<ArrowIcon />}
          compact
        >
          Explore Project
        </ProjectButton>

        {project.liveHref && (
          <ProjectButton
            href={project.liveHref}
            icon={<ExternalIcon />}
            compact
          >
            Live Demo
          </ProjectButton>
        )}

        {project.githubHref && (
          <ProjectButton
            href={project.githubHref}
            icon={<GithubIcon />}
            compact
          >
            GitHub
          </ProjectButton>
        )}
      </div>
    </article>
  );
}

export function Projects({ projects }) {
  if (!projects?.items?.length) return null;

  const featuredProjects = projects.items.filter(
    (project) => project.featured === true,
  );

  const items = (
    featuredProjects.length > 0
      ? featuredProjects
      : projects.items
  ).slice(0, 3);

  if (!items.length) return null;

  const total = items.length;

  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="
        relative isolate
        scroll-mt-24 overflow-hidden
        bg-[var(--background)]
        px-4 py-14
        sm:px-6 sm:py-16
        lg:px-8 lg:py-28
      "
    >
      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute
          -left-52 top-[28%] -z-10
          h-[420px] w-[420px]
          rounded-full
          bg-[var(--primary)]/[0.045]
          blur-[160px]
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute
          -right-52 top-0 -z-10
          h-[360px] w-[360px]
          rounded-full
          bg-[var(--primary)]/[0.045]
          blur-[160px]
        "
      />

      <div className="mx-auto w-full max-w-[1450px]">
        <div>
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-[var(--primary)]" />

              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--accent)]">
                Real projects. Real impact.
              </span>
            </div>

            <h2
              id="projects-heading"
              className="
                mt-4
                text-[clamp(2rem,6vw,4.4rem)]
                font-bold
                leading-[.92]
                tracking-[-0.065em]
                text-[var(--foreground)]
              "
            >
              Top{" "}
              <span className="text-[var(--accent)]">
                3 Projects
              </span>
            </h2>

            <p className="mt-5 max-w-2xl text-[15px] leading-7 text-[var(--muted)] sm:text-base">
              {projects.description}
            </p>
          </div>

        </div>

        <div className="mt-8 grid gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-[1.55fr_1fr]">
          <FeaturedProject
            project={items[0]}
            total={total}
          />

          <div aria-label="More featured projects" className="grid grid-cols-2 gap-3 md:col-span-2 md:grid-cols-2 md:gap-4 lg:col-span-1 lg:grid-cols-1">
            {items[1] && (
              <SideProject
                project={items[1]}
                number="02"
                total={total}
              />
            )}

            {items[2] && (
              <SideProject
                project={items[2]}
                number="03"
                total={total}
              />
            )}
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <ViewAllProjectsButton />
        </div>
      </div>
    </section>
  );
}
