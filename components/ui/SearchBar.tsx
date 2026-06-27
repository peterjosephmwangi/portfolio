// components/ui/SearchBar.tsx
"use client";

import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search projects, technologies, tags…",
  className,
}: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value);
  const debounced = useDebounce(localValue, 350);

  useEffect(() => {
    onChange(debounced);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  // Sync external reset
  useEffect(() => {
    if (value === "" && localValue !== "") setLocalValue("");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className={cn("relative", className)}>
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 pointer-events-none"
      />
      <input
        type="search"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className={cn("input pl-9", localValue && "pr-8")}
        aria-label="Search projects"
      />
      {localValue && (
        <button
          onClick={() => setLocalValue("")}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors rounded"
          aria-label="Clear search"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
