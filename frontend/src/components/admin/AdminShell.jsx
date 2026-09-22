"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";

const navigationItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Hero", href: "/admin/hero" },
  { label: "About", href: "/admin/about" },
  { label: "Education", href: "/admin/education" },
  { label: "Learning", href: "/admin/learning" },
  { label: "Skills", href: "/admin/skills" },
  { label: "Projects", href: "/admin/projects" },
  { label: "Testimonials", href: "/admin/testimonials" },
  { label: "Contact", href: "/admin/contact" },
  { label: "Social Links", href: "/admin/social-links" },
];

function getPageTitle(pathname) {
  return navigationItems.find((item) => item.href === pathname)?.label || "Admin";
}

export default function AdminShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [admin, setAdmin] = useState(null);
  const [isChecking, setIsChecking] = useState(true);
  const [sessionError, setSessionError] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function checkSession() {
      try {
        const response = await apiRequest("/api/admin/me");
        if (isMounted) setAdmin(response.data);
      } catch (error) {
        if (error.status === 401) {
          router.replace("/admin/login");
          return;
        }

        if (isMounted) {
          setSessionError("Admin session could not be verified. Check that the backend is running.");
        }
      } finally {
        if (isMounted) setIsChecking(false);
      }
    }

    checkSession();
    return () => {
      isMounted = false;
    };
  }, [router]);

  async function handleLogout() {
    setIsLoggingOut(true);

    try {
      await apiRequest("/api/admin/logout", { method: "POST" });
    } finally {
      router.replace("/admin/login");
      setIsLoggingOut(false);
    }
  }

  if (isChecking) {
    return (
      <main className="grid min-h-svh place-items-center bg-[#100d10] px-4 text-[#faf7f8]">
        <p className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/70">
          Checking secure admin session...
        </p>
      </main>
    );
  }

  if (sessionError) {
    return (
      <main className="grid min-h-svh place-items-center bg-[#100d10] px-4 text-[#faf7f8]">
        <div className="max-w-sm rounded-xl border border-[#e82b45]/40 bg-white/[0.03] p-5 text-center">
          <p className="text-sm text-[#ffb0bb]">{sessionError}</p>
          <button type="button" onClick={() => window.location.reload()} className="mt-4 rounded-lg border border-white/15 px-3 py-2 text-sm">
            Try again
          </button>
        </div>
      </main>
    );
  }

  if (!admin) return null;

  const pageTitle = getPageTitle(pathname);

  return (
    <div className="min-h-svh bg-[#100d10] text-[#faf7f8]">
      <div className="mx-auto flex min-h-svh max-w-[1600px]">
        <aside className="sticky top-0 hidden h-svh w-64 shrink-0 border-r border-white/10 bg-white/[0.025] px-4 py-6 lg:block">
          <AdminNavigation pathname={pathname} onNavigate={() => setIsMenuOpen(false)} />
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 border-b border-white/10 bg-[#100d10]/95 px-4 py-4 backdrop-blur md:px-6">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <button type="button" aria-expanded={isMenuOpen} aria-controls="admin-navigation" onClick={() => setIsMenuOpen((open) => !open)} className="rounded-lg border border-white/15 px-3 py-2 text-sm lg:hidden">
                  Menu
                </button>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#ef6072]">Portfolio Admin</p>
                  <h1 className="truncate text-lg font-semibold sm:text-xl">{pageTitle}</h1>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-medium">{admin.name}</p>
                  <p className="max-w-44 truncate text-xs text-white/55">{admin.email}</p>
                </div>
                <button type="button" onClick={handleLogout} disabled={isLoggingOut} className="rounded-lg border border-white/15 px-3 py-2 text-sm font-medium text-white/85 transition hover:border-[#e82b45] hover:text-white disabled:cursor-not-allowed disabled:opacity-60">
                  {isLoggingOut ? "Signing out..." : "Logout"}
                </button>
              </div>
            </div>
          </header>

          {isMenuOpen && (
            <div id="admin-navigation" className="border-b border-white/10 bg-[#171116] px-4 py-4 lg:hidden">
              <AdminNavigation pathname={pathname} onNavigate={() => setIsMenuOpen(false)} />
            </div>
          )}

          <main className="mx-auto w-full max-w-6xl px-4 py-7 sm:px-5 sm:py-8 md:px-6 md:py-10">{children}</main>
        </div>
      </div>
    </div>
  );
}

function AdminNavigation({ pathname, onNavigate }) {
  return (
    <nav aria-label="Admin navigation" className="space-y-1">
      <div className="mb-6 px-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#ef6072]">CMS</p>
        <p className="mt-2 text-lg font-semibold">Portfolio control</p>
      </div>
      {navigationItems.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link key={item.href} href={item.href} onClick={onNavigate} className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition ${isActive ? "bg-[#e82b45] text-white" : "text-white/65 hover:bg-white/[0.06] hover:text-white"}`}>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
