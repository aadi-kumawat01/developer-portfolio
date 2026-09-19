export default function AdminHome() {
  return (
    <main className="mx-auto flex min-h-svh max-w-3xl flex-col justify-center gap-4 px-6 text-[var(--foreground)]">
      <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">Portfolio CMS</p>
      <h1 className="text-3xl font-bold">Admin foundation ready</h1>
      <p className="text-[var(--muted)]">Content editing screens will be added in the next phase.</p>
      <form action="/api/admin/auth/logout" method="post">
        <button type="submit" className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm">Log out</button>
      </form>
    </main>
  );
}
