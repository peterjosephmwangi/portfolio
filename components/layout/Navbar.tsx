// components/layout/Navbar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor, Code2, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-8 h-8" />;

  const options: { value: string; icon: React.ReactNode; label: string }[] = [
    { value: "light", icon: <Sun size={14} />, label: "Light" },
    { value: "dark",  icon: <Moon size={14} />, label: "Dark" },
    { value: "system", icon: <Monitor size={14} />, label: "System" },
  ];

  return (
    <div
      className="flex items-center rounded-lg border p-0.5 gap-0.5"
      style={{ borderColor: "var(--border)", background: "var(--bg-subtle)" }}
    >
      {options.map(({ value, icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          aria-label={`Set ${label} theme`}
          title={label}
          className={cn(
            "p-1.5 rounded-md transition-all duration-150",
            theme === value
              ? "bg-white dark:bg-zinc-700 shadow-sm text-brand-600 dark:text-brand-400"
              : "text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
          )}
        >
          {icon}
        </button>
      ))}
    </div>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-all duration-200",
        scrolled
          ? "backdrop-blur-md border-b shadow-sm"
          : "border-b border-transparent"
      )}
      style={
        scrolled
          ? {
              background: "color-mix(in srgb, var(--bg) 90%, transparent)",
              borderColor: "var(--border)",
            }
          : undefined
      }
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-sm tracking-tight hover:opacity-80 transition-opacity"
        >
          <span
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white"
            style={{ background: "var(--brand-600)" }}
          >
            <Code2 size={14} />
          </span>
          <span style={{ color: "var(--text-primary)" }}>Portfolio</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-1">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                pathname === href
                  ? "text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/50"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              )}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          {/* Mobile menu toggle */}
          <button
            className="sm:hidden btn btn-ghost p-1.5"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div
          className="sm:hidden border-t py-2 px-4 animate-slide-up"
          style={{ borderColor: "var(--border)", background: "var(--bg)" }}
        >
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={cn(
                "block py-2.5 px-3 rounded-lg text-sm font-medium transition-colors",
                pathname === href
                  ? "text-brand-600 dark:text-brand-400"
                  : "text-zinc-600 dark:text-zinc-400"
              )}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}