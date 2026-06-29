// components/ui/SearchBar.tsx
"use client";

import { useState, useEffect, useRef } from "react";
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
  const [focused, setFocused] = useState(false);
  const debounced = useDebounce(localValue, 350);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    onChange(debounced);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  // Sync external reset
  useEffect(() => {
    if (value === "" && localValue !== "") setLocalValue("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const clear = () => {
    setLocalValue("");
    inputRef.current?.focus();
  };

  return (
    <div className={cn("relative group", className)}>
      {/* Search icon */}
      <div
        className={cn(
          "absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-150",
          focused
            ? "text-[var(--brand-500)]"
            : "text-[var(--text-muted)]"
        )}
      >
        <Search size={15} strokeWidth={2} />
      </div>

      <input
        ref={inputRef}
        type="search"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        aria-label="Search projects"
        className={cn(
          // Base
          "w-full bg-[var(--bg)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)]",
          // Sizing & spacing — left room for icon, right room for clear btn
          "h-10 pl-10 pr-10 rounded-xl",
          // Border & ring
          "border border-[var(--border)] outline-none",
          "transition-all duration-150",
          "focus:border-[var(--brand-500)] focus:ring-3 focus:ring-[var(--brand-400)]/15",
          // Type: suppress default browser clear button (we have our own)
          "[&::-webkit-search-cancel-button]:hidden",
          "text-sm"
        )}
      />

      {/* Clear button */}
      {localValue && (
        <button
          onClick={clear}
          aria-label="Clear search"
          className={cn(
            "absolute right-2.5 top-1/2 -translate-y-1/2",
            "flex items-center justify-center w-5 h-5 rounded-md",
            "text-[var(--text-muted)] hover:text-[var(--text-primary)]",
            "bg-transparent hover:bg-[var(--bg-muted)]",
            "transition-all duration-100"
          )}
        >
          <X size={12} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
}