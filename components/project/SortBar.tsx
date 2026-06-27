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
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "featured", label: "Featured first" },
  { value: "title", label: "A–Z" },
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
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        {loading ? (
          <span className="skeleton inline-block h-4 w-24 rounded" />
        ) : (
          <>
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
              {total.toLocaleString()}
            </span>{" "}
            {total === 1 ? "project" : "projects"}
          </>
        )}
      </p>

      <div className="flex items-center gap-2">
        {/* Sort */}
        <select
          value={filters.sort || "newest"}
          onChange={(e) =>
            onUpdateFilter({ sort: e.target.value as SearchFilters["sort"] })
          }
          className="input w-auto text-sm py-1.5 cursor-pointer"
          aria-label="Sort projects"
        >
          {SORT_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        {/* View toggle */}
        <div className="flex items-center border border-zinc-200 dark:border-zinc-700 rounded-lg overflow-hidden">
          <button
            onClick={() => onViewChange("grid")}
            className={cn(
              "p-2 transition-colors",
              view === "grid"
                ? "bg-brand-600 text-white"
                : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            )}
            aria-label="Grid view"
          >
            <LayoutGrid size={15} />
          </button>
          <button
            onClick={() => onViewChange("list")}
            className={cn(
              "p-2 transition-colors",
              view === "list"
                ? "bg-brand-600 text-white"
                : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            )}
            aria-label="List view"
          >
            <List size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
