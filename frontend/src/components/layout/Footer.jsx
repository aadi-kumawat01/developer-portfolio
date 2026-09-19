"use client";

import Link from "next/link";

const footerLinks = [
  {
    label: "Home",
    href: "/#home",
  },
  {
    label: "Projects",
    href: "/#projects",
  },
  {
    label: "Contact",
    href: "/#contact",
  },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer
      className="
        border-t
        border-[var(--border)]
        bg-[var(--background)]
      "
    >
      <div
        className="
          mx-auto
          max-w-[1400px]
          px-5
          sm:px-8
          lg:px-10
        "
      >
        {/* Main */}
        <div
          className="
            flex
            flex-col
            gap-8
            py-10
            sm:flex-row
            sm:items-center
            sm:justify-between
            sm:py-12
          "
        >
          {/* Brand */}
          <div>
            <Link
              href="/#home"
              className="
                text-lg
                font-bold
                tracking-[-0.03em]
                text-[var(--foreground)]
              "
            >
              Aditya Kumawat
              <span className="text-[var(--primary)]">
                .
              </span>
            </Link>

            <p
              className="
                mt-2
                max-w-md
                text-sm
                leading-6
                text-[var(--muted)]
              "
            >
              Full Stack Web Developer building clean,
              responsive and practical web experiences.
            </p>
          </div>

          {/* Navigation */}
          <nav
            aria-label="Footer navigation"
            className="
              flex
              flex-wrap
              items-center
              gap-x-6
              gap-y-3
            "
          >
            {footerLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="
                  text-sm
                  font-medium
                  text-[var(--muted)]
                  transition-colors
                  duration-200
                  hover:text-[var(--foreground)]
                "
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom */}
        <div
          className="
            flex
            items-center
            justify-between
            border-t
            border-[var(--border)]
            py-5
          "
        >
          <p
            className="
              text-xs
              text-[var(--muted)]
            "
          >
            © {currentYear} Aditya Kumawat
          </p>

          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Back to top"
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              border
              border-[var(--border)]
              text-[var(--muted)]
              transition-all
              duration-300

              hover:border-[var(--primary)]/30
              hover:text-[var(--foreground)]
            "
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path
                d="M12 19V5m0 0-5 5m5-5 5 5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
}