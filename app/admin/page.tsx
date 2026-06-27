// app/admin/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { Project, Tech } from "@/types";
import { Plus, Pencil, Trash2, Search, Upload, X, Star, Eye } from "lucide-react";
import toast from "react-hot-toast";
import { cn, slugify, getTechColor } from "@/lib/utils";
import Image from "next/image";

const ADMIN_SECRET =
  typeof window !== "undefined"
    ? localStorage.getItem("admin_secret") || ""
    : "";

function useAdminSecret() {
  const [secret, setSecret] = useState("");
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("admin_secret") || "";
    setSecret(stored);
    if (stored) setAuthed(true);
  }, []);

  const login = (s: string) => {
    localStorage.setItem("admin_secret", s);
    setSecret(s);
    setAuthed(true);
  };

  const logout = () => {
    localStorage.removeItem("admin_secret");
    setSecret("");
    setAuthed(false);
  };

  return { secret, authed, login, logout };
}

// ─── Admin Login ─────────────────────────────────────────────────────────────
function AdminLogin({ onLogin }: { onLogin: (s: string) => void }) {
  const [value, setValue] = useState("");
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="card p-8 w-full max-w-sm flex flex-col gap-4">
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Admin Login</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Enter your admin secret to continue.</p>
        <input
          type="password"
          className="input"
          placeholder="Admin secret"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onLogin(value)}
        />
        <button className="btn-primary" onClick={() => onLogin(value)}>
          Continue
        </button>
      </div>
    </div>
  );
}

// ─── Project Form ─────────────────────────────────────────────────────────────
const EMPTY_PROJECT = {
  title: "",
  description: "",
  longDescription: "",
  stack: [] as Tech[],
  tags: [] as string[],
  imageUrls: [] as string[],
  imagePublicIds: [] as string[],
  thumbnailUrl: "",
  liveUrl: "",
  repoUrl: "",
  featured: false,
  status: "completed" as const,
};

type ProjectDraft = typeof EMPTY_PROJECT;

function ProjectForm({
  initial,
  onSave,
  onCancel,
  secret,
}: {
  initial?: Partial<ProjectDraft> & { _id?: string };
  onSave: (p: Project) => void;
  onCancel: () => void;
  secret: string;
}) {
  const [form, setForm] = useState<ProjectDraft>({ ...EMPTY_PROJECT, ...initial });
  const [saving, setSaving] = useState(false);
  const [techInput, setTechInput] = useState("");
  const [techCategory, setTechCategory] = useState<Tech["category"]>("language");
  const [tagInput, setTagInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (key: keyof ProjectDraft, value: unknown) =>
    setForm((f) => ({ ...f, [key]: value }));

  const addTech = () => {
    if (!techInput.trim()) return;
    const tech: Tech = {
      name: techInput.trim(),
      category: techCategory,
      color: getTechColor(techInput.trim()),
    };
    set("stack", [...form.stack, tech]);
    setTechInput("");
  };

  const removeTech = (i: number) =>
    set("stack", form.stack.filter((_, idx) => idx !== i));

  const addTag = () => {
    if (!tagInput.trim() || form.tags.includes(tagInput.trim())) return;
    set("tags", [...form.tags, tagInput.trim()]);
    setTagInput("");
  };

  const removeTag = (t: string) =>
    set("tags", form.tags.filter((x) => x !== t));

  const handleUpload = async (files: FileList | null, type: "image" | "thumbnail") => {
    if (!files?.length) return;
    setUploading(true);
    try {
      const fd = new FormData();
      Array.from(files).forEach((f) => fd.append("files", f));
      fd.append("type", type);
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "x-admin-secret": secret },
        body: fd,
      });
      const { uploads } = await res.json();
      if (type === "thumbnail") {
        set("thumbnailUrl", uploads[0].url);
      } else {
        set("imageUrls", [...form.imageUrls, ...uploads.map((u: { url: string }) => u.url)]);
        set("imagePublicIds", [
          ...form.imagePublicIds,
          ...uploads.map((u: { publicId: string }) => u.publicId),
        ]);
      }
      toast.success(`${uploads.length} image(s) uploaded`);
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.description.trim()) {
      toast.error("Title and description are required");
      return;
    }
    setSaving(true);
    try {
      const isEdit = !!initial?._id;
      const url = isEdit ? `/api/projects/${initial._id}` : "/api/projects";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": secret,
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(await res.text());
      const saved: Project = await res.json();
      toast.success(isEdit ? "Project updated!" : "Project created!");
      onSave(saved);
    } catch (err) {
      toast.error(String(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-5 max-h-[80vh] overflow-y-auto pr-1">
      {/* Title */}
      <div>
        <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1 block">
          Title *
        </label>
        <input
          className="input"
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          placeholder="My Awesome Project"
        />
      </div>

      {/* Description */}
      <div>
        <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1 block">
          Short Description * (max 300 chars)
        </label>
        <textarea
          className="input resize-none"
          rows={2}
          maxLength={300}
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="A brief description shown on cards"
        />
        <p className="text-xs text-zinc-400 mt-0.5 text-right">
          {form.description.length}/300
        </p>
      </div>

      {/* Long description */}
      <div>
        <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1 block">
          Full Description (optional)
        </label>
        <textarea
          className="input resize-none"
          rows={5}
          value={form.longDescription}
          onChange={(e) => set("longDescription", e.target.value)}
          placeholder="Detailed project description shown on the detail page..."
        />
      </div>

      {/* Thumbnail upload */}
      <div>
        <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1 block">
          Thumbnail
        </label>
        <div className="flex items-center gap-3">
          {form.thumbnailUrl && (
            <div className="relative w-24 h-16 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700">
              <Image src={form.thumbnailUrl} alt="Thumbnail" fill className="object-cover" />
            </div>
          )}
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              const input = document.createElement("input");
              input.type = "file";
              input.accept = "image/*";
              input.onchange = (e) =>
                handleUpload((e.target as HTMLInputElement).files, "thumbnail");
              input.click();
            }}
            disabled={uploading}
          >
            <Upload size={14} />
            {uploading ? "Uploading…" : "Upload thumbnail"}
          </button>
          {form.thumbnailUrl && (
            <button
              onClick={() => set("thumbnailUrl", "")}
              className="text-zinc-400 hover:text-red-500 transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Screenshot images */}
      <div>
        <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1 block">
          Screenshots
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {form.imageUrls.map((url, i) => (
            <div
              key={i}
              className="relative w-24 h-16 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700 group"
            >
              <Image src={url} alt={`Screenshot ${i + 1}`} fill className="object-cover" />
              <button
                onClick={() => {
                  set("imageUrls", form.imageUrls.filter((_, idx) => idx !== i));
                  set("imagePublicIds", form.imagePublicIds.filter((_, idx) => idx !== i));
                }}
                className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={10} />
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn-secondary h-16 px-4"
            onClick={() => {
              const input = document.createElement("input");
              input.type = "file";
              input.accept = "image/*";
              input.multiple = true;
              input.onchange = (e) =>
                handleUpload((e.target as HTMLInputElement).files, "image");
              input.click();
            }}
            disabled={uploading}
          >
            <Plus size={14} />
            Add
          </button>
        </div>
      </div>

      {/* Tech stack */}
      <div>
        <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1 block">
          Tech Stack
        </label>
        <div className="flex gap-2 mb-2">
          <input
            className="input flex-1"
            placeholder="React, TypeScript…"
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTech()}
          />
          <select
            className="input w-32"
            value={techCategory}
            onChange={(e) => setTechCategory(e.target.value as Tech["category"])}
          >
            <option value="language">Language</option>
            <option value="framework">Framework</option>
            <option value="database">Database</option>
            <option value="tool">Tool</option>
            <option value="platform">Platform</option>
            <option value="other">Other</option>
          </select>
          <button className="btn-primary px-3" onClick={addTech}>
            <Plus size={14} />
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {form.stack.map((t, i) => (
            <span
              key={i}
              className="badge badge-other gap-1.5"
            >
              {t.name}
              <span className="text-xs text-zinc-400 capitalize">({t.category})</span>
              <button onClick={() => removeTech(i)} className="hover:text-red-500 transition-colors">
                <X size={10} />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1 block">
          Tags
        </label>
        <div className="flex gap-2 mb-2">
          <input
            className="input flex-1"
            placeholder="web, api, mobile…"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTag()}
          />
          <button className="btn-primary px-3" onClick={addTag}>
            <Plus size={14} />
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {form.tags.map((t) => (
            <span key={t} className="badge badge-other">
              #{t}
              <button onClick={() => removeTag(t)} className="hover:text-red-500 transition-colors ml-0.5">
                <X size={10} />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* URLs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1 block">
            Live URL
          </label>
          <input
            className="input"
            type="url"
            placeholder="https://…"
            value={form.liveUrl}
            onChange={(e) => set("liveUrl", e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1 block">
            Repo URL
          </label>
          <input
            className="input"
            type="url"
            placeholder="https://github.com/…"
            value={form.repoUrl}
            onChange={(e) => set("repoUrl", e.target.value)}
          />
        </div>
      </div>

      {/* Status + Featured */}
      <div className="flex items-center gap-4 flex-wrap">
        <div>
          <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1 block">
            Status
          </label>
          <select
            className="input w-40"
            value={form.status}
            onChange={(e) => set("status", e.target.value)}
          >
            <option value="completed">Completed</option>
            <option value="in-progress">In Progress</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <label className="flex items-center gap-2 cursor-pointer mt-4">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => set("featured", e.target.checked)}
            className="w-4 h-4 rounded border-zinc-300 text-brand-600 focus:ring-brand-500"
          />
          <span className="text-sm text-zinc-700 dark:text-zinc-300">Featured project</span>
        </label>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2 border-t border-zinc-200 dark:border-zinc-800 sticky bottom-0 bg-white dark:bg-zinc-950 pb-2">
        <button className="btn-primary flex-1" onClick={handleSave} disabled={saving}>
          {saving ? "Saving…" : initial?._id ? "Save changes" : "Create project"}
        </button>
        <button className="btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}

// ─── Admin Main ───────────────────────────────────────────────────────────────
export default function AdminPage() {
  const { secret, authed, login, logout } = useAdminSecret();
  const [projects, setProjects] = useState<Project[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const qs = new URLSearchParams({
        q,
        page: String(page),
        limit: "20",
        sort: "newest",
      });
      const res = await fetch(`/api/projects?${qs}`);
      const data = await res.json();
      setProjects(data.projects);
      setTotal(data.total);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authed) fetchProjects();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed, page, q]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project? This cannot be undone.")) return;
    setDeleting(id);
    try {
      await fetch(`/api/projects/${id}`, {
        method: "DELETE",
        headers: { "x-admin-secret": secret },
      });
      toast.success("Project deleted");
      fetchProjects();
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeleting(null);
    }
  };

  if (!authed) return <AdminLogin onLogin={login} />;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="section-heading">Admin Panel</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            {total.toLocaleString()} total projects
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="btn-primary"
            onClick={() => {
              setEditProject(null);
              setShowForm(true);
            }}
          >
            <Plus size={15} /> New Project
          </button>
          <button className="btn-secondary" onClick={logout}>
            Sign out
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4 max-w-sm">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
        />
        <input
          className="input pl-9"
          placeholder="Search projects…"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="card w-full max-w-2xl p-6 shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">
                {editProject ? "Edit Project" : "New Project"}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditProject(null);
                }}
                className="btn-ghost p-1"
              >
                <X size={18} />
              </button>
            </div>
            <ProjectForm
              initial={editProject || undefined}
              secret={secret}
              onSave={(saved) => {
                setShowForm(false);
                setEditProject(null);
                fetchProjects();
              }}
              onCancel={() => {
                setShowForm(false);
                setEditProject(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Projects table */}
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
              <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Project
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider hidden md:table-cell">
                Stack
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider hidden lg:table-cell">
                Status
              </th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-4 py-3">
                      <div className="skeleton h-4 w-40 rounded mb-1" />
                      <div className="skeleton h-3 w-64 rounded" />
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="skeleton h-4 w-24 rounded" />
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <div className="skeleton h-4 w-20 rounded" />
                    </td>
                    <td className="px-4 py-3" />
                  </tr>
                ))
              : projects.map((p) => (
                  <tr
                    key={p._id}
                    className="hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {p.featured && (
                          <Star
                            size={12}
                            className="text-brand-500 fill-brand-500 flex-shrink-0"
                          />
                        )}
                        <div>
                          <p className="font-medium text-zinc-900 dark:text-zinc-100 line-clamp-1">
                            {p.title}
                          </p>
                          <p className="text-xs text-zinc-400 dark:text-zinc-500 line-clamp-1 mt-0.5">
                            {p.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {p.stack.slice(0, 3).map((t) => (
                          <span key={t.name} className="badge badge-other text-[10px]">
                            {t.name}
                          </span>
                        ))}
                        {p.stack.length > 3 && (
                          <span className="badge badge-other text-[10px]">
                            +{p.stack.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "inline-block w-1.5 h-1.5 rounded-full",
                            p.status === "completed"
                              ? "bg-green-500"
                              : p.status === "in-progress"
                              ? "bg-amber-500"
                              : "bg-zinc-400"
                          )}
                        />
                        <span className="text-zinc-500 dark:text-zinc-400 capitalize text-xs">
                          {p.status}
                        </span>
                        <span className="flex items-center gap-0.5 text-xs text-zinc-400 ml-2">
                          <Eye size={10} />
                          {p.viewCount || 0}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <button
                          onClick={() => {
                            setEditProject(p);
                            setShowForm(true);
                          }}
                          className="btn-ghost p-1.5"
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(p._id)}
                          disabled={deleting === p._id}
                          className="btn-ghost p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>

        {/* Pagination */}
        {total > 20 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-200 dark:border-zinc-800">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Page {page} of {Math.ceil(total / 20)}
            </p>
            <div className="flex gap-2">
              <button
                className="btn-secondary py-1 px-3 text-xs"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </button>
              <button
                className="btn-secondary py-1 px-3 text-xs"
                disabled={page >= Math.ceil(total / 20)}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
