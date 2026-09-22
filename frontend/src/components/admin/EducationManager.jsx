"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { AdminIntro, AdminStatus, Feedback } from "@/components/admin/HeroManager";

const emptyEducation = {
  type: "",
  title: "",
  institution: "",
  college: "",
  university: "",
  board: "",
  startDate: "",
  endDate: "",
  yearLabel: "",
  percentage: "",
  marksLabel: "",
  status: "completed",
  badgeText: "",
  description: "",
  order: "",
  visible: true,
};

function sortItems(items) {
  return [...items].sort((first, second) => first.order - second.order);
}

function formPayload(item) {
  return {
    ...item,
    order: item.order === "" ? undefined : Number(item.order),
  };
}

export default function EducationManager() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyEducation);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadEducation() {
    setError("");
    try {
      const response = await apiRequest("/api/admin/education");
      setItems(sortItems(response.data));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(loadEducation, 0);
    return () => window.clearTimeout(timer);
  }, []);

  function updateForm(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function startCreate() {
    setEditingId(null);
    setForm(emptyEducation);
    setError("");
    setMessage("");
  }

  function startEdit(item) {
    setEditingId(item._id);
    setForm({ ...emptyEducation, ...item, order: String(item.order ?? "") });
    setError("");
    setMessage("");
  }

  function closeForm() {
    setEditingId(null);
    setForm(emptyEducation);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsSaving(true);

    try {
      const response = await apiRequest(
        editingId ? `/api/admin/education/${editingId}` : "/api/admin/education",
        {
          method: editingId ? "PATCH" : "POST",
          body: JSON.stringify(formPayload(form)),
        },
      );
      setItems((current) => sortItems(editingId
        ? current.map((item) => item._id === editingId ? response.data : item)
        : [...current, response.data]));
      setMessage(editingId ? "Education updated successfully." : "Education added successfully.");
      closeForm();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteEducation(item) {
    if (!window.confirm(`Delete “${item.title}”?`)) return;

    setError("");
    setMessage("");
    try {
      await apiRequest(`/api/admin/education/${item._id}`, { method: "DELETE" });
      setItems((current) => current.filter((currentItem) => currentItem._id !== item._id));
      if (editingId === item._id) closeForm();
      setMessage("Education deleted.");
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  if (isLoading) return <AdminStatus text="Loading education records..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <AdminIntro title="Education Management" text="Add, update, order or hide academic records." />
        <button type="button" onClick={startCreate} className="rounded-lg bg-[#e82b45] px-4 py-2.5 text-sm font-semibold text-white">+ Add Education</button>
      </div>
      <Feedback error={error} message={message} />

      <EducationForm form={form} isEditing={Boolean(editingId)} isSaving={isSaving} onChange={updateForm} onCancel={closeForm} onSubmit={handleSubmit} />

      <section className="space-y-3">
        {items.length ? items.map((item) => <EducationRow key={item._id} item={item} onEdit={() => startEdit(item)} onDelete={() => deleteEducation(item)} />) : <AdminStatus text="No education records yet. Your public fallback content remains unchanged." />}
      </section>
    </div>
  );
}

function EducationForm({ form, isEditing, isSaving, onChange, onCancel, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:grid-cols-2 sm:p-6">
      <FormField label="Title *" value={form.title} required onChange={(value) => onChange("title", value)} />
      <FormField label="Type" value={form.type} onChange={(value) => onChange("type", value)} />
      <FormField label="Institution" value={form.institution} onChange={(value) => onChange("institution", value)} />
      <FormField label="College" value={form.college} onChange={(value) => onChange("college", value)} />
      <FormField label="University" value={form.university} onChange={(value) => onChange("university", value)} />
      <FormField label="Board" value={form.board} onChange={(value) => onChange("board", value)} />
      <FormField label="Start date / year" value={form.startDate} onChange={(value) => onChange("startDate", value)} />
      <FormField label="End date / year" value={form.endDate} onChange={(value) => onChange("endDate", value)} />
      <FormField label="Year label" value={form.yearLabel} onChange={(value) => onChange("yearLabel", value)} />
      <FormField label="Percentage" value={form.percentage} onChange={(value) => onChange("percentage", value)} />
      <FormField label="Marks label" value={form.marksLabel} onChange={(value) => onChange("marksLabel", value)} />
      <FormField label="Badge text" value={form.badgeText} onChange={(value) => onChange("badgeText", value)} />
      <label className="block text-sm font-medium text-white/80">Status<select value={form.status} onChange={(event) => onChange("status", event.target.value)} className={inputClass}><option value="completed">Completed</option><option value="ongoing">Ongoing</option></select></label>
      <label className="block text-sm font-medium text-white/80">Order<input type="number" value={form.order} onChange={(event) => onChange("order", event.target.value)} className={inputClass} /></label>
      <FormField label="Description" value={form.description} multiline className="sm:col-span-2" onChange={(value) => onChange("description", value)} />
      <label className="flex items-center gap-3 text-sm font-medium text-white/80 sm:col-span-2"><input type="checkbox" checked={form.visible} onChange={(event) => onChange("visible", event.target.checked)} /> Show on public portfolio</label>
      <div className="flex flex-wrap gap-3 sm:col-span-2"><button disabled={isSaving} className="rounded-lg bg-[#e82b45] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">{isSaving ? "Saving..." : isEditing ? "Save Education" : "Add Education"}</button><button type="button" onClick={onCancel} className="rounded-lg border border-white/15 px-5 py-3 text-sm font-medium text-white/80">Cancel</button></div>
    </form>
  );
}

function EducationRow({ item, onEdit, onDelete }) {
  const institution = item.institution || item.college || item.university || "No institution added";
  const year = item.yearLabel || [item.startDate, item.endDate].filter(Boolean).join(" – ") || "No year added";
  return <article className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4"><div className="min-w-0 flex-1"><p className="break-words font-semibold text-white">{item.title}</p><p className="mt-1 break-words text-sm text-white/60">{institution} · {year}</p><p className="mt-2 text-xs font-medium uppercase tracking-wide text-white/45">{item.status || "No status"} · Order {item.order} · {item.visible ? "Visible" : "Hidden"}</p></div><div className="flex flex-wrap gap-2"><button type="button" onClick={onEdit} className={actionClass}>Edit</button><button type="button" onClick={onDelete} className={actionClass}>Delete</button></div></article>;
}

const inputClass = "mt-2 w-full min-w-0 max-w-full rounded-lg border border-white/15 bg-black/15 px-3 py-2.5 text-sm text-white outline-none focus:border-[#e82b45]";
const actionClass = "rounded-lg border border-white/15 px-3 py-2 text-sm text-white/80 hover:border-[#e82b45]";

function FormField({ label, value, onChange, multiline = false, className = "", required = false }) {
  return <label className={`block min-w-0 text-sm font-medium text-white/80 ${className}`}>{label}{multiline ? <textarea value={value} onChange={(event) => onChange(event.target.value)} rows="4" className={inputClass} /> : <input value={value} required={required} onChange={(event) => onChange(event.target.value)} className={inputClass} />}</label>;
}
