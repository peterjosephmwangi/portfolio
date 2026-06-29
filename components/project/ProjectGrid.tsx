// components/project/ProjectGrid.tsx
"use client";

import { ProjectCard, ProjectCardSkeleton, ProjectListCard, ProjectListCardSkeleton } from "./ProjectCard";
import { Project } from "@/types";
import { SearchX, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectGridProps {
  projects:     Project[];
  loading:      boolean;
  error:        string | null;
  total:        number;
  page:         number;
  totalPages:   number;
  onPageChange: (page: number) => void;
  view?:        "grid" | "list";
}

export function ProjectGrid({
  projects, loading, error, total, page, totalPages, onPageChange, view = "grid",
}: ProjectGridProps) {
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: "var(--bg-muted)" }}>
          <SearchX size={24} style={{ color: "var(--text-muted)" }} />
        </div>
        <div>
          <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>Something went wrong</p>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>{error}</p>
        </div>
        <button onClick={() => window.location.reload()} className="btn btn-secondary mt-1">Try again</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {view === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {loading
            ? Array.from({ length: 12 }).map((_, i) => <ProjectCardSkeleton key={i} />)
            : projects.map((p, i) => <ProjectCard key={p._id} project={p} priority={i < 3} />)
          }
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <ProjectListCardSkeleton key={i} />)
            : projects.map((p, i) => <ProjectListCard key={p._id} project={p} priority={i < 3} />)
          }
        </div>
      )}

      {!loading && !error && projects.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl" style={{ background: "var(--bg-muted)" }}>
            🔍
          </div>
          <div>
            <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>No projects found</p>
            <p className="text-sm mt-1 max-w-xs" style={{ color: "var(--text-muted)" }}>
              Try adjusting your search terms or clearing some filters.
            </p>
          </div>
        </div>
      )}

      {!loading && totalPages > 1 && (
        <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
      )}
    </div>
  );
}

function Pagination({ page, totalPages, onPageChange }: { page: number; totalPages: number; onPageChange: (p: number) => void }) {
  const pages = getPaginationRange(page, totalPages);
  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1 mt-2">
      <button onClick={() => onPageChange(page - 1)} disabled={page <= 1} className="btn btn-secondary p-2 disabled:opacity-40" aria-label="Previous page">
        <ChevronLeft size={15} />
      </button>
      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="w-9 text-center text-sm" style={{ color: "var(--text-muted)" }}>…</span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p as number)}
            aria-current={p === page ? "page" : undefined}
            className={cn("w-9 h-9 rounded-lg text-sm font-medium transition-all", p === page ? "text-white shadow-sm" : "btn btn-secondary")}
            style={p === page ? { background: "var(--brand-600)" } : undefined}
          >
            {p}
          </button>
        )
      )}
      <button onClick={() => onPageChange(page + 1)} disabled={page >= totalPages} className="btn btn-secondary p-2 disabled:opacity-40" aria-label="Next page">
        <ChevronRight size={15} />
      </button>
    </nav>
  );
}

function getPaginationRange(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "...")[] = [1];
  if (current > 3) pages.push("...");
  const start = Math.max(2, current - 1);
  const end   = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);
  if (current < total - 2) pages.push("...");
  pages.push(total);
  return pages;
}