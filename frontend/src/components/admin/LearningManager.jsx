"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { AdminIntro, AdminStatus, Feedback } from "@/components/admin/HeroManager";

const emptyLearning = { type: "", title: "", institution: "", startDate: "", endDate: "", duration: "", status: "", certificateStatus: "", description: "", order: "", visible: true };
const inputClass = "mt-2 w-full rounded-lg border border-white/15 bg-black/15 px-3 py-2.5 text-sm text-white outline-none focus:border-[#e82b45]";
const actionClass = "rounded-lg border border-white/15 px-3 py-2 text-sm text-white/80 hover:border-[#e82b45]";

function sortItems(items) { return [...items].sort((first, second) => first.order - second.order); }

export default function LearningManager() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyLearning);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadLearning() {
      try { const response = await apiRequest("/api/admin/learning"); setItems(sortItems(response.data)); }
      catch (requestError) { setError(requestError.message); }
      finally { setIsLoading(false); }
    }
    loadLearning();
  }, []);

  function updateForm(field, value) { setForm((current) => ({ ...current, [field]: value })); }
  function closeForm() { setEditingId(null); setForm(emptyLearning); }
  function startEdit(item) { setEditingId(item._id); setForm({ ...emptyLearning, ...item, order: String(item.order ?? "") }); setError(""); setMessage(""); }

  async function handleSubmit(event) {
    event.preventDefault(); setError(""); setMessage(""); setIsSaving(true);
    try {
      const response = await apiRequest(editingId ? `/api/admin/learning/${editingId}` : "/api/admin/learning", { method: editingId ? "PATCH" : "POST", body: JSON.stringify({ ...form, order: form.order === "" ? undefined : Number(form.order) }) });
      setItems((current) => sortItems(editingId ? current.map((item) => item._id === editingId ? response.data : item) : [...current, response.data]));
      setMessage(editingId ? "Learning item updated successfully." : "Learning item added successfully."); closeForm();
    } catch (requestError) { setError(requestError.message); }
    finally { setIsSaving(false); }
  }

  async function deleteLearning(item) {
    if (!window.confirm(`Delete “${item.title}”?`)) return;
    setError(""); setMessage("");
    try { await apiRequest(`/api/admin/learning/${item._id}`, { method: "DELETE" }); setItems((current) => current.filter((currentItem) => currentItem._id !== item._id)); if (editingId === item._id) closeForm(); setMessage("Learning item deleted."); }
    catch (requestError) { setError(requestError.message); }
  }

  if (isLoading) return <AdminStatus text="Loading learning records..." />;

  return <div className="space-y-6"><div className="flex flex-wrap items-end justify-between gap-4"><AdminIntro title="Learning Management" text="Manage courses, training and certification records." /><button type="button" onClick={() => { closeForm(); setError(""); setMessage(""); }} className="rounded-lg bg-[#e82b45] px-4 py-2.5 text-sm font-semibold text-white">+ Add Learning</button></div><Feedback error={error} message={message} /><LearningForm form={form} isEditing={Boolean(editingId)} isSaving={isSaving} onChange={updateForm} onCancel={closeForm} onSubmit={handleSubmit} /><section className="space-y-3">{items.length ? items.map((item) => <LearningRow key={item._id} item={item} onEdit={() => startEdit(item)} onDelete={() => deleteLearning(item)} />) : <AdminStatus text="No learning records yet. The public portfolio remains unchanged until you add one." />}</section></div>;
}

function LearningForm({ form, isEditing, isSaving, onChange, onCancel, onSubmit }) {
  return <form onSubmit={onSubmit} className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:grid-cols-2 sm:p-6"><FormField label="Title *" value={form.title} required onChange={(value) => onChange("title", value)} /><FormField label="Type" value={form.type} onChange={(value) => onChange("type", value)} /><FormField label="Institution" value={form.institution} onChange={(value) => onChange("institution", value)} /><FormField label="Duration" value={form.duration} onChange={(value) => onChange("duration", value)} /><FormField label="Start date / year" value={form.startDate} onChange={(value) => onChange("startDate", value)} /><FormField label="End date / year" value={form.endDate} onChange={(value) => onChange("endDate", value)} /><FormField label="Status" value={form.status} onChange={(value) => onChange("status", value)} /><FormField label="Certificate status" value={form.certificateStatus} onChange={(value) => onChange("certificateStatus", value)} /><label className="block text-sm font-medium text-white/80">Order<input type="number" value={form.order} onChange={(event) => onChange("order", event.target.value)} className={inputClass} /></label><FormField label="Description" value={form.description} multiline className="sm:col-span-2" onChange={(value) => onChange("description", value)} /><label className="flex items-center gap-3 text-sm font-medium text-white/80 sm:col-span-2"><input type="checkbox" checked={form.visible} onChange={(event) => onChange("visible", event.target.checked)} /> Show on public portfolio</label><div className="flex gap-3 sm:col-span-2"><button disabled={isSaving} className="rounded-lg bg-[#e82b45] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">{isSaving ? "Saving..." : isEditing ? "Save Learning" : "Add Learning"}</button><button type="button" onClick={onCancel} className="rounded-lg border border-white/15 px-5 py-3 text-sm font-medium text-white/80">Cancel</button></div></form>;
}

function LearningRow({ item, onEdit, onDelete }) {
  const timeframe = [item.startDate, item.endDate].filter(Boolean).join(" – ") || item.duration || "No duration added";
  return <article className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4"><div><p className="font-semibold text-white">{item.title}</p><p className="mt-1 text-sm text-white/60">{item.institution || "No institution added"} · {timeframe}</p><p className="mt-2 text-xs font-medium uppercase tracking-wide text-white/45">{item.status || "No status"} · Order {item.order} · {item.visible ? "Visible" : "Hidden"}</p></div><div className="flex gap-2"><button type="button" onClick={onEdit} className={actionClass}>Edit</button><button type="button" onClick={onDelete} className={actionClass}>Delete</button></div></article>;
}

function FormField({ label, value, onChange, multiline = false, className = "", required = false }) { return <label className={`block text-sm font-medium text-white/80 ${className}`}>{label}{multiline ? <textarea value={value} onChange={(event) => onChange(event.target.value)} rows="4" className={inputClass} /> : <input value={value} required={required} onChange={(event) => onChange(event.target.value)} className={inputClass} />}</label>; }
