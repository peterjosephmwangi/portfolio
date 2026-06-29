// app/admin/page.tsx
"use client";

import { useState, useEffect, useRef, createContext, useContext } from "react";
import { Project, Tech } from "@/types";
import {
  Plus, Pencil, Trash2, Search, X, Star, Eye,
  Sun, Moon, LogOut, FolderOpen, ChevronLeft, ChevronRight,
  CheckCircle2, Clock, Archive, Loader2, ImagePlus, AlertCircle,
  KeyRound, UserCircle2,
} from "lucide-react";
import toast from "react-hot-toast";
import { cn, slugify, getTechColor } from "@/lib/utils";
import Image from "next/image";

// ─── Types ────────────────────────────────────────────────────────────────────
interface DemoCredential {
  role: string;
  label: string;
  username?: string;
  password: string;
  description?: string;
}

// ─── Theme ────────────────────────────────────────────────────────────────────
const ThemeContext = createContext<{ dark: boolean; toggle: () => void }>({
  dark: false,
  toggle: () => {},
});

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("admin-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = stored ? stored === "dark" : prefersDark;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggle = () => {
    setDark((d) => {
      const next = !d;
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("admin-theme", next ? "dark" : "light");
      return next;
    });
  };

  return <ThemeContext.Provider value={{ dark, toggle }}>{children}</ThemeContext.Provider>;
}

// ─── Session ──────────────────────────────────────────────────────────────────
function useAdminSession() {
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/admin/session")
      .then((r) => setAuthed(r.ok))
      .catch(() => setAuthed(false));
  }, []);

  const login = async (password: string) => {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) { setAuthed(true); return true; }
    return false;
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthed(false);
  };

  return { authed, login, logout };
}

// ─── Login ────────────────────────────────────────────────────────────────────
function AdminLogin({ onLogin }: { onLogin: (s: string) => Promise<boolean> }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { dark, toggle } = useContext(ThemeContext);

  const submit = async () => {
    if (!value) return;
    setSubmitting(true);
    setError("");
    const ok = await onLogin(value);
    if (!ok) { setError("Incorrect password"); setSubmitting(false); }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col items-center justify-center p-4 relative">
      <button
        onClick={toggle}
        className="absolute top-5 right-5 p-2 rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
      >
        {dark ? <Sun size={16} /> : <Moon size={16} />}
      </button>

      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[var(--brand-600)] mb-4 shadow-lg shadow-indigo-500/20">
            <FolderOpen size={22} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">Portfolio Admin</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">Enter your admin secret to continue</p>
        </div>

        <div className="bg-[var(--bg)] border border-[var(--border)] rounded-2xl p-6 shadow-[var(--shadow-md)]">
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                Admin Secret
              </label>
              <input
                type="password"
                className="input"
                placeholder="••••••••••••"
                value={value}
                onChange={(e) => { setValue(e.target.value); setError(""); }}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                autoFocus
              />
              {error && (
                <p className="flex items-center gap-1 text-xs text-red-500 mt-1.5">
                  <AlertCircle size={12} /> {error}
                </p>
              )}
            </div>
            <button
              className="btn btn-primary w-full py-2.5"
              onClick={submit}
              disabled={submitting || !value}
            >
              {submitting ? (
                <><Loader2 size={14} className="animate-spin" /> Verifying…</>
              ) : "Continue →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Shared upload types & drop-zone shell ───────────────────────────────────
interface UploadFile {
  id: string;
  file: File;
  preview: string;
  status: "uploading" | "done" | "error";
  url?: string;
  publicId?: string;
}

function DropZoneShell({
  dragging,
  onDragOver,
  onDragLeave,
  onDrop,
  onClick,
  multiple,
  inputRef,
  onFiles,
}: {
  dragging: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onClick: () => void;
  multiple: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  onFiles: (f: FileList) => void;
}) {
  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center gap-2 py-5 px-4 rounded-xl border-2 border-dashed cursor-pointer transition-all select-none",
        dragging
          ? "border-[var(--brand-500)] bg-[var(--brand-50)] scale-[1.01]"
          : "border-[var(--border)] hover:border-[var(--brand-400)] hover:bg-[var(--bg-subtle)]"
      )}
    >
      <div className={cn(
        "w-9 h-9 rounded-xl flex items-center justify-center transition-colors",
        dragging ? "bg-[var(--brand-600)] text-white" : "bg-[var(--bg-muted)] text-[var(--text-muted)]"
      )}>
        <ImagePlus size={18} />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-[var(--text-secondary)]">
          {dragging ? "Drop to upload" : multiple ? "Drop images here" : "Drop an image here"}
        </p>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">
          or <span className="text-[var(--brand-600)] font-medium">browse files</span> · PNG, JPG, WebP
        </p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        className="hidden"
        onChange={(e) => e.target.files && onFiles(e.target.files)}
        onClick={(e) => { (e.target as HTMLInputElement).value = ""; }}
      />
    </div>
  );
}

function PreviewThumb({
  src,
  status,
  onRemove,
  onRetry,
}: {
  src: string;
  status?: UploadFile["status"];
  onRemove: () => void;
  onRetry?: () => void;
}) {
  return (
    <div className="relative w-20 h-14 rounded-lg overflow-hidden border border-[var(--border)] group flex-shrink-0">
      <Image src={src} alt="" fill className="object-cover" />
      {status === "uploading" && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <Loader2 size={16} className="text-white animate-spin" />
        </div>
      )}
      {status === "done" && (
        <div className="absolute bottom-1 right-1 bg-green-500 rounded-full p-0.5 shadow-sm">
          <CheckCircle2 size={10} className="text-white" />
        </div>
      )}
      {status === "error" && (
        <div className="absolute inset-0 bg-red-900/60 flex flex-col items-center justify-center gap-1">
          <AlertCircle size={13} className="text-red-300" />
          {onRetry && (
            <button onClick={(e) => { e.stopPropagation(); onRetry(); }} className="text-[10px] text-white underline">
              Retry
            </button>
          )}
        </div>
      )}
      <button
        onClick={(e) => { e.stopPropagation(); onRemove(); }}
        className="absolute top-1 right-1 bg-gray-900/80 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
      >
        <X size={9} />
      </button>
    </div>
  );
}

// ─── Thumbnail uploader ───────────────────────────────────────────────────────
function ThumbnailUploader({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState<UploadFile | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = async (file: File) => {
    const preview = URL.createObjectURL(file);
    const id = Math.random().toString(36).slice(2);
    setUploading({ id, file, preview, status: "uploading" });

    try {
      const fd = new FormData();
      fd.append("files", file);
      fd.append("type", "thumbnail");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error();
      const { uploads } = await res.json();
      onChange(uploads[0].url);
      URL.revokeObjectURL(preview);
      setUploading(null);
    } catch {
      setUploading((prev) => prev ? { ...prev, status: "error" } : null);
    }
  };

  const handleFiles = (files: FileList) => {
    if (!files.length) return;
    upload(files[0]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const previewUrl = uploading?.preview ?? value;
  const previewStatus = uploading?.status;

  return (
    <div className="space-y-2">
      <label className="field-label">Thumbnail</label>
      {previewUrl && (
        <div className="flex gap-2 mb-2">
          <PreviewThumb
            src={previewUrl}
            status={previewStatus}
            onRemove={() => {
              if (uploading) {
                URL.revokeObjectURL(uploading.preview);
                setUploading(null);
              } else {
                onChange("");
              }
            }}
            onRetry={uploading?.status === "error" ? () => upload(uploading.file) : undefined}
          />
        </div>
      )}
      <DropZoneShell
        dragging={dragging}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        multiple={false}
        inputRef={inputRef}
        onFiles={handleFiles}
      />
    </div>
  );
}

// ─── Screenshots uploader ─────────────────────────────────────────────────────
function ScreenshotsUploader({
  urls,
  publicIds,
  onAdd,
  onRemove,
}: {
  urls: string[];
  publicIds: string[];
  onAdd: (url: string, publicId: string) => void;
  onRemove: (index: number) => void;
}) {
  const [inflight, setInflight] = useState<UploadFile[]>([]);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const updateInflight = (id: string, patch: Partial<UploadFile>) =>
    setInflight((prev) => prev.map((f) => f.id === id ? { ...f, ...patch } : f));

  const upload = async (file: File) => {
    const id = Math.random().toString(36).slice(2);
    const preview = URL.createObjectURL(file);
    setInflight((prev) => [...prev, { id, file, preview, status: "uploading" }]);

    try {
      const fd = new FormData();
      fd.append("files", file);
      fd.append("type", "image");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error();
      const { uploads } = await res.json();
      const url: string = uploads[0].url;
      const publicId: string = uploads[0].publicId ?? "";
      onAdd(url, publicId);
      URL.revokeObjectURL(preview);
      setInflight((prev) => prev.filter((f) => f.id !== id));
    } catch {
      updateInflight(id, { status: "error" });
    }
  };

  const handleFiles = (files: FileList) => {
    Array.from(files).forEach((f) => upload(f));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeInflight = (id: string) => {
    setInflight((prev) => {
      const f = prev.find((x) => x.id === id);
      if (f) URL.revokeObjectURL(f.preview);
      return prev.filter((x) => x.id !== id);
    });
  };

  return (
    <div className="space-y-2">
      <label className="field-label">Screenshots</label>
      {(urls.length > 0 || inflight.length > 0) && (
        <div className="flex flex-wrap gap-2 mb-2">
          {urls.map((url, i) => (
            <PreviewThumb key={`saved-${i}-${url}`} src={url} onRemove={() => onRemove(i)} />
          ))}
          {inflight.map((uf) => (
            <PreviewThumb
              key={uf.id}
              src={uf.preview}
              status={uf.status}
              onRemove={() => removeInflight(uf.id)}
              onRetry={uf.status === "error" ? () => {
                removeInflight(uf.id);
                upload(uf.file);
              } : undefined}
            />
          ))}
        </div>
      )}
      <DropZoneShell
        dragging={dragging}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        multiple={true}
        inputRef={inputRef}
        onFiles={handleFiles}
      />
    </div>
  );
}

// ─── Demo Credentials Manager ─────────────────────────────────────────────────
const EMPTY_CRED: DemoCredential = {
  role: "",
  label: "",
  username: "",
  password: "",
  description: "",
};

const ROLE_PRESETS = ["admin", "secretary", "member", "moderator", "editor", "viewer", "user"];

function DemoCredentialsManager({
  credentials,
  onChange,
}: {
  credentials: DemoCredential[];
  onChange: (creds: DemoCredential[]) => void;
}) {
  const [input, setInput] = useState<DemoCredential>(EMPTY_CRED);
  const [showPresets, setShowPresets] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const setField = (key: keyof DemoCredential, value: string) =>
    setInput((prev) => ({ ...prev, [key]: value }));

  const isValid = input.role.trim() && input.label.trim() && input.password.trim();

  const handleAdd = () => {
    if (!isValid) return;
    const cred = {
      role: input.role.trim(),
      label: input.label.trim(),
      username: input.username?.trim() || undefined,
      password: input.password.trim(),
      description: input.description?.trim() || undefined,
    };

    if (editIndex !== null) {
      const updated = [...credentials];
      updated[editIndex] = cred;
      onChange(updated);
      setEditIndex(null);
    } else {
      onChange([...credentials, cred]);
    }
    setInput(EMPTY_CRED);
  };

  const handleEdit = (index: number) => {
    setEditIndex(index);
    setInput({ ...EMPTY_CRED, ...credentials[index] });
  };

  const handleRemove = (index: number) => {
    onChange(credentials.filter((_, i) => i !== index));
    if (editIndex === index) {
      setEditIndex(null);
      setInput(EMPTY_CRED);
    }
  };

  const handleCancel = () => {
    setEditIndex(null);
    setInput(EMPTY_CRED);
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <KeyRound size={14} className="text-[var(--text-muted)]" />
        <label className="field-label !mb-0">Demo Credentials</label>
        <span className="text-[10px] text-[var(--text-muted)] bg-[var(--bg-muted)] px-1.5 py-0.5 rounded-full">
          Shown to visitors for testing
        </span>
      </div>

      {/* Existing credentials list */}
      {credentials.length > 0 && (
        <div className="flex flex-col gap-2 mb-3">
          {credentials.map((cred, i) => (
            <div
              key={i}
              className={cn(
                "flex items-start justify-between px-3 py-2.5 rounded-lg border text-sm transition-colors",
                editIndex === i
                  ? "border-[var(--brand-400)] bg-[var(--brand-50)] dark:bg-[var(--brand-900)]/20"
                  : "border-[var(--border)] bg-[var(--bg-subtle)]"
              )}
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-[var(--bg-muted)] border border-[var(--border)] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <UserCircle2 size={14} className="text-[var(--text-muted)]" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-[var(--text-primary)]">{cred.label}</span>
                    <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] bg-[var(--bg-muted)] px-1.5 py-0.5 rounded">
                      {cred.role}
                    </span>
                  </div>
                  {cred.description && (
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">{cred.description}</p>
                  )}
                  <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                    {cred.username && (
                      <span className="flex items-center gap-1 text-xs text-[var(--text-secondary)]">
                        <span className="text-[var(--text-muted)]">user:</span>
                        <code className="font-mono">{cred.username}</code>
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-xs text-[var(--text-secondary)]">
                      <span className="text-[var(--text-muted)]">pass:</span>
                      <code className="font-mono bg-[var(--bg-muted)] px-1.5 py-0.5 rounded border border-[var(--border)]">
                        {cred.password}
                      </code>
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                <button
                  onClick={() => handleEdit(i)}
                  className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--brand-600)] hover:bg-[var(--bg-muted)] transition-colors"
                  title="Edit"
                >
                  <Pencil size={12} />
                </button>
                <button
                  onClick={() => handleRemove(i)}
                  className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                  title="Remove"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / edit form */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)] p-3">
        <p className="text-xs font-medium text-[var(--text-muted)] mb-2.5">
          {editIndex !== null ? "Edit credential" : "Add a credential"}
        </p>

        {/* Role row with presets */}
        <div className="relative mb-2">
          <input
            className="input text-sm pr-24"
            placeholder='Role (e.g. "admin")'
            value={input.role}
            onChange={(e) => setField("role", e.target.value)}
            onFocus={() => setShowPresets(true)}
            onBlur={() => setTimeout(() => setShowPresets(false), 150)}
          />
          {showPresets && (
            <div className="absolute top-full left-0 mt-1 z-10 flex flex-wrap gap-1 bg-[var(--bg)] border border-[var(--border)] rounded-lg p-2 shadow-lg w-full">
              {ROLE_PRESETS.filter(
                (r) => !input.role || r.startsWith(input.role.toLowerCase())
              ).map((preset) => (
                <button
                  key={preset}
                  onMouseDown={() => {
                    setField("role", preset);
                    // Auto-populate label if empty
                    if (!input.label) {
                      setField("label", preset.charAt(0).toUpperCase() + preset.slice(1) + " Account");
                    }
                  }}
                  className="text-[11px] px-2 py-0.5 rounded-full bg-[var(--bg-muted)] hover:bg-[var(--brand-50)] hover:text-[var(--brand-700)] border border-[var(--border)] transition-colors"
                >
                  {preset}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 mb-2">
          <input
            className="input text-sm"
            placeholder='Label (e.g. "Admin Account")'
            value={input.label}
            onChange={(e) => setField("label", e.target.value)}
          />
          <input
            className="input text-sm"
            placeholder="Username (optional)"
            value={input.username}
            onChange={(e) => setField("username", e.target.value)}
            autoComplete="off"
          />
        </div>

        <div className="mb-2">
          <input
            className="input text-sm"
            placeholder="Password *"
            value={input.password}
            onChange={(e) => setField("password", e.target.value)}
            autoComplete="off"
          />
        </div>

        <div className="mb-3">
          <input
            className="input text-sm"
            placeholder='Description (e.g. "Full access to dashboard")'
            value={input.description}
            onChange={(e) => setField("description", e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            className="btn btn-primary text-xs gap-1.5 flex-1 py-2"
            onClick={handleAdd}
            disabled={!isValid}
          >
            {editIndex !== null ? (
              <><CheckCircle2 size={13} /> Update</>
            ) : (
              <><Plus size={13} /> Add Credential</>
            )}
          </button>
          {editIndex !== null && (
            <button className="btn btn-secondary text-xs py-2 px-3" onClick={handleCancel}>
              Cancel
            </button>
          )}
        </div>
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
  demoCredentials: [] as DemoCredential[],
};

type ProjectDraft = typeof EMPTY_PROJECT;

function ProjectForm({
  initial,
  onSave,
  onCancel,
  onAuthExpired,
}: {
  initial?: Partial<ProjectDraft> & { _id?: string };
  onSave: (p: Project) => void;
  onCancel: () => void;
  onAuthExpired: () => void;
}) {
  const [form, setForm] = useState<ProjectDraft>({ ...EMPTY_PROJECT, ...initial });
  const [saving, setSaving] = useState(false);
  const [techInput, setTechInput] = useState("");
  const [techCategory, setTechCategory] = useState<Tech["category"]>("language");
  const [tagInput, setTagInput] = useState("");

  const set = (key: keyof ProjectDraft, value: unknown) =>
    setForm((f) => ({ ...f, [key]: value }));

  const addTech = () => {
    if (!techInput.trim()) return;
    set("stack", [...form.stack, { name: techInput.trim(), category: techCategory, color: getTechColor(techInput.trim()) }]);
    setTechInput("");
  };

  const addTag = () => {
    if (!tagInput.trim() || form.tags.includes(tagInput.trim())) return;
    set("tags", [...form.tags, tagInput.trim()]);
    setTagInput("");
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.description.trim()) {
      toast.error("Title and description are required");
      return;
    }
    setSaving(true);
    try {
      const isEdit = !!initial?._id;
      const res = await fetch(isEdit ? `/api/projects/${initial._id}` : "/api/projects", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.status === 401) { onAuthExpired(); return; }
      if (!res.ok) throw new Error(await res.text());
      toast.success(isEdit ? "Project saved" : "Project created");
      onSave(await res.json());
    } catch (err) {
      toast.error(String(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-5 max-h-[78vh] overflow-y-auto pr-2">

      {/* Title + Status row */}
      <div className="grid grid-cols-[1fr_auto] gap-3">
        <div>
          <label className="field-label">Title *</label>
          <input className="input" value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="My Awesome Project" />
        </div>
        <div>
          <label className="field-label">Status</label>
          <select className="input w-36" value={form.status} onChange={(e) => set("status", e.target.value)}>
            <option value="completed">Completed</option>
            <option value="in-progress">In Progress</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Short description */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="field-label !mb-0">Short Description *</label>
          <span className="text-[11px] text-[var(--text-muted)]">{form.description.length}/300</span>
        </div>
        <textarea
          className="input resize-none"
          rows={2}
          maxLength={300}
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="A brief description shown on cards"
        />
      </div>

      {/* Long description */}
      <div>
        <label className="field-label">Full Description</label>
        <textarea
          className="input resize-none"
          rows={4}
          value={form.longDescription}
          onChange={(e) => set("longDescription", e.target.value)}
          placeholder="Detailed project write-up shown on the detail page…"
        />
      </div>

      {/* Thumbnail */}
      <ThumbnailUploader
        value={form.thumbnailUrl}
        onChange={(url) => set("thumbnailUrl", url)}
      />

      {/* Screenshots */}
      <ScreenshotsUploader
        urls={form.imageUrls}
        publicIds={form.imagePublicIds}
        onAdd={(url, publicId) => {
          setForm((f) => ({
            ...f,
            imageUrls: [...f.imageUrls, url],
            imagePublicIds: [...f.imagePublicIds, publicId],
          }));
        }}
        onRemove={(i) => {
          setForm((f) => ({
            ...f,
            imageUrls: f.imageUrls.filter((_, idx) => idx !== i),
            imagePublicIds: f.imagePublicIds.filter((_, idx) => idx !== i),
          }));
        }}
      />

      {/* Tech stack */}
      <div>
        <label className="field-label">Tech Stack</label>
        <div className="flex gap-2 mb-2">
          <input
            className="input flex-1"
            placeholder="React, TypeScript…"
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTech()}
          />
          <select className="input w-32" value={techCategory} onChange={(e) => setTechCategory(e.target.value as Tech["category"])}>
            <option value="language">Language</option>
            <option value="framework">Framework</option>
            <option value="database">Database</option>
            <option value="tool">Tool</option>
            <option value="platform">Platform</option>
            <option value="other">Other</option>
          </select>
          <button className="btn btn-primary px-3" onClick={addTech}><Plus size={14} /></button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {form.stack.map((t, i) => (
            <span key={i} className={cn("badge", `badge-${t.category}`)}>
              {t.name}
              <button onClick={() => set("stack", form.stack.filter((_, idx) => idx !== i))} className="hover:text-red-500 ml-0.5 transition-colors">
                <X size={10} />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="field-label">Tags</label>
        <div className="flex gap-2 mb-2">
          <input
            className="input flex-1"
            placeholder="web, api, mobile…"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTag()}
          />
          <button className="btn btn-primary px-3" onClick={addTag}><Plus size={14} /></button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {form.tags.map((t) => (
            <span key={t} className="badge badge-other">
              #{t}
              <button onClick={() => set("tags", form.tags.filter((x) => x !== t))} className="hover:text-red-500 ml-0.5 transition-colors">
                <X size={10} />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* URLs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="field-label">Live URL</label>
          <input className="input" type="url" placeholder="https://…" value={form.liveUrl} onChange={(e) => set("liveUrl", e.target.value)} />
        </div>
        <div>
          <label className="field-label">Repo URL</label>
          <input className="input" type="url" placeholder="https://github.com/…" value={form.repoUrl} onChange={(e) => set("repoUrl", e.target.value)} />
        </div>
      </div>

      {/* Demo Credentials */}
      <DemoCredentialsManager
        credentials={form.demoCredentials}
        onChange={(creds) => set("demoCredentials", creds)}
      />

      {/* Featured */}
      <label className="flex items-center gap-2.5 cursor-pointer group w-fit">
        <div className={cn(
          "w-10 h-5.5 rounded-full relative transition-colors",
          form.featured ? "bg-[var(--brand-600)]" : "bg-[var(--border)]"
        )}>
          <div className={cn(
            "absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white shadow transition-all",
            form.featured ? "left-[calc(100%-18px)]" : "left-0.5"
          )} />
          <input type="checkbox" className="sr-only" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} />
        </div>
        <span className="text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors select-none">
          Feature this project
        </span>
      </label>

      {/* Footer actions */}
      <div className="flex items-center gap-3 pt-3 border-t border-[var(--border)] sticky bottom-0 bg-[var(--bg)] -mx-1 px-1 pb-1">
        <button className="btn btn-primary flex-1 py-2.5" onClick={handleSave} disabled={saving}>
          {saving ? <><Loader2 size={14} className="animate-spin" /> Saving…</> : initial?._id ? "Save changes" : "Create project"}
        </button>
        <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { icon: React.ReactNode; cls: string; label: string }> = {
    completed:    { icon: <CheckCircle2 size={11} />, cls: "text-[var(--green-text)] bg-[var(--green-bg)]", label: "Completed" },
    "in-progress":{ icon: <Clock size={11} />,         cls: "text-[var(--amber-text)] bg-[var(--amber-bg)]", label: "In Progress" },
    archived:     { icon: <Archive size={11} />,       cls: "text-[var(--zinc-text)] bg-[var(--zinc-bg)]",  label: "Archived" },
  };
  const { icon, cls, label } = map[status] ?? map.archived;
  return (
    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium", cls)}>
      {icon}{label}
    </span>
  );
}

// ─── Admin Main ───────────────────────────────────────────────────────────────
function AdminInner({ logout }: { logout: () => void }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const { dark, toggle } = useContext(ThemeContext);

  const totalPages = Math.ceil(total / 20);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const qs = new URLSearchParams({ q, page: String(page), limit: "20", sort: "newest" });
      const res = await fetch(`/api/projects?${qs}`);
      const data = await res.json();
      setProjects(data.projects);
      setTotal(data.total);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, [page, q]);

  const handleAuthExpired = () => { toast.error("Session expired"); logout(); };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project? This cannot be undone.")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (res.status === 401) { handleAuthExpired(); return; }
      toast.success("Project deleted");
      fetchProjects();
    } catch { toast.error("Delete failed"); }
    finally { setDeleting(null); }
  };

  const openEdit = (p: Project) => { setEditProject(p); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditProject(null); };

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Top nav */}
      <nav className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[var(--brand-600)] flex items-center justify-center">
              <FolderOpen size={14} className="text-white" />
            </div>
            <span className="font-semibold text-sm text-[var(--text-primary)]">Portfolio Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggle} className="btn btn-ghost p-2" title="Toggle theme">
              {dark ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <button onClick={logout} className="btn btn-ghost p-2 gap-1.5 text-[var(--text-muted)] hover:text-red-500" title="Sign out">
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header */}
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">Projects</h1>
            <p className="text-sm text-[var(--text-muted)] mt-0.5">
              {loading ? "Loading…" : `${total.toLocaleString()} total`}
            </p>
          </div>
          <button
            className="btn btn-primary gap-2 py-2.5 px-4"
            onClick={() => { setEditProject(null); setShowForm(true); }}
          >
            <Plus size={15} /> New Project
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-5 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
          <input
            className="input pl-9 text-sm"
            placeholder="Search projects…"
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(1); }}
          />
        </div>

        {/* Table card */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--bg-subtle)]">
                  {["Project", "Stack", "Status", "Views", ""].map((h, i) => (
                    <th
                      key={i}
                      className={cn(
                        "px-4 py-3 text-left text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider whitespace-nowrap",
                        i === 1 && "hidden md:table-cell",
                        i === 2 && "hidden lg:table-cell",
                        i === 3 && "hidden lg:table-cell",
                        i === 4 && "text-right",
                      )}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-muted)]">
                {loading
                  ? Array.from({ length: 6 }).map((_, i) => (
                      <tr key={i}>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="skeleton w-10 h-7 rounded-md flex-shrink-0" />
                            <div>
                              <div className="skeleton h-3.5 w-36 rounded mb-1.5" />
                              <div className="skeleton h-2.5 w-52 rounded" />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 hidden md:table-cell"><div className="skeleton h-3 w-24 rounded" /></td>
                        <td className="px-4 py-3.5 hidden lg:table-cell"><div className="skeleton h-5 w-20 rounded-full" /></td>
                        <td className="px-4 py-3.5 hidden lg:table-cell"><div className="skeleton h-3 w-8 rounded" /></td>
                        <td className="px-4 py-3.5" />
                      </tr>
                    ))
                  : projects.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-16 text-center">
                        <FolderOpen size={28} className="mx-auto text-[var(--text-muted)] mb-2 opacity-40" />
                        <p className="text-sm text-[var(--text-muted)]">No projects found</p>
                        {q && <p className="text-xs text-[var(--text-muted)] mt-0.5">Try a different search term</p>}
                      </td>
                    </tr>
                  ) : projects.map((p) => (
                    <tr key={p._id} className="hover:bg-[var(--bg-subtle)] transition-colors group">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-7 rounded-md overflow-hidden flex-shrink-0 bg-[var(--bg-muted)] border border-[var(--border)]">
                            {p.thumbnailUrl
                              ? <Image src={p.thumbnailUrl} alt="" width={40} height={28} className="object-cover w-full h-full" />
                              : <div className="w-full h-full flex items-center justify-center"><FolderOpen size={12} className="text-[var(--text-muted)]" /></div>
                            }
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              {p.featured && <Star size={11} className="text-amber-400 fill-amber-400 flex-shrink-0" />}
                              <p className="font-medium text-[var(--text-primary)] truncate max-w-[200px]">{p.title}</p>
                              {/* Show credential count badge if project has demo credentials */}
                              {p.demoCredentials?.length > 0 && (
                                <span
                                  className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--bg-muted)] border border-[var(--border)] text-[var(--text-muted)] flex-shrink-0"
                                  title={`${p.demoCredentials.length} demo credential${p.demoCredentials.length > 1 ? "s" : ""}`}
                                >
                                  <KeyRound size={9} />
                                  {p.demoCredentials.length}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-[var(--text-muted)] truncate max-w-[260px] mt-0.5">{p.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 hidden md:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {p.stack.slice(0, 3).map((t) => (
                            <span key={t.name} className={cn("badge text-[10px]", `badge-${t.category}`)}>{t.name}</span>
                          ))}
                          {p.stack.length > 3 && (
                            <span className="badge badge-other text-[10px]">+{p.stack.length - 3}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 hidden lg:table-cell">
                        <StatusBadge status={p.status} />
                      </td>
                      <td className="px-4 py-3.5 hidden lg:table-cell">
                        <span className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                          <Eye size={11} />{p.viewCount ?? 0}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-0.5 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEdit(p)} className="btn btn-ghost p-1.5" title="Edit">
                            <Pencil size={13} />
                          </button>
                          <button
                            onClick={() => handleDelete(p._id)}
                            disabled={deleting === p._id}
                            className="btn btn-ghost p-1.5 text-[var(--text-muted)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
                            title="Delete"
                          >
                            {deleting === p._id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--border)] bg-[var(--bg-subtle)]">
              <p className="text-xs text-[var(--text-muted)]">
                Page {page} of {totalPages} · {total} projects
              </p>
              <div className="flex gap-1.5">
                <button className="btn btn-secondary py-1 px-2.5 text-xs gap-1" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                  <ChevronLeft size={12} /> Prev
                </button>
                <button className="btn btn-secondary py-1 px-2.5 text-xs gap-1" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                  Next <ChevronRight size={12} />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && closeForm()}
        >
          <div className="bg-[var(--bg)] border border-[var(--border)] rounded-2xl w-full max-w-2xl shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[var(--border)]">
              <div>
                <h2 className="font-semibold text-base text-[var(--text-primary)]">
                  {editProject ? "Edit project" : "New project"}
                </h2>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  {editProject ? `Editing "${editProject.title}"` : "Fill in the details below"}
                </p>
              </div>
              <button onClick={closeForm} className="btn btn-ghost p-1.5 rounded-lg">
                <X size={16} />
              </button>
            </div>
            <div className="px-6 pt-4 pb-1">
              <ProjectForm
                initial={editProject ?? undefined}
                onAuthExpired={handleAuthExpired}
                onSave={() => { closeForm(); fetchProjects(); }}
                onCancel={closeForm}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const { authed, login, logout } = useAdminSession();

  if (authed === null) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <Loader2 size={20} className="animate-spin text-[var(--text-muted)]" />
      </div>
    );
  }

  return (
    <ThemeProvider>
      {authed ? <AdminInner logout={logout} /> : <AdminLogin onLogin={login} />}
    </ThemeProvider>
  );
}