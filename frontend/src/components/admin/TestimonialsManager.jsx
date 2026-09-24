"use client";

import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "@/lib/api";
import { AdminIntro, AdminStatus, Feedback } from "@/components/admin/HeroManager";

const emptyTestimonial = { name: "", role: "", review: "", rating: "", initials: "", avatarUrl: "", avatarPublicId: "", order: "", visible: true, status: "approved" };
const filters = ["all", "pending", "approved", "rejected"];
const inputClass = "mt-2 w-full rounded-lg border border-white/15 bg-black/15 px-3 py-2.5 text-sm text-white outline-none focus:border-[#e82b45]";
const actionClass = "cursor-pointer rounded-lg border border-white/15 px-3 py-2 text-sm text-white/80 transition hover:border-[#e82b45] disabled:cursor-not-allowed disabled:opacity-60";
const sortItems = (items) => [...items].sort((first, second) => first.order - second.order);

function payload(item) {
  return {
    name: item.name,
    role: item.role,
    review: item.review,
    initials: item.initials,
    avatarUrl: item.avatarUrl,
    avatarPublicId: item.avatarPublicId,
    visible: item.visible,
    status: item.status,
    rating: item.rating === "" ? undefined : Number(item.rating),
    order: item.order === "" ? undefined : Number(item.order),
  };
}

export default function TestimonialsManager() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyTestimonial);
  const [editingId, setEditingId] = useState(null);
  const [removedAvatarId, setRemovedAvatarId] = useState("");
  const [filter, setFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const filteredItems = useMemo(() => filter === "all" ? items : items.filter((item) => item.status === filter), [filter, items]);

  async function loadTestimonials() {
    setError("");
    try {
      const response = await apiRequest("/api/admin/testimonials");
      setItems(sortItems(response.data));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(loadTestimonials, 0);
    return () => window.clearTimeout(timer);
  }, []);

  function beginEdit(item) {
    setEditingId(item?._id || null);
    setRemovedAvatarId("");
    setForm(item ? { ...emptyTestimonial, ...item, rating: item.rating ?? "", order: String(item.order ?? "") } : emptyTestimonial);
    setError("");
    setMessage("");
  }

  function update(field, value) { setForm((current) => ({ ...current, [field]: value })); }

  async function deleteImage(publicId) {
    if (!publicId) return;
    try {
      await apiRequest("/api/admin/uploads/image", { method: "DELETE", body: JSON.stringify({ publicId }) });
    } catch {
      setMessage("Saved, but the previous avatar could not be deleted.");
    }
  }

  async function uploadAvatar(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setError("");
    setIsUploading(true);
    const body = new FormData();
    body.append("image", file);
    body.append("type", "testimonial-avatar");
    try {
      const response = await apiRequest("/api/admin/uploads/image", { method: "POST", body });
      update("avatarUrl", response.data.url);
      update("avatarPublicId", response.data.publicId);
      setMessage("Avatar uploaded. Save the testimonial to publish it.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  }

  async function save(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsSaving(true);
    try {
      const oldAvatarId = editingId ? items.find((item) => item._id === editingId)?.avatarPublicId : "";
      const response = await apiRequest(editingId ? `/api/admin/testimonials/${editingId}` : "/api/admin/testimonials", { method: editingId ? "PATCH" : "POST", body: JSON.stringify(payload(form)) });
      setItems((current) => sortItems(editingId ? current.map((item) => item._id === editingId ? response.data : item) : [...current, response.data]));
      if (oldAvatarId && oldAvatarId !== form.avatarPublicId) await deleteImage(oldAvatarId);
      if (removedAvatarId) await deleteImage(removedAvatarId);
      setEditingId(null);
      setForm(emptyTestimonial);
      setRemovedAvatarId("");
      setMessage("Testimonial saved successfully.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSaving(false);
    }
  }

  async function changeStatus(item, status) {
    setError("");
    try {
      const response = await apiRequest(`/api/admin/testimonials/${item._id}`, { method: "PATCH", body: JSON.stringify({ status }) });
      setItems((current) => sortItems(current.map((currentItem) => currentItem._id === item._id ? response.data : currentItem)));
      setMessage(`Testimonial ${status}.`);
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  function removeAvatar() {
    if (form.avatarPublicId && editingId) setRemovedAvatarId(form.avatarPublicId);
    else deleteImage(form.avatarPublicId);
    update("avatarUrl", "");
    update("avatarPublicId", "");
  }

  async function removeTestimonial(item) {
    if (!window.confirm(`Delete testimonial from “${item.name}”?`)) return;
    setError("");
    try {
      await apiRequest(`/api/admin/testimonials/${item._id}`, { method: "DELETE" });
      if (item.avatarPublicId) await deleteImage(item.avatarPublicId);
      setItems((current) => current.filter((currentItem) => currentItem._id !== item._id));
      setMessage("Testimonial deleted.");
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  if (isLoading) return <AdminStatus text="Loading testimonials..." />;
  return <div className="space-y-6">
    <div className="flex flex-wrap items-end justify-between gap-4"><AdminIntro title="Testimonials Management" text="Publish only genuine feedback from people you have worked with." /><button type="button" onClick={() => beginEdit()} className="cursor-pointer rounded-lg bg-[#e82b45] px-4 py-2.5 text-sm font-semibold text-white">+ Add Testimonial</button></div>
    <Feedback error={error} message={message} />
    <div className="flex flex-wrap gap-2">{filters.map((item) => <button key={item} type="button" onClick={() => setFilter(item)} className={`${actionClass} ${filter === item ? "border-[#e82b45] bg-[#e82b45]/10 text-white" : ""}`}>{item[0].toUpperCase() + item.slice(1)}</button>)}</div>
    <form onSubmit={save} className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:grid-cols-2 sm:p-6">
      <Field label="Name *" value={form.name} required onChange={(value) => update("name", value)} />
      <Field label="Role" value={form.role} onChange={(value) => update("role", value)} />
      <Field label="Review *" value={form.review} required multiline className="sm:col-span-2" onChange={(value) => update("review", value)} />
      <label className="block text-sm font-medium text-white/80">Rating<select value={form.rating} onChange={(event) => update("rating", event.target.value)} className={`${inputClass} cursor-pointer`}><option value="">Not specified</option>{[1, 2, 3, 4, 5].map((rating) => <option key={rating} value={rating}>{rating} / 5</option>)}</select></label>
      <Field label="Initials" value={form.initials} onChange={(value) => update("initials", value)} />
      <label className="block text-sm font-medium text-white/80">Status<select value={form.status} onChange={(event) => update("status", event.target.value)} className={`${inputClass} cursor-pointer`}><option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option></select></label>
      <label className="block text-sm font-medium text-white/80">Order<input type="number" value={form.order} onChange={(event) => update("order", event.target.value)} className={inputClass} /></label>
      <label className="flex items-center gap-3 self-end pb-3 text-sm font-medium text-white/80"><input type="checkbox" checked={form.visible} onChange={(event) => update("visible", event.target.checked)} className="cursor-pointer" /> Visible publicly</label>
      <AvatarPanel form={form} isUploading={isUploading} onUpload={uploadAvatar} onRemove={removeAvatar} />
      <div className="flex flex-wrap gap-3 sm:col-span-2"><button disabled={isSaving || isUploading} className="cursor-pointer rounded-lg bg-[#e82b45] px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">{isSaving ? "Saving..." : editingId ? "Save Testimonial" : "Add Testimonial"}</button><button type="button" onClick={() => beginEdit()} className={actionClass}>Cancel</button></div>
    </form>
    <section className="space-y-3">{filteredItems.map((item) => <TestimonialRow key={item._id} item={item} onEdit={() => beginEdit(item)} onDelete={() => removeTestimonial(item)} onApprove={() => changeStatus(item, "approved")} onReject={() => changeStatus(item, "rejected")} />)}{!filteredItems.length && <AdminStatus text={filter === "all" ? "No testimonials saved. Visitor feedback will remain pending until you approve it." : `No ${filter} testimonials.`} />}</section>
  </div>;
}

function AvatarPanel({ form, isUploading, onUpload, onRemove }) { return <div className="rounded-xl border border-white/10 p-4 sm:col-span-2"><p className="text-sm font-semibold text-white">Avatar (optional)</p><div className="mt-3 flex flex-wrap items-center gap-4">{form.avatarUrl ? <img src={form.avatarUrl} alt="Avatar preview" className="h-16 w-16 rounded-full border border-white/10 object-cover" /> : <div className="grid h-16 w-16 place-items-center rounded-full border border-white/10 text-sm font-semibold text-white/60">{form.initials || "?"}</div>}<div><input type="file" accept="image/jpeg,image/png,image/webp" onChange={onUpload} className="block cursor-pointer text-sm text-white/70" />{form.avatarUrl && <button type="button" onClick={onRemove} className="mt-2 cursor-pointer text-xs text-[#ffb0bb]">Remove avatar</button>}</div></div><p className="mt-3 text-xs text-white/45">{isUploading ? "Uploading avatar..." : "Upload JPG, PNG or WebP and save the testimonial."}</p></div>; }
function TestimonialRow({ item, onEdit, onDelete, onApprove, onReject }) { return <article className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4"><div className="flex min-w-0 items-center gap-3">{item.avatarUrl ? <img src={item.avatarUrl} alt="" className="h-10 w-10 rounded-full object-cover" /> : <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/5 text-xs font-semibold text-white/70">{item.initials || item.name.slice(0, 2)}</span>}<div className="min-w-0"><p className="font-semibold text-white">{item.name}</p>{item.submitterEmail && <p className="truncate text-xs text-white/45">{item.submitterEmail}</p>}{item.role && <p className="text-sm text-white/55">{item.role}</p>}<p className="mt-1 line-clamp-1 text-xs text-white/45">{item.review}</p><p className="mt-1 text-xs text-white/45">{item.rating ? `${item.rating}/5 · ` : ""}{item.submittedByVisitor ? "Visitor submission · " : "Admin entry · "}{item.status} · Order {item.order} · {item.visible ? "Visible" : "Hidden"}</p></div></div><div className="flex flex-wrap gap-2">{item.status !== "approved" && <button type="button" onClick={onApprove} className={actionClass}>Approve</button>}{item.status !== "rejected" && <button type="button" onClick={onReject} className={actionClass}>Reject</button>}<button type="button" onClick={onEdit} className={actionClass}>Edit</button><button type="button" onClick={onDelete} className={actionClass}>Delete</button></div></article>; }
function Field({ label, value, onChange, multiline = false, className = "", required = false }) { return <label className={`block text-sm font-medium text-white/80 ${className}`}>{label}{multiline ? <textarea value={value} required={required} onChange={(event) => onChange(event.target.value)} rows="4" className={inputClass} /> : <input value={value} required={required} onChange={(event) => onChange(event.target.value)} className={inputClass} />}</label>; }
