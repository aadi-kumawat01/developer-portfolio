"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { apiRequest } from "@/lib/api";
import { AdminIntro, AdminStatus, Feedback, Field } from "@/components/admin/HeroManager";

const emptyAbout = { eyebrow: "", heading: "", description: "", developerLabel: "", locationText: "", imageUrl: "", imagePublicId: "", visible: true };

export default function AboutManager() {
  const [about, setAbout] = useState(emptyAbout);
  const [savedAbout, setSavedAbout] = useState(emptyAbout);
  const [stats, setStats] = useState([]);
  const [highlights, setHighlights] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [newStat, setNewStat] = useState({ value: "", label: "", order: "" });
  const [newHighlight, setNewHighlight] = useState({ title: "", order: "" });

  async function loadContent() {
    setError("");
    try {
      const [siteResponse, statResponse, highlightResponse] = await Promise.all([apiRequest("/api/admin/site"), apiRequest("/api/admin/about-stats"), apiRequest("/api/admin/about-highlights")]);
      const nextAbout = { ...emptyAbout, ...siteResponse.data.about };
      setAbout(nextAbout); setSavedAbout(nextAbout); setStats(statResponse.data); setHighlights(highlightResponse.data);
    } catch (requestError) { setError(requestError.message); } finally { setIsLoading(false); }
  }

  useEffect(() => {
    const timer = window.setTimeout(loadContent, 0);
    return () => window.clearTimeout(timer);
  }, []);
  function updateAbout(field, value) { setAbout((current) => ({ ...current, [field]: value })); }

  async function saveAbout(event) {
    event.preventDefault(); setError(""); setMessage(""); setIsSaving(true);
    try {
      await apiRequest("/api/admin/site", { method: "PATCH", body: JSON.stringify({ about }) });
      const previousImageId = savedAbout.imagePublicId;
      setSavedAbout(about); setMessage("About content saved successfully.");
      if (previousImageId && previousImageId !== about.imagePublicId) {
        try { await apiRequest("/api/admin/uploads/image", { method: "DELETE", body: JSON.stringify({ publicId: previousImageId }) }); } catch { setMessage("About content saved. The previous image could not be deleted automatically."); }
      }
    } catch (requestError) { setError(requestError.message); } finally { setIsSaving(false); }
  }

  async function uploadImage(event) {
    const file = event.target.files?.[0]; if (!file) return;
    setError(""); setIsUploading(true);
    const body = new FormData(); body.append("image", file); body.append("type", "about");
    try { const response = await apiRequest("/api/admin/uploads/image", { method: "POST", body }); setAbout((current) => ({ ...current, imageUrl: response.data.url, imagePublicId: response.data.publicId })); setMessage("New image uploaded. Save About to publish it."); } catch (requestError) { setError(requestError.message); } finally { setIsUploading(false); event.target.value = ""; }
  }

  async function createItem(type) {
    const isStat = type === "stat"; const source = isStat ? newStat : newHighlight;
    try { const body = { ...source, order: source.order === "" ? undefined : Number(source.order) }; const response = await apiRequest(`/api/admin/about-${isStat ? "stats" : "highlights"}`, { method: "POST", body: JSON.stringify(body) }); if (isStat) { setStats((items) => [...items, response.data].sort((a, b) => a.order - b.order)); setNewStat({ value: "", label: "", order: "" }); } else { setHighlights((items) => [...items, response.data].sort((a, b) => a.order - b.order)); setNewHighlight({ title: "", order: "" }); } } catch (requestError) { setError(requestError.message); }
  }
  async function updateItem(type, item) { try { const response = await apiRequest(`/api/admin/about-${type}/${item._id}`, { method: "PATCH", body: JSON.stringify({ ...item, order: Number(item.order) }) }); const setter = type === "stats" ? setStats : setHighlights; setter((items) => items.map((current) => current._id === item._id ? response.data : current).sort((a, b) => a.order - b.order)); setMessage("Saved successfully."); } catch (requestError) { setError(requestError.message); } }
  async function deleteItem(type, id) { if (!window.confirm("Delete this item?")) return; try { await apiRequest(`/api/admin/about-${type}/${id}`, { method: "DELETE" }); const setter = type === "stats" ? setStats : setHighlights; setter((items) => items.filter((item) => item._id !== id)); } catch (requestError) { setError(requestError.message); } }
  function editItem(type, id, field, value) { const setter = type === "stats" ? setStats : setHighlights; setter((items) => items.map((item) => item._id === id ? { ...item, [field]: value } : item)); }

  if (isLoading) return <AdminStatus text="Loading About content..." />;
  return <div className="space-y-8"><AdminIntro title="About Management" text="Update the About content, profile image, stats and highlights." /><form onSubmit={saveAbout} className="space-y-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6"><div className="grid gap-4 sm:grid-cols-2"><Field label="Eyebrow" value={about.eyebrow} onChange={(value) => updateAbout("eyebrow", value)} /><Field label="Developer label" value={about.developerLabel} onChange={(value) => updateAbout("developerLabel", value)} /><Field label="Heading" value={about.heading} onChange={(value) => updateAbout("heading", value)} className="sm:col-span-2" /><Field label="Description" value={about.description} multiline onChange={(value) => updateAbout("description", value)} className="sm:col-span-2" /><Field label="Location" value={about.locationText} onChange={(value) => updateAbout("locationText", value)} /></div><div className="rounded-xl border border-white/10 p-4"><p className="text-sm font-semibold text-white">Profile image</p>{about.imageUrl && <Image src={about.imageUrl} alt="About preview" width={128} height={160} className="mt-3 aspect-[4/5] w-32 rounded-lg object-cover" />}<input type="file" accept="image/jpeg,image/png,image/webp" onChange={uploadImage} className="mt-3 block text-sm text-white/70" /><p className="mt-2 text-xs text-white/50">{isUploading ? "Uploading image..." : "Upload JPG, PNG or WebP (max 5 MB)."}</p></div><label className="flex items-center gap-3 text-sm font-medium text-white/80"><input type="checkbox" checked={about.visible} onChange={(event) => updateAbout("visible", event.target.checked)} /> Show About section</label><Feedback error={error} message={message} /><button disabled={isSaving || isUploading} className="rounded-lg bg-[#e82b45] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">{isSaving ? "Saving..." : "Save About"}</button></form><Manager title="Stats" items={stats} type="stats" onEdit={editItem} onSave={updateItem} onDelete={deleteItem} newItem={newStat} setNewItem={setNewStat} onCreate={createItem} /><Manager title="Highlights" items={highlights} type="highlights" onEdit={editItem} onSave={updateItem} onDelete={deleteItem} newItem={newHighlight} setNewItem={setNewHighlight} onCreate={createItem} /></div>;
}

function Manager({ title, items, type, onEdit, onSave, onDelete, newItem, setNewItem, onCreate }) { const isStat = type === "stats"; const inputClass = "w-full rounded-lg border border-white/15 bg-black/15 px-3 py-2 text-sm text-white outline-none focus:border-[#e82b45]"; const buttonClass = "rounded-lg border border-white/15 px-3 py-2 text-sm text-white/80 hover:border-[#e82b45]"; return <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6"><h3 className="text-xl font-semibold text-white">{title}</h3><div className="mt-4 space-y-3">{items.map((item) => <div key={item._id} className="grid gap-2 rounded-xl border border-white/10 p-3 sm:grid-cols-[1fr_1fr_80px_auto_auto]">{isStat ? <><input value={item.value} onChange={(event) => onEdit(type, item._id, "value", event.target.value)} className={inputClass} /><input value={item.label} onChange={(event) => onEdit(type, item._id, "label", event.target.value)} className={inputClass} /></> : <input value={item.title} onChange={(event) => onEdit(type, item._id, "title", event.target.value)} className={`${inputClass} sm:col-span-2`} />}<input type="number" value={item.order} onChange={(event) => onEdit(type, item._id, "order", event.target.value)} className={inputClass} /><label className="flex items-center gap-2 text-xs text-white/70"><input type="checkbox" checked={item.visible} onChange={(event) => onEdit(type, item._id, "visible", event.target.checked)} />Visible</label><div className="flex gap-2"><button type="button" onClick={() => onSave(type, item)} className={buttonClass}>Save</button><button type="button" onClick={() => onDelete(type, item._id)} className={buttonClass}>Delete</button></div></div>)}</div><div className="mt-4 grid gap-2 sm:grid-cols-[1fr_1fr_80px_auto]">{isStat ? <><input placeholder="Value" value={newItem.value} onChange={(event) => setNewItem({ ...newItem, value: event.target.value })} className={inputClass} /><input placeholder="Label" value={newItem.label} onChange={(event) => setNewItem({ ...newItem, label: event.target.value })} className={inputClass} /></> : <input placeholder="Highlight title" value={newItem.title} onChange={(event) => setNewItem({ ...newItem, title: event.target.value })} className={`${inputClass} sm:col-span-2`} />}<input type="number" placeholder="Order" value={newItem.order} onChange={(event) => setNewItem({ ...newItem, order: event.target.value })} className={inputClass} /><button type="button" onClick={() => onCreate(isStat ? "stat" : "highlight")} className={buttonClass}>Add</button></div></section>; }
