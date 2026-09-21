import Image from "next/image";
import Link from "next/link";

export function About({ about, profile }) {
  const displayName = profile.name || profile.brandLabel;

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="relative isolate scroll-mt-24 overflow-hidden bg-[var(--background)] px-4 py-12 sm:px-6 sm:py-16 lg:px-8 min-[1152px]:flex min-[1152px]:items-center min-[1152px]:py-20"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-0 -z-10 h-80 w-80 rounded-full bg-[var(--primary)]/[0.045] blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 bottom-0 -z-10 h-64 w-64 rounded-full bg-[var(--primary)]/[0.025] blur-3xl"
      />

      <div className="mx-auto grid w-full max-w-7xl items-center gap-8 md:grid-cols-[0.72fr_1.28fr] md:gap-10 min-[1152px]:gap-14 xl:gap-16">
        <div className="relative mx-auto w-full max-w-[240px] md:max-w-[300px] min-[1152px]:mx-0 min-[1152px]:max-w-[350px]">
          <div
            aria-hidden="true"
            className="absolute -left-4 top-7 h-[82%] w-[92%] -rotate-[4deg] rounded-[30px] bg-[var(--surface)]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-8 bottom-0 h-32 rounded-full bg-[var(--primary)]/[0.08] blur-3xl"
          />

          <div className="relative rounded-[30px] border border-[var(--border)] bg-[var(--surface)] p-2 shadow-[0_26px_70px_rgba(0,0,0,0.22)] transition-transform duration-300 min-[1152px]:rotate-[1.5deg] min-[1152px]:hover:rotate-0">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] bg-[var(--surface)]">
              {profile.profileImageUrl ? (
                <Image
                  src={profile.profileImageUrl}
                  alt={profile.name ? `${profile.name} profile` : "Developer profile"}
                  fill
                  priority={false}
                  sizes="(max-width: 640px) 90vw, 350px"
                  className="object-cover object-center"
                />
              ) : (
                <div className="grid h-full w-full place-items-center text-sm font-medium text-[var(--muted)]">
                  Profile image
                </div>
              )}

              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-black/80 via-black/30 to-transparent"
              />

              <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/35 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                {profile.developerLabel || "Developer"}
              </div>

              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                {profile.location && (
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/70">
                    Based in {profile.location}
                  </p>
                )}

                <h3 className="text-xl font-bold tracking-[-0.035em] text-white sm:text-2xl">
                  {displayName}
                </h3>

                {profile.role && (
                  <p className="mt-1 text-sm font-medium text-white/70">
                    {profile.role}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div
            aria-hidden="true"
            className="absolute -right-5 top-[22%] hidden h-12 w-12 place-items-center rounded-2xl border border-[var(--border)] bg-[var(--surface)]/90 text-sm font-bold text-[var(--foreground)] shadow-xl backdrop-blur-xl sm:grid"
          >
            {"</>"}
          </div>
        </div>

        <div className="min-w-0">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--primary)]/20 bg-[var(--surface)]/55 px-4 py-2 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.17em] text-[var(--accent)]">
              {about.eyebrow}
            </span>
          </div>

          <h2
            id="about-heading"
            className="max-w-[700px] text-[clamp(2rem,6vw,3.2rem)] font-bold leading-[1.02] tracking-[-0.05em] text-[var(--foreground)] min-[1152px]:text-[clamp(2.9rem,4vw,3.7rem)]"
          >
            {about.heading}
          </h2>

          <p className="mt-4 max-w-[700px] text-[15px] leading-7 text-[var(--muted)] sm:text-base">
            Hi, I&apos;m <span className="font-semibold text-[var(--foreground)]">{displayName}</span>. {about.description}
          </p>

          <div className="mt-5 grid grid-cols-1 gap-2 min-[360px]:grid-cols-3">
            {about.stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-[17px] border border-[var(--border)] bg-[var(--surface)]/55 px-3 py-3 backdrop-blur-md sm:px-4"
              >
                <strong className="block text-xl font-bold tracking-[-0.04em] text-[var(--foreground)] sm:text-2xl">
                  {stat.value}
                </strong>
                <span className="mt-1 block text-xs font-medium text-[var(--muted)]">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-1 gap-2 min-[360px]:grid-cols-2">
            {about.services.map((service) => (
              <div
                key={service}
                className="flex min-h-11 items-center gap-2 rounded-[15px] border border-[var(--border)] bg-[var(--surface)]/45 px-3 py-2 backdrop-blur-md sm:px-4"
              >
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[var(--foreground)] text-[11px] font-bold text-[var(--background)]">
                  ✓
                </span>
                <span className="text-[13px] font-semibold text-[var(--foreground)]">
                  {service}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-2.5">
            <Link
              href="/#projects"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--foreground)] px-5 py-2.5 text-sm font-bold text-[var(--background)] transition hover:opacity-90"
            >
              {about.primaryCtaLabel}
            </Link>

            {profile.publicEmail && (
              <a
                href={`mailto:${profile.publicEmail}`}
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)]/60 px-5 py-2.5 text-sm font-bold text-[var(--foreground)] backdrop-blur-md transition hover:border-[var(--foreground)]/40"
              >
                {about.secondaryCtaLabel}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
