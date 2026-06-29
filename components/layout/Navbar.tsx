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
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-[88px] h-8" />;

  const options = [
    { value: "light",  icon: <Sun size={13} />,     label: "Light" },
    { value: "dark",   icon: <Moon size={13} />,    label: "Dark" },
    { value: "system", icon: <Monitor size={13} />, label: "System" },
  ];

  return (
    <div className="flex items-center gap-0.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] p-0.5">
      {options.map(({ value, icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          aria-label={label}
          title={label}
          className={cn(
            "flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-150",
            theme === value
              ? "bg-white dark:bg-zinc-600 shadow-sm text-[var(--brand-600)] dark:text-[var(--brand-300)]"
              : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]"
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

  // Close menu on route change
  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-all duration-200",
        scrolled
          ? "border-b border-[var(--border)] shadow-[var(--shadow-sm)]"
          : "border-b border-transparent"
      )}
      style={{
        background: scrolled
          ? "color-mix(in srgb, var(--bg) 85%, transparent)"
          : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
      }}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-6">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 font-bold text-sm tracking-tight hover:opacity-80 transition-opacity flex-shrink-0"
        >
          <span className="w-7 h-7 rounded-lg flex items-center justify-center text-white bg-[var(--brand-600)] shadow-sm shadow-indigo-500/30">
            <Code2 size={14} />
          </span>
          <span className="text-[var(--text-primary)]">Portfolio</span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden sm:flex items-center gap-0.5 flex-1">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors duration-150",
                pathname === href
                  ? "text-[var(--brand-600)] dark:text-[var(--brand-400)] bg-[var(--brand-50)] dark:bg-[var(--brand-900)]/30"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)]"
              )}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2.5">
          <ThemeToggle />

          {/* Mobile menu toggle */}
          <button
            className={cn(
              "sm:hidden flex items-center justify-center w-8 h-8 rounded-lg border border-[var(--border)] bg-[var(--bg-muted)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            )}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="sm:hidden border-t border-[var(--border)] bg-[var(--bg)] animate-slide-up">
          <div className="px-3 py-2 flex flex-col gap-0.5">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  "block py-2.5 px-3.5 rounded-lg text-sm font-medium transition-colors",
                  pathname === href
                    ? "text-[var(--brand-600)] dark:text-[var(--brand-400)] bg-[var(--brand-50)] dark:bg-[var(--brand-900)]/30"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)]"
                )}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}