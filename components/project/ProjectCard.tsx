// components/project/ProjectCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Github, Star, Eye } from "lucide-react";
import { Project } from "@/types";
import { TechBadge } from "@/components/ui/TechBadge";
import { cn, truncate } from "@/lib/utils";

interface ProjectCardProps {
  project:  Project;
  priority?: boolean;
}

const statusMeta: Record<string, { label: string; style: React.CSSProperties }> = {
  completed:    { label: "Completed",   style: { background: "var(--green-bg)", color: "var(--green-text)" } },
  "in-progress":{ label: "In Progress", style: { background: "var(--amber-bg)", color: "var(--amber-text)" } },
  archived:     { label: "Archived",    style: { background: "var(--zinc-bg)",  color: "var(--zinc-text)"  } },
};

// ─── Grid card (unchanged) ────────────────────────────────────────────────────
export function ProjectCard({ project, priority = false }: ProjectCardProps) {
  const displayStack = project.stack.slice(0, 4);
  const remaining = project.stack.length - displayStack.length;
  const status = statusMeta[project.status] ?? statusMeta.archived;

  return (
    <article className="card group flex flex-col overflow-hidden animate-fade-in" style={{ background: "var(--bg)" }}>
      {/* Thumbnail */}
      <Link
        href={`/projects/${project.slug || project._id}`}
        className="block relative aspect-video overflow-hidden flex-shrink-0"
        style={{ background: "var(--bg-muted)" }}
        tabIndex={-1}
        aria-hidden="true"
      >
        {project.thumbnailUrl ? (
          <Image
            src={project.thumbnailUrl}
            alt={project.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-[1.04] transition-transform duration-500"
            priority={priority}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center select-none">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold"
              style={{ background: "color-mix(in srgb, var(--brand-600) 12%, var(--bg-muted))", color: "var(--brand-600)" }}
            >
              {project.title.charAt(0).toUpperCase()}
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          {project.featured && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold text-white shadow-sm" style={{ background: "var(--brand-600)" }}>
              <Star size={9} className="fill-current" /> Featured
            </span>
          )}
          <span className="px-2 py-0.5 rounded-md text-[11px] font-medium" style={status.style}>{status.label}</span>
        </div>
      </Link>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        <div className="flex-1">
          <Link
            href={`/projects/${project.slug || project._id}`}
            className="block font-semibold text-sm leading-snug line-clamp-1 transition-colors"
            style={{ color: "var(--text-primary)" }}
          >
            <span className="hover:text-brand-600 dark:hover:text-brand-400">{project.title}</span>
          </Link>
          <p className="mt-1 text-xs leading-relaxed line-clamp-2" style={{ color: "var(--text-secondary)" }}>
            {truncate(project.description, 120)}
          </p>
        </div>
        {displayStack.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {displayStack.map((tech) => <TechBadge key={tech.name} tech={tech} size="sm" />)}
            {remaining > 0 && <span className="badge badge-other text-[10px]">+{remaining}</span>}
          </div>
        )}
        <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: "var(--border-muted)" }}>
          <div className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
            <Eye size={11} />
            <span>{(project.viewCount || 0).toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1.5">
            {project.repoUrl && (
              <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="btn btn-ghost p-1.5" title="Source code">
                <Github size={14} />
              </a>
            )}
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="btn btn-ghost p-1.5" title="Live demo">
                <ExternalLink size={14} />
              </a>
            )}
            <Link href={`/projects/${project.slug || project._id}`} className="btn btn-primary py-1 px-3 text-xs">
              Details
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

// ─── List card ────────────────────────────────────────────────────────────────
export function ProjectListCard({ project, priority = false }: ProjectCardProps) {
  const displayStack = project.stack.slice(0, 5);
  const remaining = project.stack.length - displayStack.length;
  const status = statusMeta[project.status] ?? statusMeta.archived;

  return (
    <article className="card group flex flex-row overflow-hidden animate-fade-in" style={{ background: "var(--bg)" }}>
      {/* Thumbnail */}
      <Link
        href={`/projects/${project.slug || project._id}`}
        className="relative w-36 sm:w-48 flex-shrink-0 overflow-hidden"
        style={{ background: "var(--bg-muted)" }}
        tabIndex={-1}
        aria-hidden="true"
      >
        {project.thumbnailUrl ? (
          <Image
            src={project.thumbnailUrl}
            alt={project.title}
            fill
            sizes="(max-width: 640px) 144px, 192px"
            className="object-cover group-hover:scale-[1.04] transition-transform duration-500"
            priority={priority}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold"
              style={{ background: "color-mix(in srgb, var(--brand-600) 12%, var(--bg-muted))", color: "var(--brand-600)" }}
            >
              {project.title.charAt(0).toUpperCase()}
            </div>
          </div>
        )}
      </Link>

      {/* Body */}
      <div className="flex flex-col flex-1 min-w-0 p-4 gap-2">
        {/* Title row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            {project.featured && (
              <Star size={12} className="fill-amber-400 text-amber-400 flex-shrink-0" />
            )}
            <Link
              href={`/projects/${project.slug || project._id}`}
              className="font-semibold text-sm truncate transition-colors hover:text-brand-600 dark:hover:text-brand-400"
              style={{ color: "var(--text-primary)" }}
            >
              {project.title}
            </Link>
            <span className="hidden sm:inline-flex px-2 py-0.5 rounded-md text-[11px] font-medium flex-shrink-0" style={status.style}>
              {status.label}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {project.repoUrl && (
              <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost p-1.5" title="Source code">
                <Github size={13} />
              </a>
            )}
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost p-1.5" title="Live demo">
                <ExternalLink size={13} />
              </a>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-xs leading-relaxed line-clamp-2" style={{ color: "var(--text-secondary)" }}>
          {truncate(project.description, 160)}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 mt-auto pt-1">
          {displayStack.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {displayStack.map((tech) => <TechBadge key={tech.name} tech={tech} size="sm" />)}
              {remaining > 0 && <span className="badge badge-other text-[10px]">+{remaining}</span>}
            </div>
          )}
          <div className="flex items-center gap-3 ml-auto flex-shrink-0">
            <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
              <Eye size={11} />{(project.viewCount || 0).toLocaleString()}
            </span>
            <Link href={`/projects/${project.slug || project._id}`} className="btn btn-primary py-1 px-3 text-xs">
              Details
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

// ─── Skeletons ────────────────────────────────────────────────────────────────
export function ProjectCardSkeleton() {
  return (
    <div className="card overflow-hidden" style={{ background: "var(--bg)" }}>
      <div className="skeleton aspect-video w-full rounded-none" />
      <div className="p-4 flex flex-col gap-3">
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-3 w-full rounded" />
        <div className="skeleton h-3 w-2/3 rounded" />
        <div className="flex gap-1.5 mt-1">
          <div className="skeleton h-4 w-14 rounded-full" />
          <div className="skeleton h-4 w-16 rounded-full" />
          <div className="skeleton h-4 w-12 rounded-full" />
        </div>
        <div className="flex justify-between items-center pt-3 border-t" style={{ borderColor: "var(--border-muted)" }}>
          <div className="skeleton h-3 w-8 rounded" />
          <div className="skeleton h-7 w-20 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function ProjectListCardSkeleton() {
  return (
    <div className="card overflow-hidden flex flex-row" style={{ background: "var(--bg)" }}>
      <div className="skeleton w-36 sm:w-48 flex-shrink-0" style={{ minHeight: "100px" }} />
      <div className="flex flex-col flex-1 p-4 gap-3">
        <div className="flex items-center justify-between">
          <div className="skeleton h-4 w-48 rounded" />
          <div className="skeleton h-4 w-16 rounded-full" />
        </div>
        <div className="skeleton h-3 w-full rounded" />
        <div className="skeleton h-3 w-4/5 rounded" />
        <div className="flex gap-1.5 mt-auto">
          <div className="skeleton h-4 w-14 rounded-full" />
          <div className="skeleton h-4 w-16 rounded-full" />
          <div className="skeleton h-4 w-12 rounded-full" />
        </div>
      </div>
    </div>
  );
}