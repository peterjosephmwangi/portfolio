// hooks/useProjects.ts
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Project, ProjectsResponse, SearchFilters } from "@/types";
import { buildQueryString } from "@/lib/utils";

const DEFAULT_FILTERS: SearchFilters = {
  query: "",
  languages: [],
  frameworks: [],
  tags: [],
  status: "",
  featured: undefined,
  page: 1,
  limit: 12,
  sort: "newest",
};

export function useProjects(initialFilters: Partial<SearchFilters> = {}) {
  const [filters, setFilters] = useState<SearchFilters>({
    ...DEFAULT_FILTERS,
    ...initialFilters,
  });
  const [data, setData] = useState<ProjectsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetchProjects = useCallback(async (f: SearchFilters) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const qs = buildQueryString({
        q: f.query,
        language: f.languages,
        framework: f.frameworks,
        tag: f.tags,
        status: f.status,
        featured: f.featured,
        sort: f.sort,
        page: f.page,
        limit: f.limit,
      });

      const res = await fetch(`/api/projects?${qs}`, {
        signal: controller.signal,
      });

      if (!res.ok) throw new Error("Failed to fetch projects");
      const json: ProjectsResponse = await res.json();
      setData(json);
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setError("Failed to load projects. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects(filters);
  }, [filters, fetchProjects]);

  const updateFilters = useCallback((updates: Partial<SearchFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...updates,
      page: updates.page ?? 1, // reset to page 1 on filter change
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const toggleLanguage = useCallback((lang: string) => {
    setFilters((prev) => {
      const langs = prev.languages || [];
      return {
        ...prev,
        languages: langs.includes(lang)
          ? langs.filter((l) => l !== lang)
          : [...langs, lang],
        page: 1,
      };
    });
  }, []);

  const toggleFramework = useCallback((fw: string) => {
    setFilters((prev) => {
      const fws = prev.frameworks || [];
      return {
        ...prev,
        frameworks: fws.includes(fw) ? fws.filter((f) => f !== fw) : [...fws, fw],
        page: 1,
      };
    });
  }, []);

  const toggleTag = useCallback((tag: string) => {
    setFilters((prev) => {
      const tags = prev.tags || [];
      return {
        ...prev,
        tags: tags.includes(tag) ? tags.filter((t) => t !== tag) : [...tags, tag],
        page: 1,
      };
    });
  }, []);

  const activeFilterCount =
    (filters.languages?.length || 0) +
    (filters.frameworks?.length || 0) +
    (filters.tags?.length || 0) +
    (filters.status ? 1 : 0) +
    (filters.featured ? 1 : 0);

  return {
    projects: data?.projects || [],
    total: data?.total || 0,
    totalPages: data?.totalPages || 0,
    hasMore: data?.hasMore || false,
    loading,
    error,
    filters,
    updateFilters,
    resetFilters,
    toggleLanguage,
    toggleFramework,
    toggleTag,
    activeFilterCount,
  };
}

// Hook for fetching filter metadata
export function useProjectMeta() {
  const [meta, setMeta] = useState<{
    languages: { name: string; count: number }[];
    frameworks: { name: string; count: number }[];
    tags: { name: string; count: number }[];
    total: number;
  } | null>(null);

  useEffect(() => {
    fetch("/api/projects/meta")
      .then((r) => r.json())
      .then(setMeta)
      .catch(console.error);
  }, []);

  return meta;
}
