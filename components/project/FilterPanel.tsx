// components/project/FilterPanel.tsx
"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, X, SlidersHorizontal } from "lucide-react";
import { SearchFilters } from "@/types";
import { cn } from "@/lib/utils";

interface FilterPanelProps {
  meta: {
    languages:  { name: string; count: number }[];
    frameworks: { name: string; count: number }[];
    tags:       { name: string; count: number }[];
  } | null;
  filters: SearchFilters;
  onToggleLanguage:  (l: string) => void;
  onToggleFramework: (f: string) => void;
  onToggleTag:       (t: string) => void;
  onUpdateFilter:    (updates: Partial<SearchFilters>) => void;
  onReset:           () => void;
  activeCount:       number;
}

function Section({
  title,
  items,
  selected,
  onToggle,
  defaultShow = 8,
}: {
  title: string;
  items: { name: string; count: number }[];
  selected: string[];
  onToggle: (name: string) => void;
  defaultShow?: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? items : items.slice(0, defaultShow);
  if (!items.length) return null;

  return (
    <div>
      <h3
        className="text-[10px] font-semibold uppercase tracking-widest mb-2"
        style={{ color: "var(--text-muted)" }}
      >
        {title}
      </h3>
      <div className="flex flex-wrap gap-1.5">
        {visible.map(({ name, count }) => {
          const active = selected.includes(name);
          return (
            <button
              key={name}
              onClick={() => onToggle(name)}
              className={cn(
                "inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border transition-all duration-150",
                active
                  ? "text-white border-transparent shadow-sm"
                  : "border hover:border-brand-400 dark:hover:border-brand-600 transition-colors"
              )}
              style={
                active
                  ? { background: "var(--brand-600)" }
                  : {
                      background: "var(--bg)",
                      borderColor: "var(--border)",
                      color: "var(--text-secondary)",
                    }
              }
            >
              {name}
              <span
                className="text-[10px]"
                style={{ color: active ? "rgba(255,255,255,0.65)" : "var(--text-muted)" }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
      {items.length > defaultShow && (
        <button
          onClick={() => setExpanded((e) => !e)}
          className="mt-2 text-xs flex items-center gap-1 transition-colors"
          style={{ color: "var(--text-muted)" }}
        >
          {expanded ? (
            <><ChevronUp size={11} /> Show less</>
          ) : (
            <><ChevronDown size={11} /> +{items.length - defaultShow} more</>
          )}
        </button>
      )}
    </div>
  );
}

const STATUS_OPTIONS = [
  { value: "",            label: "All" },
  { value: "completed",   label: "Completed" },
  { value: "in-progress", label: "In Progress" },
  { value: "archived",    label: "Archived" },
];

export function FilterPanel({
  meta,
  filters,
  onToggleLanguage,
  onToggleFramework,
  onToggleTag,
  onUpdateFilter,
  onReset,
  activeCount,
}: FilterPanelProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const content = (
    <div className="flex flex-col gap-5">
      {/* Status */}
      <div>
        <h3
          className="text-[10px] font-semibold uppercase tracking-widest mb-2"
          style={{ color: "var(--text-muted)" }}
        >
          Status
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {STATUS_OPTIONS.map(({ value, label }) => {
            const active = filters.status === value;
            return (
              <button
                key={value}
                onClick={() => onUpdateFilter({ status: value })}
                className="px-2.5 py-1 rounded-md text-xs font-medium border transition-all duration-150"
                style={
                  active
                    ? { background: "var(--brand-600)", color: "#fff", borderColor: "var(--brand-600)" }
                    : { background: "var(--bg)", color: "var(--text-secondary)", borderColor: "var(--border)" }
                }
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Featured toggle */}
      <div>
        <label className="flex items-center gap-2.5 cursor-pointer group select-none">
          <button
            role="switch"
            aria-checked={!!filters.featured}
            onClick={() => onUpdateFilter({ featured: filters.featured ? undefined : true })}
            className="relative w-9 h-5 rounded-full transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-brand-500"
            style={{
              background: filters.featured ? "var(--brand-600)" : "var(--bg-muted)",
              border: "1px solid var(--border)",
            }}
          >
            <span
              className="absolute top-0.5 left-0.5 w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-transform duration-200"
              style={{ transform: filters.featured ? "translateX(16px)" : "none" }}
            />
          </button>
          <span className="text-sm transition-colors" style={{ color: "var(--text-secondary)" }}>
            Featured only
          </span>
        </label>
      </div>

      <Section
        title="Language"
        items={meta?.languages || []}
        selected={filters.languages || []}
        onToggle={onToggleLanguage}
      />
      <Section
        title="Framework / Library"
        items={meta?.frameworks || []}
        selected={filters.frameworks || []}
        onToggle={onToggleFramework}
      />
      <Section
        title="Tags"
        items={meta?.tags || []}
        selected={filters.tags || []}
        onToggle={onToggleTag}
        defaultShow={12}
      />
    </div>
  );

  return (
    <>
      {/* Mobile */}
      <div className="lg:hidden">
        <button
          onClick={() => setMobileOpen((o) => !o)}
          className="btn btn-secondary w-full justify-between"
          style={
            activeCount > 0
              ? { borderColor: "var(--brand-500)", color: "var(--brand-600)" }
              : undefined
          }
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal size={14} />
            Filters
            {activeCount > 0 && (
              <span
                className="text-[11px] rounded-full w-5 h-5 flex items-center justify-center font-medium text-white"
                style={{ background: "var(--brand-600)" }}
              >
                {activeCount}
              </span>
            )}
          </span>
          <ChevronDown
            size={14}
            className={cn("transition-transform duration-200", mobileOpen && "rotate-180")}
          />
        </button>

        {mobileOpen && (
          <div className="mt-2 p-4 card animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                Filters
              </span>
              {activeCount > 0 && (
                <button
                  onClick={onReset}
                  className="text-xs flex items-center gap-1 text-red-500 hover:text-red-600 transition-colors"
                >
                  <X size={11} /> Clear all
                </button>
              )}
            </div>
            {content}
          </div>
        )}
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-56 flex-shrink-0">
        <div className="sticky top-20 card p-4">
          <div className="flex items-center justify-between mb-5">
            <span
              className="font-semibold text-sm flex items-center gap-2"
              style={{ color: "var(--text-primary)" }}
            >
              <SlidersHorizontal size={14} style={{ color: "var(--brand-600)" }} />
              Filters
              {activeCount > 0 && (
                <span
                  className="text-[11px] rounded-full w-5 h-5 flex items-center justify-center font-medium text-white"
                  style={{ background: "var(--brand-600)" }}
                >
                  {activeCount}
                </span>
              )}
            </span>
            {activeCount > 0 && (
              <button
                onClick={onReset}
                className="text-xs flex items-center gap-1 text-red-500 hover:text-red-600 transition-colors"
              >
                <X size={11} /> Clear
              </button>
            )}
          </div>
          {content}
        </div>
      </aside>
    </>
  );
}