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
      await apiRequest("/api/admin/site", { method: "PATCH", body: JSON.stringify({ hero }) });
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
export function Feedback({ error, message }) { return <>{error && <p role="alert" className="rounded-lg border border-[#e82b45]/40 bg-[#e82b45]/10 px-3 py-2 text-sm text-[#ffb0bb]">{error}</p>}{message && <p role="status" className="rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-200">{message}</p>}</>; }
export function Field({ label, value, onChange, multiline = false, className = "" }) { const inputClass = "mt-2 w-full rounded-lg border border-white/15 bg-black/15 px-3 py-2.5 text-sm text-white outline-none focus:border-[#e82b45]"; return <label className={`block text-sm font-medium text-white/80 ${className}`}>{label}{multiline ? <textarea value={value} onChange={(event) => onChange(event.target.value)} rows="4" className={inputClass} /> : <input value={value} onChange={(event) => onChange(event.target.value)} className={inputClass} />}</label>; }
function CtaFields({ title, value, onChange }) { return <div className="space-y-3 rounded-xl border border-white/10 p-4"><p className="text-sm font-semibold text-white">{title}</p><Field label="Label" value={value.label} onChange={(next) => onChange("label", next)} /><Field label="Link" value={value.href} onChange={(next) => onChange("href", next)} /></div>; }
