"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const filters = [
  { id: "all", label: "All Projects" },
  { id: "fullstack", label: "Full Stack" },
  { id: "frontend", label: "Frontend" },
  { id: "backend", label: "Backend" },
];

function normalizeCategory(value = "") {
  return value
    .toLowerCase()
    .replaceAll(" ", "")
    .replaceAll("-", "");
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      aria-hidden="true"
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

function BackIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        d="M19 12H5M11 6l-6 6 6 6"
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
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        d="M14 5h5v5M19 5l-8 8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M19 14v3a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M12 2C6.48 2 2 6.59 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-1.05-.01-1.9-2.78.62-3.37-1.21-3.37-1.21-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .08 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.36-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.2 9.2 0 0 1 12 7.04a9.2 9.2 0 0 1 2.5.35c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.8-4.57 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.59.69.49A10.24 10.24 0 0 0 22 12.25C22 6.59 17.52 2 12 2Z" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        d="M12 4v11M8 11l4 4 4-4M5 19h14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ProjectCard({ project, index }) {
  const technologies =
    project.stack ||
    project.technologies ||
    project.tech ||
    [];

  const image =
    project.image ||
    project.thumbnail ||
    project.cover;

  const detailsUrl =
    project.detailsHref ||
    (project.slug ? `/projects/${project.slug}` : null);

  const liveUrl =
    project.liveHref ||
    project.liveUrl ||
    project.live ||
    project.demoUrl;

  const githubUrl =
    project.githubHref ||
    project.githubUrl ||
    project.github ||
    project.codeUrl;

  const downloadUrl =
    project.downloadHref ||
    project.downloadUrl ||
    project.download;

  const development = String(project.status || "")
    .toLowerCase()
    .includes("development");

  return (
    <article className="group relative overflow-hidden rounded-[24px] border border-[var(--border)] bg-[var(--surface)]/50 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[var(--primary)]/35 hover:shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
      {/* top accent */}
      <div className="absolute left-0 top-0 z-10 h-px w-full bg-gradient-to-r from-transparent via-[var(--primary)]/70 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-100" />

      {/* IMAGE */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[var(--foreground)]/[0.04]">
        {image ? (
          <img
            src={image}
            alt={`${project.title} project screenshot`}
            loading="lazy"
            className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.035]"
          />
        ) : (
          <div className="grid h-full w-full place-items-center">
            <span className="text-sm font-bold text-[var(--muted)]">
              Project Preview
            </span>
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />

        {/* project number */}
        <span className="absolute right-4 top-4 rounded-full border border-white/15 bg-black/35 px-3 py-1.5 text-[9px] font-black tracking-[0.15em] text-white backdrop-blur-md">
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* featured */}
        {project.featured && (
          <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/35 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.14em] text-white backdrop-blur-md">
            Featured
          </span>
        )}

        {/* status */}
        {project.status && (
          <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 text-[9px] font-semibold text-white backdrop-blur-md">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                development
                  ? "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,.7)]"
                  : "bg-emerald-400 shadow-[0_0_8px_rgba(74,222,128,.7)]"
              }`}
            />

            {project.status}
          </span>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[9px] font-black uppercase tracking-[0.17em] text-[var(--accent)]">
            {project.type ||
              project.category ||
              "Web Development"}
          </span>

          {project.year && (
            <span className="text-[10px] font-bold text-[var(--muted)]">
              {project.year}
            </span>
          )}
        </div>

        <h2 className="mt-3 text-xl font-bold tracking-[-0.04em] text-[var(--foreground)] sm:text-2xl">
          {project.title}
        </h2>

        {project.description && (
          <p className="mt-3 line-clamp-3 text-[13px] leading-6 text-[var(--muted)] sm:text-sm">
            {project.description}
          </p>
        )}

        {/* TECH STACK */}
        {technologies.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {technologies.slice(0, 5).map((technology) => (
              <span
                key={
                  typeof technology === "string"
                    ? technology
                    : technology.name
                }
                className="rounded-full border border-[var(--border)] bg-[var(--foreground)]/[0.035] px-2.5 py-1 text-[9px] font-bold text-[var(--muted)]"
              >
                {typeof technology === "string"
                  ? technology
                  : technology.name}
              </span>
            ))}
          </div>
        )}

        {/* ACTIONS */}
        <div className="mt-6 grid grid-cols-2 gap-2">
          {detailsUrl ? (
            <Link
              href={detailsUrl}
              className="group/link col-span-2 inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-[var(--primary)] px-4 text-xs font-bold text-white shadow-[0_8px_24px_color-mix(in_srgb,var(--primary)_18%,transparent)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110"
            >
              View Details

              <span className="transition-transform duration-300 group-hover/link:translate-x-1">
                <ArrowIcon />
              </span>
            </Link>
          ) : (
            <span
              aria-disabled="true"
              className="col-span-2 inline-flex min-h-10 cursor-not-allowed items-center justify-center rounded-full bg-[var(--foreground)]/[0.06] px-4 text-xs font-bold text-[var(--muted)]/60"
            >
              Details coming soon
            </span>
          )}

          {liveUrl ? (
            <a
              href={liveUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`Open ${project.title} live website`}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)]/70 px-3 text-[11px] font-bold text-[var(--foreground)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--primary)]/50 hover:text-[var(--accent)]"
            >
              <ExternalIcon />
              Live Demo
            </a>
          ) : (
            <span
              aria-disabled="true"
              className="inline-flex min-h-10 cursor-not-allowed items-center justify-center gap-2 rounded-full border border-[var(--border)] bg-[var(--foreground)]/[0.025] px-3 text-[11px] font-bold text-[var(--muted)]/45"
            >
              <ExternalIcon />
              Live unavailable
            </span>
          )}

          {githubUrl ? (
            <a
              href={githubUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`Open ${project.title} GitHub repository`}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)]/70 px-3 text-[11px] font-bold text-[var(--foreground)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--primary)]/50 hover:text-[var(--accent)]"
            >
              <GithubIcon />
              GitHub
            </a>
          ) : (
            <span
              aria-disabled="true"
              className="inline-flex min-h-10 cursor-not-allowed items-center justify-center gap-2 rounded-full border border-[var(--border)] bg-[var(--foreground)]/[0.025] px-3 text-[11px] font-bold text-[var(--muted)]/45"
            >
              <GithubIcon />
              GitHub unavailable
            </span>
          )}

          {/* Download */}
          {downloadUrl && (
            <a
              href={downloadUrl}
              download
              className="col-span-2 inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/[0.07] px-4 text-[11px] font-bold text-[var(--foreground)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--primary)]/60 hover:bg-[var(--primary)]/[0.12] hover:text-[var(--accent)]"
            >
              <DownloadIcon />
              Download Project
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export function AllProjects({ projects }) {
  const [activeFilter, setActiveFilter] =
    useState("all");

  const items = useMemo(() => {
    if (!projects?.length) return [];

    return projects;
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (activeFilter === "all") {
      return items;
    }

    return items.filter((project) => {
      const category = normalizeCategory(
        project.category,
      );

      return category === activeFilter;
    });
  }, [activeFilter, items]);

  const activeLabel =
    filters.find(
      (filter) => filter.id === activeFilter,
    )?.label || "All Projects";

  if (!items.length) {
    return null;
  }

  return (
    <main
      id="main-content"
      className="min-h-screen bg-[var(--background)]"
    >
      <section className="relative isolate overflow-hidden px-4 pb-16 pt-20 sm:px-6 sm:pb-20 sm:pt-24 lg:px-8 lg:pt-24">
        {/* BACKGROUND GLOWS */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-52 top-[5%] -z-10 h-[420px] w-[420px] rounded-full bg-[var(--primary)]/[0.045] blur-[170px]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-52 top-[35%] -z-10 h-[420px] w-[420px] rounded-full bg-[var(--accent)]/[0.03] blur-[170px]"
        />

        <div className="mx-auto w-full max-w-7xl">
          {/* TOP BAR */}
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/#projects"
              className="group inline-flex min-h-10 items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)]/40 px-4 text-xs font-semibold text-[var(--muted)] backdrop-blur-xl transition-all duration-300 hover:border-[var(--primary)]/40 hover:bg-[var(--primary)]/[0.06] hover:text-[var(--foreground)]"
            >
              <span className="transition-transform duration-300 group-hover:-translate-x-1">
                <BackIcon />
              </span>

              Back to portfolio
            </Link>

            <div className="hidden items-center gap-2 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />

              <span className="text-[9px] font-black uppercase tracking-[0.16em] text-[var(--muted)]/50">
                Selected Work
              </span>
            </div>
          </div>

          {/* HERO */}
          <div className="mx-auto mt-7 max-w-4xl text-center sm:mt-8">
            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-9 bg-gradient-to-r from-transparent to-[var(--primary)]" />

              <span className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--accent)]">
                Portfolio
              </span>

              <span className="h-px w-9 bg-gradient-to-l from-transparent to-[var(--primary)]" />
            </div>

            <h1 className="mt-4 text-[clamp(2.65rem,6vw,4.8rem)] font-bold leading-[0.94] tracking-[-0.06em] text-[var(--foreground)]">
              Projects I&apos;ve

              <span className="ml-2 bg-gradient-to-r from-[var(--accent)] via-[var(--primary)] to-[var(--accent)] bg-clip-text text-transparent sm:ml-3">
                built.
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[var(--muted)] sm:text-[15px]">
              A collection of projects I&apos;ve built
              while learning, experimenting and working
              with modern web technologies.
            </p>
          </div>

          {/* FILTER TABS */}
          <div className="mt-7 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mt-8">
            <div
              role="tablist"
              aria-label="Project filters"
              className="mx-auto flex w-max items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)]/45 p-1.5 backdrop-blur-xl"
            >
              {filters.map((filter) => {
                const active =
                  activeFilter === filter.id;

                return (
                  <button
                    key={filter.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() =>
                      setActiveFilter(filter.id)
                    }
                    className={`min-h-9 whitespace-nowrap rounded-full border px-4 text-[11px] font-bold transition-all duration-300 sm:text-xs ${
                      active
                        ? "border-[var(--primary)]/30 bg-[var(--primary)]/[0.10] text-[var(--foreground)] shadow-[0_0_24px_color-mix(in_srgb,var(--primary)_12%,transparent)]"
                        : "border-transparent text-[var(--muted)] hover:bg-[var(--foreground)]/[0.04] hover:text-[var(--foreground)]"
                    }`}
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* RESULTS INFO */}
          <div className="mt-6 flex items-end justify-between gap-4 border-b border-[var(--border)] pb-4">
            <div>
              <p className="text-xs font-bold text-[var(--foreground)]">
                {activeLabel}
              </p>

              <p className="mt-1 text-[10px] text-[var(--muted)]">
                {filteredProjects.length}{" "}
                {filteredProjects.length === 1
                  ? "project"
                  : "projects"}{" "}
                found
              </p>
            </div>

            <span className="text-[9px] font-black uppercase tracking-[0.14em] text-[var(--muted)]/40">
              Explore Projects
            </span>
          </div>

          {/* PROJECTS */}
          {filteredProjects.length > 0 ? (
            <div
              key={activeFilter}
              className="mt-6 grid animate-[projectFade_.35s_ease-out] gap-4 sm:grid-cols-2 xl:grid-cols-3"
            >
              {filteredProjects.map(
                (project, index) => (
                  <ProjectCard
                    key={
                      project.id ??
                      project.slug ??
                      project.title
                    }
                    project={project}
                    index={index}
                  />
                ),
              )}
            </div>
          ) : (
            <div className="mt-6 rounded-[24px] border border-dashed border-[var(--border)] bg-[var(--surface)]/25 px-6 py-16 text-center">
              <p className="text-sm font-bold text-[var(--foreground)]">
                No projects found
              </p>

              <p className="mt-2 text-xs text-[var(--muted)]">
                There are currently no projects in this
                category.
              </p>
            </div>
          )}
        </div>
      </section>

      <style jsx>{`
        @keyframes projectFade {
          from {
            opacity: 0;
            transform: translateY(8px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  );
}
