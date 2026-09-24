"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";

const emptyHero = {
  eyebrow: "",
  firstName: "",
  lastName: "",
  role: "",
  description: "",
  primaryCta: { label: "", href: "" },
  secondaryCta: { label: "", href: "" },
  visible: true,
};

export default function HeroManager() {
  const [hero, setHero] = useState(emptyHero);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadHero() {
      try {
        const response = await apiRequest("/api/admin/site");
        setHero({ ...emptyHero, ...response.data.hero, primaryCta: { ...emptyHero.primaryCta, ...response.data.hero.primaryCta }, secondaryCta: { ...emptyHero.secondaryCta, ...response.data.hero.secondaryCta } });
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadHero();
  }, []);

  function updateField(field, value) {
    setHero((current) => ({ ...current, [field]: value }));
  }

  function updateCta(cta, field, value) {
    setHero((current) => ({ ...current, [cta]: { ...current[cta], [field]: value } }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsSaving(true);

    try {
      await apiRequest("/api/admin/site", { method: "PATCH", body: JSON.stringify({ hero: { eyebrow: hero.eyebrow, firstName: hero.firstName, lastName: hero.lastName, role: hero.role, description: hero.description, primaryCta: { label: hero.primaryCta.label, href: hero.primaryCta.href }, secondaryCta: { label: hero.secondaryCta.label, href: hero.secondaryCta.href }, visible: hero.visible } }) });
      setMessage("Hero saved successfully.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) return <AdminStatus text="Loading Hero content..." />;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <AdminIntro title="Hero Management" text="Edit the homepage Hero content without changing its existing design." />
      <section className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:grid-cols-2 sm:p-6">
        <Field label="Eyebrow" value={hero.eyebrow} onChange={(value) => updateField("eyebrow", value)} />
        <Field label="First name" value={hero.firstName} onChange={(value) => updateField("firstName", value)} />
        <Field label="Last name" value={hero.lastName} onChange={(value) => updateField("lastName", value)} />
        <Field label="Role" value={hero.role} onChange={(value) => updateField("role", value)} />
        <Field label="Description" value={hero.description} multiline onChange={(value) => updateField("description", value)} className="sm:col-span-2" />
        <CtaFields title="Primary CTA" value={hero.primaryCta} onChange={(field, value) => updateCta("primaryCta", field, value)} />
        <CtaFields title="Secondary CTA" value={hero.secondaryCta} onChange={(field, value) => updateCta("secondaryCta", field, value)} />
        <label className="flex items-center gap-3 text-sm font-medium text-white/80 sm:col-span-2"><input type="checkbox" checked={hero.visible} onChange={(event) => updateField("visible", event.target.checked)} /> Show Hero section</label>
      </section>
      <Feedback error={error} message={message} />
      <button type="submit" disabled={isSaving} className="rounded-lg bg-[#e82b45] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">{isSaving ? "Saving..." : "Save Hero"}</button>
    </form>
  );
}

export function AdminIntro({ title, text }) { return <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#ef6072]">Content management</p><h2 className="mt-2 text-3xl font-semibold text-white">{title}</h2><p className="mt-2 text-sm text-white/60">{text}</p></div>; }
export function AdminStatus({ text }) { return <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 text-sm text-white/60">{text}</div>; }
export function Feedback({ error, message }) {
  const text = error || message;
  if (!text) return null;
  return <AdminToast key={`${error ? "error" : "success"}-${text}`} text={text} isError={Boolean(error)} />;
}

function AdminToast({ text, isError }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsVisible(false), isError ? 5500 : 3500);
    return () => window.clearTimeout(timer);
  }, [isError]);

  if (!isVisible) return null;

  return <div className="fixed right-4 top-4 z-[100] w-[calc(100%-2rem)] max-w-sm" aria-live="polite">
    <div role={isError ? "alert" : "status"} className={`flex items-start gap-3 rounded-xl border px-4 py-3 shadow-2xl backdrop-blur ${isError ? "border-[#e82b45]/50 bg-[#3a1018]/95 text-[#ffc1ca]" : "border-emerald-400/35 bg-[#0b2b23]/95 text-emerald-100"}`}>
      <span aria-hidden="true" className="mt-0.5 text-base leading-none">{isError ? "!" : "✓"}</span>
      <p className="min-w-0 flex-1 break-words text-sm font-medium">{text}</p>
      <button type="button" onClick={() => setIsVisible(false)} className="cursor-pointer px-1 text-lg leading-none opacity-75 transition hover:opacity-100" aria-label="Dismiss notification">×</button>
    </div>
  </div>;
}
export function Field({ label, value, onChange, multiline = false, className = "" }) { const inputClass = "mt-2 w-full min-w-0 max-w-full rounded-lg border border-white/15 bg-black/15 px-3 py-2.5 text-sm text-white outline-none focus:border-[#e82b45]"; return <label className={`block min-w-0 text-sm font-medium text-white/80 ${className}`}>{label}{multiline ? <textarea value={value} onChange={(event) => onChange(event.target.value)} rows="4" className={inputClass} /> : <input value={value} onChange={(event) => onChange(event.target.value)} className={inputClass} />}</label>; }
function CtaFields({ title, value, onChange }) { return <div className="min-w-0 space-y-3 rounded-xl border border-white/10 p-4"><p className="text-sm font-semibold text-white">{title}</p><Field label="Label" value={value.label} onChange={(next) => onChange("label", next)} /><Field label="Link" value={value.href} onChange={(next) => onChange("href", next)} /></div>; }
