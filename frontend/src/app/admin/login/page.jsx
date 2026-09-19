import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { SESSION_COOKIE, validAdminSession } from "@/lib/admin-auth";

export default async function AdminLogin({ searchParams }) {
  const session = (await cookies()).get(SESSION_COOKIE)?.value;
  if (validAdminSession(session)) redirect("/admin");
  const { error } = await searchParams;

  return (
    <main className="grid min-h-svh place-items-center bg-[var(--background)] px-4 text-[var(--foreground)]">
      <form action="/api/admin/auth/login" method="post" className="w-full max-w-sm space-y-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-7">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">Portfolio CMS</p>
          <h1 className="mt-2 text-2xl font-bold">Admin login</h1>
        </div>
        {error && <p role="alert" className="text-sm text-[var(--accent)]">Invalid username or password.</p>}
        <label className="block text-sm">Username
          <input name="username" autoComplete="username" required className="mt-1 block w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)]" />
        </label>
        <label className="block text-sm">Password
          <input type="password" name="password" autoComplete="current-password" required className="mt-1 block w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)]" />
        </label>
        <button type="submit" className="w-full rounded-lg bg-[var(--primary)] px-4 py-2.5 font-semibold text-white">Sign in</button>
      </form>
    </main>
  );
}
