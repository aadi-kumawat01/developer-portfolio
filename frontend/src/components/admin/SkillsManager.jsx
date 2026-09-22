"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { AdminIntro, AdminStatus, Feedback } from "@/components/admin/HeroManager";

const emptyCategory = { name: "", slug: "", description: "", order: "", visible: true };
const emptySkill = { name: "", category: "", iconKey: "", iconUrl: "", proficiency: "", description: "", order: "", visible: true };
const inputClass = "mt-2 w-full rounded-lg border border-white/15 bg-black/15 px-3 py-2.5 text-sm text-white outline-none focus:border-[#e82b45]";
const actionClass = "rounded-lg border border-white/15 px-3 py-2 text-sm text-white/80 hover:border-[#e82b45]";

function sortByOrder(items) {
  return [...items].sort((first, second) => first.order - second.order);
}

function categoryPayload(category) {
  return { ...category, order: category.order === "" ? undefined : Number(category.order) };
}

function skillPayload(skill) {
  return {
    ...skill,
    proficiency: skill.proficiency === "" ? null : Number(skill.proficiency),
    order: skill.order === "" ? undefined : Number(skill.order),
  };
}

export default function SkillsManager() {
  const [categories, setCategories] = useState([]);
  const [skills, setSkills] = useState([]);
  const [categoryForm, setCategoryForm] = useState(emptyCategory);
  const [skillForm, setSkillForm] = useState(emptySkill);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingSkillId, setEditingSkillId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingCategory, setIsSavingCategory] = useState(false);
  const [isSavingSkill, setIsSavingSkill] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadSkills() {
    setError("");
    try {
      const [categoryResponse, skillResponse] = await Promise.all([
        apiRequest("/api/admin/skill-categories"),
        apiRequest("/api/admin/skills"),
      ]);
      setCategories(sortByOrder(categoryResponse.data));
      setSkills(sortByOrder(skillResponse.data));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(loadSkills, 0);
    return () => window.clearTimeout(timer);
  }, []);

  function beginCategory(category) {
    setEditingCategoryId(category?._id || null);
    setCategoryForm(category ? { ...emptyCategory, ...category, order: String(category.order ?? "") } : emptyCategory);
    setError("");
    setMessage("");
  }

  function beginSkill(skill) {
    setEditingSkillId(skill?._id || null);
    setSkillForm(skill ? {
      ...emptySkill,
      ...skill,
      category: typeof skill.category === "object" ? skill.category._id : skill.category,
      proficiency: skill.proficiency ?? "",
      order: String(skill.order ?? ""),
    } : emptySkill);
    setError("");
    setMessage("");
  }

  async function saveCategory(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsSavingCategory(true);
    try {
      const response = await apiRequest(editingCategoryId ? `/api/admin/skill-categories/${editingCategoryId}` : "/api/admin/skill-categories", {
        method: editingCategoryId ? "PATCH" : "POST",
        body: JSON.stringify(categoryPayload(categoryForm)),
      });
      setCategories((current) => sortByOrder(editingCategoryId
        ? current.map((category) => category._id === editingCategoryId ? response.data : category)
        : [...current, response.data]));
      setMessage(editingCategoryId ? "Category updated successfully." : "Category added successfully.");
      setEditingCategoryId(null);
      setCategoryForm(emptyCategory);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSavingCategory(false);
    }
  }

  async function saveSkill(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsSavingSkill(true);
    try {
      const response = await apiRequest(editingSkillId ? `/api/admin/skills/${editingSkillId}` : "/api/admin/skills", {
        method: editingSkillId ? "PATCH" : "POST",
        body: JSON.stringify(skillPayload(skillForm)),
      });
      setSkills((current) => sortByOrder(editingSkillId
        ? current.map((skill) => skill._id === editingSkillId ? response.data : skill)
        : [...current, response.data]));
      setMessage(editingSkillId ? "Skill updated successfully." : "Skill added successfully.");
      setEditingSkillId(null);
      setSkillForm(emptySkill);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSavingSkill(false);
    }
  }

  async function deleteCategory(category) {
    if (!window.confirm(`Delete “${category.name}”?`)) return;
    setError("");
    setMessage("");
    try {
      await apiRequest(`/api/admin/skill-categories/${category._id}`, { method: "DELETE" });
      setCategories((current) => current.filter((item) => item._id !== category._id));
      if (editingCategoryId === category._id) beginCategory();
      setMessage("Category deleted.");
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function deleteSkill(skill) {
    if (!window.confirm(`Delete “${skill.name}”?`)) return;
    setError("");
    setMessage("");
    try {
      await apiRequest(`/api/admin/skills/${skill._id}`, { method: "DELETE" });
      setSkills((current) => current.filter((item) => item._id !== skill._id));
      if (editingSkillId === skill._id) beginSkill();
      setMessage("Skill deleted.");
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  if (isLoading) return <AdminStatus text="Loading skill categories and skills..." />;

  return (
    <div className="space-y-8">
      <AdminIntro title="Skills Management" text="Manage visible skill categories and the skills shown inside them." />
      <Feedback error={error} message={message} />
      <CategorySection categories={categories} skills={skills} form={categoryForm} editingId={editingCategoryId} isSaving={isSavingCategory} onChange={(field, value) => setCategoryForm((current) => ({ ...current, [field]: value }))} onSubmit={saveCategory} onAdd={() => beginCategory()} onEdit={beginCategory} onDelete={deleteCategory} onCancel={() => beginCategory()} />
      <SkillSection categories={categories} skills={skills} form={skillForm} editingId={editingSkillId} isSaving={isSavingSkill} onChange={(field, value) => setSkillForm((current) => ({ ...current, [field]: value }))} onSubmit={saveSkill} onAdd={() => beginSkill()} onEdit={beginSkill} onDelete={deleteSkill} onCancel={() => beginSkill()} />
    </div>
  );
}

function CategorySection({ categories, skills, form, editingId, isSaving, onChange, onSubmit, onAdd, onEdit, onDelete, onCancel }) {
  return <section className="space-y-4"><div className="flex flex-wrap items-center justify-between gap-3"><h3 className="text-xl font-semibold text-white">Skill categories</h3><button type="button" onClick={onAdd} className="rounded-lg bg-[#e82b45] px-4 py-2.5 text-sm font-semibold text-white">+ Add Category</button></div><form onSubmit={onSubmit} className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:grid-cols-2 sm:p-6"><FormField label="Name *" value={form.name} required onChange={(value) => onChange("name", value)} /><FormField label="Slug" value={form.slug} onChange={(value) => onChange("slug", value)} /><FormField label="Description" value={form.description} multiline className="sm:col-span-2" onChange={(value) => onChange("description", value)} /><label className="block text-sm font-medium text-white/80">Order<input type="number" value={form.order} onChange={(event) => onChange("order", event.target.value)} className={inputClass} /></label><label className="flex items-center gap-3 self-end pb-3 text-sm font-medium text-white/80"><input type="checkbox" checked={form.visible} onChange={(event) => onChange("visible", event.target.checked)} /> Visible publicly</label><div className="flex gap-3 sm:col-span-2"><button disabled={isSaving} className="rounded-lg bg-[#e82b45] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">{isSaving ? "Saving..." : editingId ? "Save Category" : "Add Category"}</button><button type="button" onClick={onCancel} className="rounded-lg border border-white/15 px-5 py-3 text-sm text-white/80">Cancel</button></div></form><div className="space-y-3">{categories.length ? categories.map((category) => <article key={category._id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4"><div><p className="font-semibold text-white">{category.name}</p><p className="mt-1 text-sm text-white/60">/{category.slug} · Order {category.order} · {skills.filter((skill) => (skill.category?._id || skill.category) === category._id).length} skills</p><p className="mt-2 text-xs font-medium uppercase tracking-wide text-white/45">{category.visible ? "Visible" : "Hidden"}</p></div><div className="flex gap-2"><button type="button" onClick={() => onEdit(category)} className={actionClass}>Edit</button><button type="button" onClick={() => onDelete(category)} className={actionClass}>Delete</button></div></article>) : <AdminStatus text="No skill categories yet." />}</div></section>;
}

function SkillSection({ categories, skills, form, editingId, isSaving, onChange, onSubmit, onAdd, onEdit, onDelete, onCancel }) {
  const groupedSkills = categories.map((category) => ({ ...category, skills: skills.filter((skill) => (skill.category?._id || skill.category) === category._id) }));
  return <section className="space-y-4"><div className="flex flex-wrap items-center justify-between gap-3"><h3 className="text-xl font-semibold text-white">Skills</h3><button type="button" onClick={onAdd} disabled={!categories.length} className="rounded-lg bg-[#e82b45] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60">+ Add Skill</button></div>{!categories.length && <AdminStatus text="Create a skill category before adding skills." />}<form onSubmit={onSubmit} className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:grid-cols-2 sm:p-6"><FormField label="Skill name *" value={form.name} required onChange={(value) => onChange("name", value)} /><label className="block text-sm font-medium text-white/80">Category *<select value={form.category} required onChange={(event) => onChange("category", event.target.value)} className={inputClass}><option value="">Select category</option>{categories.map((category) => <option key={category._id} value={category._id}>{category.name}</option>)}</select></label><FormField label="Icon key" value={form.iconKey} onChange={(value) => onChange("iconKey", value)} /><FormField label="Icon URL" value={form.iconUrl} onChange={(value) => onChange("iconUrl", value)} /><label className="block text-sm font-medium text-white/80">Proficiency (0–100)<input type="number" min="0" max="100" value={form.proficiency} onChange={(event) => onChange("proficiency", event.target.value)} className={inputClass} /></label><label className="block text-sm font-medium text-white/80">Order<input type="number" value={form.order} onChange={(event) => onChange("order", event.target.value)} className={inputClass} /></label><FormField label="Description" value={form.description} multiline className="sm:col-span-2" onChange={(value) => onChange("description", value)} /><label className="flex items-center gap-3 text-sm font-medium text-white/80 sm:col-span-2"><input type="checkbox" checked={form.visible} onChange={(event) => onChange("visible", event.target.checked)} /> Visible publicly</label><div className="flex gap-3 sm:col-span-2"><button disabled={isSaving || !categories.length} className="rounded-lg bg-[#e82b45] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">{isSaving ? "Saving..." : editingId ? "Save Skill" : "Add Skill"}</button><button type="button" onClick={onCancel} className="rounded-lg border border-white/15 px-5 py-3 text-sm text-white/80">Cancel</button></div></form><div className="space-y-4">{groupedSkills.map((group) => <div key={group._id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5"><div className="flex items-center justify-between gap-3"><h4 className="font-semibold text-white">{group.name}</h4><span className="text-xs text-white/45">{group.visible ? "Visible" : "Hidden"}</span></div><div className="mt-3 space-y-2">{group.skills.length ? group.skills.map((skill) => <SkillRow key={skill._id} skill={skill} onEdit={() => onEdit(skill)} onDelete={() => onDelete(skill)} />) : <p className="text-sm text-white/45">No skills in this category.</p>}</div></div>)}{!skills.length && categories.length > 0 && <AdminStatus text="No skills yet." />}</div></section>;
}

function SkillRow({ skill, onEdit, onDelete }) { const categoryName = skill.category?.name; const proficiency = skill.proficiency === null || skill.proficiency === undefined ? "No proficiency" : `${skill.proficiency}% proficiency`; return <article className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 p-3"><div><p className="font-medium text-white">{skill.name}</p><p className="mt-1 text-xs text-white/55">{categoryName && `${categoryName} · `}{proficiency} · Order {skill.order} · {skill.visible ? "Visible" : "Hidden"}{skill.iconKey && ` · ${skill.iconKey}`}</p></div><div className="flex gap-2"><button type="button" onClick={onEdit} className={actionClass}>Edit</button><button type="button" onClick={onDelete} className={actionClass}>Delete</button></div></article>; }

function FormField({ label, value, onChange, multiline = false, className = "", required = false }) { return <label className={`block text-sm font-medium text-white/80 ${className}`}>{label}{multiline ? <textarea value={value} onChange={(event) => onChange(event.target.value)} rows="4" className={inputClass} /> : <input value={value} required={required} onChange={(event) => onChange(event.target.value)} className={inputClass} />}</label>; }
