// components/project/SortBar.tsx
"use client";

import { LayoutGrid, List } from "lucide-react";
import { SearchFilters } from "@/types";
import { cn } from "@/lib/utils";

interface SortBarProps {
  total: number;
  loading: boolean;
  filters: SearchFilters;
  onUpdateFilter: (updates: Partial<SearchFilters>) => void;
  view: "grid" | "list";
  onViewChange: (v: "grid" | "list") => void;
}

const SORT_OPTIONS = [
  { value: "newest",   label: "Newest" },
  { value: "oldest",   label: "Oldest" },
  { value: "featured", label: "Featured first" },
  { value: "title",    label: "A–Z" },
];

export function SortBar({
  total,
  loading,
  filters,
  onUpdateFilter,
  view,
  onViewChange,
}: SortBarProps) {
  return (
    <div className="flex items-center justify-between gap-3 flex-wrap">
      {/* Count */}
      <p className="text-sm text-[var(--text-muted)]">
        {loading ? (
          <span className="skeleton inline-block h-4 w-24 rounded" />
        ) : (
          <>
            <span className="font-semibold text-[var(--text-primary)]">
              {total.toLocaleString()}
            </span>{" "}
            {total === 1 ? "project" : "projects"}
          </>
        )}
      </p>

      <div className="flex items-center gap-2">
        {/* Sort select */}
        <select
          value={filters.sort || "newest"}
          onChange={(e) =>
            onUpdateFilter({ sort: e.target.value as SearchFilters["sort"] })
          }
          className="input w-auto text-sm py-1.5 cursor-pointer"
          aria-label="Sort projects"
        >
          {SORT_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>

        {/* View toggle — mirrors ThemeToggle pill style */}
        <div className="flex items-center gap-0.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] p-0.5">
          {(["grid", "list"] as const).map((v) => (
            <button
              key={v}
              onClick={() => onViewChange(v)}
              aria-label={v === "grid" ? "Grid view" : "List view"}
              className={cn(
                "flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-150",
                view === v
                  ? "bg-white dark:bg-zinc-600 shadow-sm text-[var(--brand-600)] dark:text-[var(--brand-300)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]"
              )}
            >
              {v === "grid" ? <LayoutGrid size={14} /> : <List size={14} />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}