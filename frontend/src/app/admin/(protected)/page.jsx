import Link from "next/link";

const managementCards = [
  { title: "Hero", href: "/admin/hero" },
  { title: "About", href: "/admin/about" },
  { title: "Education", href: "/admin/education" },
  { title: "Skills", href: "/admin/skills" },
  { title: "Projects", href: "/admin/projects" },
  { title: "Testimonials", href: "/admin/testimonials" },
  { title: "Contact", href: "/admin/contact" },
];

export default function AdminHome() {
  return (
    <section>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#ef6072]">Dashboard</p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Portfolio Admin</h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-white/60 sm:text-base">
        Manage the content that powers your portfolio from one focused workspace.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {managementCards.map((card) => (
          <Link key={card.href} href={card.href} className="group rounded-xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-[#e82b45]/60 hover:bg-white/[0.05]">
            <h3 className="font-semibold text-white">{card.title}</h3>
            <p className="mt-2 text-sm text-white/55">Open management area</p>
            <span className="mt-5 inline-block text-sm font-medium text-[#ff8495] transition group-hover:translate-x-1">Open →</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
