// components/layout/Footer.tsx
import Link from "next/link";
import { Github, Twitter, Linkedin, Code2 } from "lucide-react";

const SOCIALS = [
  { href: "https://github.com", icon: Github, label: "GitHub" },
  { href: "https://twitter.com", icon: Twitter, label: "Twitter" },
  { href: "https://linkedin.com", icon: Linkedin, label: "LinkedIn" },
];

export function Footer() {
  return (
    <footer
      className="mt-16 border-t"
      style={{ borderColor: "var(--border)", background: "var(--bg-subtle)" }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <span
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white"
              style={{ background: "var(--brand-600)" }}
            >
              <Code2 size={14} />
            </span>
            <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              Portfolio
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-4 text-xs" style={{ color: "var(--text-muted)" }}>
            <Link href="/" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Projects</Link>
            <Link href="/about" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">About</Link>
            <Link href="/contact" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Contact</Link>
          </div>

          {/* Socials */}
          <div className="flex items-center gap-2">
            {SOCIALS.map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="p-2 rounded-lg transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
                style={{ color: "var(--text-muted)" }}
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <p className="mt-8 text-center text-xs" style={{ color: "var(--text-muted)" }}>
          © {new Date().getFullYear()} Portfolio. Built with Next.js & MongoDB.
        </p>
      </div>
    </footer>
  );
}