"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isChecking, setIsChecking] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function redirectIfAuthenticated() {
      try {
        await apiRequest("/api/admin/me");
        router.replace("/admin");
      } catch (requestError) {
        if (requestError.status !== 401 && isMounted) {
          setError("Unable to reach the admin server. Please try again.");
        }
      } finally {
        if (isMounted) setIsChecking(false);
      }
    }

    redirectIfAuthenticated();
    return () => {
      isMounted = false;
    };
  }, [router]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Email and password are required.");
      return;
    }

    setIsSubmitting(true);

    try {
      await apiRequest("/api/admin/login", {
        method: "POST",
        body: JSON.stringify({ email: email.trim(), password }),
      });
      await apiRequest("/api/admin/me");
      router.replace("/admin");
    } catch (requestError) {
      setError(requestError.message || "Invalid email or password.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isChecking) {
    return (
      <main className="grid min-h-svh place-items-center bg-[#100d10] px-4 text-[#faf7f8]">
        <p className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/70">
          Checking admin session...
        </p>
      </main>
    );
  }

  return (
    <main className="grid min-h-svh place-items-center bg-[#100d10] px-4 py-10 text-[#faf7f8]">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl shadow-black/20 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#ef6072]">Portfolio CMS</p>
        <h1 className="mt-3 text-2xl font-semibold sm:text-3xl">Admin login</h1>
        <p className="mt-2 text-sm leading-6 text-white/60">Sign in to manage your portfolio content.</p>

        {error && (
          <p role="alert" className="mt-5 rounded-lg border border-[#e82b45]/40 bg-[#e82b45]/10 px-3 py-2 text-sm text-[#ffb0bb]">
            {error}
          </p>
        )}

        <div className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-white/85">
            Email
            <input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 block w-full rounded-lg border border-white/15 bg-black/15 px-3 py-2.5 text-white outline-none transition placeholder:text-white/30 focus:border-[#e82b45]" placeholder="you@example.com" />
          </label>
          <label className="block text-sm font-medium text-white/85">
            Password
            <input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 block w-full rounded-lg border border-white/15 bg-black/15 px-3 py-2.5 text-white outline-none transition placeholder:text-white/30 focus:border-[#e82b45]" placeholder="Enter your password" />
          </label>
        </div>

        <button type="submit" disabled={isSubmitting} className="mt-6 w-full rounded-lg bg-[#e82b45] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#f03d55] disabled:cursor-not-allowed disabled:opacity-60">
          {isSubmitting ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </main>
  );
}
