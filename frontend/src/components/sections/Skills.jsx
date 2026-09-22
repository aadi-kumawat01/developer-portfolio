"use client";

import { useMemo, useState } from "react";

const skillConfig = {
  html: { category: "frontend", color: "#f97316" },
  css: { category: "frontend", color: "#3b82f6" },
  javascript: { category: "frontend", color: "#facc15" },
  react: { category: "frontend", color: "#38bdf8" },
  nextjs: { category: "frontend", color: "#d4d4d4" },
  tailwindcss: { category: "frontend", color: "#22d3ee" },
  bootstrap: { category: "frontend", color: "#8b5cf6" },
  redux: { category: "frontend", color: "#8b5cf6" },

  nodejs: { category: "backend", color: "#22c55e" },
  expressjs: { category: "backend", color: "#e5e5e5" },
  restapis: { category: "backend", color: "#14b8a6" },
  jwtauth: { category: "backend", color: "#a1a1aa" },
  socketio: { category: "backend", color: "#f43f5e" },

  mongodb: { category: "database", color: "#22c55e" },
  mongoose: { category: "database", color: "#ef4444" },
  firebase: { category: "database", color: "#f59e0b" },

  git: { category: "tools", color: "#f97316" },
  github: { category: "tools", color: "#f43f5e" },
  vscode: { category: "tools", color: "#3b82f6" },
  postman: { category: "tools", color: "#f97316" },
  vite: { category: "tools", color: "#8b5cf6" },
  vercel: { category: "tools", color: "#e5e5e5" },
  netlify: { category: "tools", color: "#14b8a6" },
};

const mernStack = [
  {
    letter: "M",
    name: "MongoDB",
    description: "NoSQL Database",
    color: "#22c55e",
  },
  {
    letter: "E",
    name: "Express.js",
    description: "Backend Framework",
    color: "#d4d4d4",
  },
  {
    letter: "R",
    name: "React.js",
    description: "Frontend Library",
    color: "#38bdf8",
  },
  {
    letter: "N",
    name: "Node.js",
    description: "Runtime Environment",
    color: "#22c55e",
  },
];

function normalizeName(name = "") {
  return name
    .toLowerCase()
    .replaceAll(".", "")
    .replaceAll(" ", "")
    .replaceAll("-", "");
}

function getSkillConfig(name) {
  const normalized = normalizeName(name);

  if (normalized === "reactjs") {
    return skillConfig.react;
  }

  if (normalized === "next") {
    return skillConfig.nextjs;
  }

  if (normalized === "node") {
    return skillConfig.nodejs;
  }

  if (normalized === "express") {
    return skillConfig.expressjs;
  }

  if (normalized === "tailwind") {
    return skillConfig.tailwindcss;
  }

  return skillConfig[normalized];
}

function CategoryIcon({ type }) {
  if (type === "frontend") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-3.5 w-3.5"
        aria-hidden="true"
      >
        <path
          d="M8 9 5 12l3 3M16 9l3 3-3 3M14 6l-4 12"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (type === "backend") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-3.5 w-3.5"
        aria-hidden="true"
      >
        <rect
          x="4"
          y="5"
          width="16"
          height="6"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <rect
          x="4"
          y="13"
          width="16"
          height="6"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <path
          d="M8 8h.01M8 16h.01"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (type === "database") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-3.5 w-3.5"
        aria-hidden="true"
      >
        <ellipse
          cx="12"
          cy="6"
          rx="7"
          ry="3"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <path
          d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"
          stroke="currentColor"
          strokeWidth="1.7"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-3.5 w-3.5"
      aria-hidden="true"
    >
      <path
        d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <circle
        cx="12"
        cy="12"
        r="3.5"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}


function withAlpha(color, alpha) {
  if (!color) return `rgba(255,255,255,${alpha})`;

  if (color.startsWith("#")) {
    let hex = color.replace("#", "");

    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((char) => char + char)
        .join("");
    }

    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  if (color.startsWith("rgb")) {
    return color;
  }

  return `color-mix(in srgb, ${color} ${alpha * 100}%, transparent)`;
}

function getSkillColor(name) {
  const config = getSkillConfig(name);
  return config?.color || "#ff4d6d";
}

function SkillCard({ skill }) {
  const hasProficiency = skill.level !== null
    && skill.level !== undefined
    && skill.level !== ""
    && Number.isFinite(Number(skill.level));
  const level = hasProficiency
    ? Math.min(Math.max(Number(skill.level), 0), 100)
    : null;

  const color = getSkillColor(skill.name);

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]/55 p-3 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[var(--primary)]/35 sm:p-5">
      <div className="relative">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            {skill.icon ? (
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl border border-[var(--border)] bg-white/95 p-1.5 shadow-sm sm:h-9 sm:w-9 sm:p-2">
                <img
                  src={skill.icon}
                  alt={`${skill.name} logo`}
                  loading="lazy"
                  className="h-full w-full object-contain"
                />
              </div>
            ) : (
              <div
                className="grid h-8 w-8 shrink-0 place-items-center rounded-xl border text-sm font-black sm:h-9 sm:w-9"
                style={{
                  borderColor: withAlpha(color, 0.28),
                  color,
                  backgroundColor: withAlpha(color, 0.1),
                }}
              >
                {skill.name?.charAt(0)}
              </div>
            )}

            <h3 className="truncate text-sm font-bold tracking-[-0.025em] text-[var(--foreground)] sm:text-base">
              {skill.name}
            </h3>
          </div>

          {hasProficiency && (
            <span
              className="shrink-0 text-xs font-bold tracking-[-0.03em] sm:text-sm"
              style={{ color }}
            >
              {level}%
            </span>
          )}
        </div>

        {hasProficiency && (
          <div className="mt-3 sm:mt-5">
            <div className="relative h-[5px] overflow-visible rounded-full bg-[var(--foreground)]/[0.07]">
              <div
                role="progressbar"
                aria-label={`${skill.name} skill level ${level}%`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={level}
                className="relative h-full rounded-full transition-[width] duration-700 ease-out"
                style={{
                  width: `${level}%`,
                  background: `linear-gradient(90deg, ${withAlpha(color, 0.85)}, ${color})`,
                  boxShadow: "none",
                }}
              >
                <span
                  className="absolute right-0 top-1/2 h-2.5 w-2.5 -translate-y-1/2 translate-x-1/2 rounded-full border-2 border-[var(--surface)]"
                  style={{
                    backgroundColor: color,
                    boxShadow: "none",
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

function MernCard({ item }) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]/45 px-3 py-4 text-center backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-[var(--surface)]/65 sm:px-4 sm:py-6">
      <span
        aria-hidden="true"
        className="absolute left-1/2 top-0 h-[2px] w-16 -translate-x-1/2 rounded-full opacity-80 transition-all duration-300 group-hover:w-24"
        style={{
          backgroundColor: item.color,
          boxShadow: "none",
        }}
      />

      <div
        className="mx-auto grid h-12 w-12 place-items-center rounded-2xl border text-2xl font-black transition-transform duration-300 group-hover:scale-105"
        style={{
          color: item.color,
          borderColor: `${item.color}25`,
          backgroundColor: `${item.color}0D`,
        }}
      >
        {item.letter}
      </div>

      <h3 className="mt-4 text-sm font-bold tracking-[-0.02em] text-[var(--foreground)] sm:text-base">
        {item.name}
      </h3>

      <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--muted)]">
        {item.description}
      </p>
    </article>
  );
}

function getCmsSkills(categories) {
  if (!Array.isArray(categories)) return [];

  return categories
    .filter((category) => category?.name && Array.isArray(category.skills) && category.skills.length)
    .map((category) => ({
      id: category.slug || category._id,
      label: category.name,
      skills: category.skills.map((skill) => ({
        id: skill._id,
        name: skill.name,
        icon: skill.iconUrl || "",
        level: skill.proficiency,
        category: category.slug || category._id,
        order: skill.order,
      })),
    }));
}

export function Skills({ cmsCategories }) {
  const [activeCategory, setActiveCategory] = useState("frontend");

  const cmsSkills = useMemo(() => getCmsSkills(cmsCategories), [cmsCategories]);
  const categories = cmsSkills.map(({ id, label }) => ({ id, label }));
  const selectedCategory = categories.some((category) => category.id === activeCategory)
    ? activeCategory
    : categories[0]?.id;

  const items = useMemo(() => {
    return cmsSkills.flatMap((category) => category.skills);
  }, [cmsSkills]);

  const filteredSkills = items.filter(
    (skill) => skill.category === selectedCategory,
  );

  if (!items.length) return null;

  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="relative isolate scroll-mt-24 overflow-hidden bg-[var(--background)] px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-28"
    >
      {/* subtle background atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-[420px] w-[760px] -translate-x-1/2 rounded-full bg-[var(--primary)]/[0.045] blur-[150px]"
      />

      <div className="mx-auto w-full max-w-6xl">
        {/* section heading */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-gradient-to-r from-transparent to-[var(--primary)]" />

            <span className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--accent)]">
              My Skills
            </span>

            <span className="h-px w-8 bg-gradient-to-l from-transparent to-[var(--primary)]" />
          </div>

          <h2
            id="skills-heading"
            className="mt-4 text-[clamp(2rem,6vw,4.5rem)] font-bold leading-[1.02] tracking-[-0.065em] text-[var(--foreground)]"
          >
            Technologies I work with.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-[var(--muted)] sm:text-[15px]">
            Tools I use to turn ideas into products.
          </p>
        </div>

        {/* category tabs */}
        <div className="mt-7 overflow-x-auto pb-2 sm:mt-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div
            role="tablist"
            aria-label="Skill categories"
            className="mx-auto flex w-max items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)]/40 p-1.5 backdrop-blur-xl"
          >
            {categories.map((category) => {
              const active = selectedCategory === category.id;

              return (
                <button
                  key={category.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveCategory(category.id)}
                  className={`inline-flex min-h-9 items-center gap-2 whitespace-nowrap rounded-full border px-3.5 text-[11px] font-bold transition-all duration-300 sm:px-4 sm:text-xs ${active
                    ? "border-[var(--primary)]/30 bg-[var(--primary)]/[0.08] text-[var(--foreground)]"
                    : "border-transparent text-[var(--muted)] hover:bg-[var(--foreground)]/[0.04] hover:text-[var(--foreground)]"
                    }`}
                >
                  <span
                    className={
                      active
                        ? "text-[var(--accent)]"
                        : "text-[var(--muted)]"
                    }
                  >
                    <CategoryIcon type={category.id} />
                  </span>

                  {category.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* skills grid */}
        <div
          key={selectedCategory}
          role="tabpanel"
          className="mt-6 grid animate-[skillFade_.35s_ease-out] gap-2 min-[360px]:grid-cols-2 md:grid-cols-3 md:gap-3"
        >
          {filteredSkills.map((skill) => (
            <SkillCard
              key={skill.id ?? skill.name}
              skill={skill}
            />
          ))}
        </div>

        {/* mern stack */}
        <div className="mt-12 sm:mt-16 lg:mt-20">
          <div className="flex items-center justify-center gap-4">
            <span className="h-px max-w-24 flex-1 bg-gradient-to-r from-transparent to-[var(--border)]" />

            <div className="text-center">
              <span className="text-[9px] font-black uppercase tracking-[0.22em] text-[var(--accent)]">
                Core Stack
              </span>

              <h3 className="mt-1 text-lg font-bold tracking-[-0.035em] text-[var(--foreground)] sm:text-xl">
                MERN Stack Expertise
              </h3>
            </div>

            <span className="h-px max-w-24 flex-1 bg-gradient-to-l from-transparent to-[var(--border)]" />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
            {mernStack.map((item) => (
              <MernCard
                key={item.name}
                item={item}
              />
            ))}
          </div>
        </div>

        {/* small footer note */}
        <div className="mt-10 flex items-center justify-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)] opacity-30" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent)]" />
          </span>

          <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
            Continuously learning & improving
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes skillFade {
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
    </section>
  );
}
