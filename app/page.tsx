// app/page.tsx 
"use client";

import { useState } from "react";
import { useProjects, useProjectMeta } from "@/hooks/useProjects";
import { SearchBar } from "@/components/ui/SearchBar";
import { FilterPanel } from "@/components/project/FilterPanel";
import { ProjectGrid } from "@/components/project/ProjectGrid";
import { SortBar } from "@/components/project/SortBar";

export default function HomePage() {
  const meta = useProjectMeta();
  const [view, setView] = useState<"grid" | "list">("grid");

  const {
    projects,
    total,
    totalPages,
    loading,
    error,
    filters,
    updateFilters,
    resetFilters,
    toggleLanguage,
    toggleFramework,
    toggleTag,
    activeFilterCount,
  } = useProjects();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      {/* Hero header */}
      <div className="mb-8 lg:mb-10">
        <h1 className="section-heading mb-2">Project Showcase</h1>
        <p className="text-[var(--text-muted)] max-w-xl">
          Browse {meta?.total ? meta.total.toLocaleString() : "200+"} projects across{" "}
          {meta?.languages?.length || "many"} languages and{" "}
          {meta?.frameworks?.length || "dozens of"} frameworks.
        </p>

        {/* Search */}
        <div className="mt-4 max-w-xl">
          <SearchBar
            value={filters.query || ""}
            onChange={(q) => updateFilters({ query: q })}
          />
        </div>
      </div>

      <div className="flex gap-6 lg:gap-8">
        {/* Sidebar filters — desktop only */}
        <div className="hidden lg:block">
          <FilterPanel
            meta={meta}
            filters={filters}
            onToggleLanguage={toggleLanguage}
            onToggleFramework={toggleFramework}
            onToggleTag={toggleTag}
            onUpdateFilter={updateFilters}
            onReset={resetFilters}
            activeCount={activeFilterCount}
          />
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0 flex flex-col gap-4">
          {/* Mobile filter panel */}
          <div className="lg:hidden">
            <FilterPanel
              meta={meta}
              filters={filters}
              onToggleLanguage={toggleLanguage}
              onToggleFramework={toggleFramework}
              onToggleTag={toggleTag}
              onUpdateFilter={updateFilters}
              onReset={resetFilters}
              activeCount={activeFilterCount}
            />
          </div>

          {/* Sort + view toggle */}
          <SortBar
            total={total}
            loading={loading}
            filters={filters}
            onUpdateFilter={updateFilters}
            view={view}
            onViewChange={setView}
          />

          {/* Active filter chips */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {(filters.languages || []).map((l) => (
                <FilterChip key={`lang-${l}`} label={l} onRemove={() => toggleLanguage(l)} />
              ))}
              {(filters.frameworks || []).map((f) => (
                <FilterChip key={`fw-${f}`} label={f} onRemove={() => toggleFramework(f)} />
              ))}
              {(filters.tags || []).map((t) => (
                <FilterChip key={`tag-${t}`} label={`#${t}`} onRemove={() => toggleTag(t)} />
              ))}
              {filters.status && (
                <FilterChip label={filters.status} onRemove={() => updateFilters({ status: "" })} />
              )}
              {filters.featured && (
                <FilterChip label="Featured" onRemove={() => updateFilters({ featured: undefined })} />
              )}
            </div>
          )}

          {/* Project grid — view prop wired in */}
          <ProjectGrid
            projects={projects}
            loading={loading}
            error={error}
            total={total}
            page={filters.page || 1}
            totalPages={totalPages}
            onPageChange={(p) => updateFilters({ page: p })}
            view={view}
          />
        </div>
      </div>
    </div>
  );
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <button
      onClick={onRemove}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[var(--brand-50)] dark:bg-[var(--brand-900)]/30 text-[var(--brand-700)] dark:text-[var(--brand-300)] border border-[var(--brand-200)] dark:border-[var(--brand-800)] rounded-full text-xs font-medium hover:bg-[var(--brand-100)] transition-colors"
    >
      {label}
      <span aria-hidden className="text-[var(--brand-400)]">×</span>
    </button>
  );
}