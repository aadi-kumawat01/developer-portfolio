"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { MobileMenu } from "@/components/layout/MobileMenu";
import { ThemeMenu } from "@/components/theme/ThemeMenu";

const navItems = [
  {
    id: "home",
    label: "Home",
    href: "/#home",
  },
  {
    id: "about",
    label: "About",
    href: "/#about",
  },
  {
    id: "education",
    label: "Education",
    href: "/#education",
  },
  {
    id: "skills",
    label: "Skills",
    href: "/#skills",
  },
  {
    id: "projects",
    label: "Projects",
    href: "/#projects",
  },
  {
    id: "testimonials",
    label: "Testimonials",
    href: "/#testimonials",
  },
  {
    id: "contact",
    label: "Contact",
    href: "/#contact",
  },
];

const defaultResume = {
  viewUrl: "/resume",
  downloadUrl: "/resume/Aditya_Kumawat_Resume.pdf",
  downloadFileName: "Aditya_Kumawat_Resume.pdf",
  visible: true,
};

function Navigation({ activeSection, mobile = false }) {
  return (
    <nav
      aria-label={
        mobile
          ? "Mobile navigation"
          : "Main navigation"
      }
      className={
        mobile
          ? "grid gap-1"
          : `
              hidden
              h-12
              items-center
              rounded-full
              border
              border-[var(--border)]
              bg-[var(--surface)]/55
              p-1
              shadow-[0_8px_30px_rgba(0,0,0,0.08)]
              backdrop-blur-xl
              min-[1152px]:flex
            `
      }
    >
      {navItems.map((link) => {
        const active =
          activeSection === link.id;

        return (
          <Link
            key={link.id}
            href={link.href}
            prefetch={false}
            aria-current={
              active
                ? "location"
                : undefined
            }
            className={`
              inline-flex
              min-h-10
              items-center
              justify-center
              rounded-full
              px-3
              text-sm
              font-semibold
              transition-all
              duration-200

              ${
                mobile
                  ? "justify-start"
                  : ""
              }

              ${
                active
                  ? `
                      bg-[var(--primary)]
                      text-white
                      shadow-[0_5px_16px_rgba(185,28,45,0.14)]
                    `
                  : `
                      text-[var(--muted)]
                      hover:bg-[var(--surface)]/80
                      hover:text-[var(--foreground)]
                    `
              }
            `}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

function SeeResume({ mobile = false, active = false }) {
  return (
    <a
      href="/resume"
      aria-label="See my resume"
      className={`
        inline-flex
        min-h-10
        items-center
        justify-center
        rounded-full
        border
        px-4
        text-sm
        font-semibold
        backdrop-blur-xl
        transition-all
        duration-200

        ${
          mobile
            ? "w-full justify-start"
            : ""
        }

        ${
          active
            ? `
                border-[var(--primary)]/30
                bg-[var(--primary)]/10
                text-[var(--primary)]
              `
            : `
                border-[var(--border)]
                bg-[var(--surface)]/55
                text-[var(--foreground)]
                hover:border-[var(--foreground)]/30
                hover:bg-[var(--surface)]/80
              `
        }
      `}
    >
      See My Resume
    </a>
  );
}

function DownloadResume({
  mobile = false,
  href = defaultResume.downloadUrl,
  fileName = defaultResume.downloadFileName,
}) {
  return (
    <a
      href={href}
      download={fileName}
      aria-label="Download my resume"
      className={`
        group
        flex
        min-h-10
        items-center
        justify-between
        gap-4
        rounded-xl
        px-3
        text-sm
        font-semibold
        text-[var(--foreground)]
        transition-all
        duration-200

        hover:bg-[var(--surface)]

        ${
          mobile
            ? "w-full"
            : ""
        }
      `}
    >
      <span>
        Download My Resume
      </span>

      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden="true"
        className="
          h-4
          w-4
          shrink-0
          text-[var(--muted)]
          transition-all
          duration-200
          group-hover:translate-y-0.5
          group-hover:text-[var(--foreground)]
        "
      >
        <path
          d="M12 3v12m0 0 4-4m-4 4-4-4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d="M5 19h14"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
  );
}

export function Navbar({
  profile,
  defaultTheme,
}) {
  const pathname = usePathname();

  const [activeSection, setActiveSection] =
    useState(
      pathname === "/"
        ? "home"
        : null,
    );
  const [resume, setResume] = useState(defaultResume);

  useEffect(() => {
    if (pathname !== "/") return;

    let animationFrame = null;

    const updateActiveSection = () => {
      const sections = navItems
        .map((link) => ({
          id: link.id,
          element:
            document.getElementById(
              link.id,
            ),
        }))
        .filter(
          (section) =>
            section.element,
        );

      if (!sections.length) return;

      const activationLine =
        window.innerHeight * 0.34;

      let currentSection =
        sections[0].id;

      for (const section of sections) {
        if (
          section.element.getBoundingClientRect()
            .top <= activationLine
        ) {
          currentSection =
            section.id;
        }
      }

      const reachedBottom =
        window.innerHeight +
          window.scrollY >=
        document.documentElement
          .scrollHeight -
          8;

      if (reachedBottom) {
        currentSection =
          sections[
            sections.length - 1
          ].id;
      }

      setActiveSection((current) =>
        current === currentSection
          ? current
          : currentSection,
      );
    };

    const scheduleUpdate = () => {
      if (
        animationFrame !== null
      ) {
        return;
      }

      animationFrame =
        window.requestAnimationFrame(
          () => {
            animationFrame = null;
            updateActiveSection();
          },
        );
    };

    updateActiveSection();

    window.addEventListener(
      "scroll",
      scheduleUpdate,
      {
        passive: true,
      },
    );

    window.addEventListener(
      "resize",
      scheduleUpdate,
    );

    return () => {
      window.removeEventListener(
        "scroll",
        scheduleUpdate,
      );

      window.removeEventListener(
        "resize",
        scheduleUpdate,
      );

      if (
        animationFrame !== null
      ) {
        window.cancelAnimationFrame(
          animationFrame,
        );
      }
    };
  }, [pathname]);

  useEffect(() => {
    let isMounted = true;

    async function loadResume() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/site`);
        if (!response.ok) return;

        const payload = await response.json();
        const saved = payload?.data?.resume;
        if (!saved || !isMounted) return;

        setResume({
          ...defaultResume,
          ...saved,
          viewUrl: saved.viewUrl || defaultResume.viewUrl,
          downloadUrl: saved.downloadUrl || defaultResume.downloadUrl,
          downloadFileName: saved.downloadFileName || defaultResume.downloadFileName,
        });
      } catch {
        // The local resume remains available when the CMS is unavailable.
      }
    }

    loadResume();
    return () => { isMounted = false; };
  }, []);

  const brandName =
    profile?.name ||
    profile?.brandLabel ||
    "Aditya Kumawat";

  const resumeActive =
    pathname === "/resume";
  const currentSection = pathname === "/" ? activeSection : null;

  return (
    <header
      className="
        pointer-events-none
        fixed
        inset-x-0
        top-0
        z-[100]
        w-full
        bg-transparent
      "
    >
      {/* Skip Navigation */}

      <a
        href="#main-content"
        className="
          pointer-events-auto
          absolute
          left-4
          top-3
          z-[110]
          -translate-y-[200%]
          rounded-xl
          bg-[var(--surface)]
          px-4
          py-3
          text-sm
          text-[var(--foreground)]
          focus:translate-y-0
        "
      >
        Skip to content
      </a>

      <div
        className="
          pointer-events-auto
          mx-auto
          flex
          w-full
          max-w-[1500px]
          items-center
          justify-between
          gap-3
          px-3
          py-3
          sm:px-5
          sm:py-4
          lg:px-8
        "
      >
        {/* Brand */}

        <Link
          href="/#home"
          prefetch={false}
          className="
            shrink-0
            text-sm
            font-bold
            tracking-[-0.025em]
            text-[var(--foreground)]
            sm:text-base
          "
        >
          {brandName}
        </Link>

        {/* Desktop Navigation */}

        <Navigation
          activeSection={currentSection}
        />

        {/* Right Actions */}

        <div className="flex shrink-0 items-center gap-2">

          {/* Hire Me */}

          <Link
            href="/#contact"
            prefetch={false}
            aria-label="Hire Me — contact section"
            className="
              inline-flex
              min-h-10
              items-center
              justify-center
              rounded-full
              bg-[var(--primary)]
              px-4
              text-sm
              font-bold
              text-white
              transition-all
              duration-200
              hover:brightness-110
            "
          >
            Hire Me
          </Link>

          {/* Desktop Resume */}

          {resume.visible && <div className="hidden min-[1152px]:block">
            <SeeResume
              active={
                resumeActive
              }
            />
          </div>}

          <MobileMenu desktop>
            <div className="grid gap-1">

              {resume.visible && <DownloadResume href={resume.downloadUrl} fileName={resume.downloadFileName} />}

              <div className="my-2 h-px bg-[var(--border)]" />

              <ThemeMenu
                defaultTheme={
                  defaultTheme
                }
              />

            </div>
          </MobileMenu>

          <MobileMenu>
            <Navigation
              activeSection={currentSection}
              mobile
            />

            <div className="my-2 h-px bg-[var(--border)]" />

            {resume.visible && <SeeResume
              mobile
              active={
                resumeActive
              }
            />}

            {resume.visible && <DownloadResume mobile href={resume.downloadUrl} fileName={resume.downloadFileName} />}

            <div className="my-2 h-px bg-[var(--border)]" />

            <ThemeMenu
              defaultTheme={
                defaultTheme
              }
            />
          </MobileMenu>

        </div>
      </div>
    </header>
  );
}
