import { Metadata } from "next";
import Link from "next/link";
import {
  Github,
  Mail,
  Globe,
  ArrowRight,
  Briefcase,
  GraduationCap,
  Code2,
  Layers,
  Server,
  Smartphone,
  Wrench,
  Users,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About — Peter Joseph Mwangi",
  description:
    "Full-Stack Developer with 6+ years building high-performance web applications. React, Next.js, Node.js — Nairobi, Kenya.",
};

// ─── Data ──────────────────────────────────────────────────────────────────

const socialLinks = [
  {
    href: "https://github.com/peterjosephmwangi",
    label: "GitHub",
    icon: Github,
  },
  {
    href: "https://peterjosep.netlify.app",
    label: "Portfolio",
    icon: Globe,
  },
  {
    href: "mailto:ampeterjosep@gmail.com",
    label: "Email",
    icon: Mail,
  },
];

const stats = [
  { value: "6+", label: "Years experience" },
  { value: "40%", label: "Faster response times" },
  { value: "10+", label: "Production apps shipped" },
  { value: "20+", label: "Students mentored / cohort" },
];

const skills = [
  {
    category: "Frontend",
    icon: Layers,
    color: "skill-frontend",
    items: ["React.js", "Next.js", "TypeScript", "JavaScript (ES6+)", "Tailwind CSS", "Redux", "HTML5 / CSS3"],
  },
  {
    category: "Backend",
    icon: Server,
    color: "skill-backend",
    items: ["Node.js", "Express.js", "RESTful APIs", "MongoDB", "Mongoose", "Python", "Flask"],
  },
  {
    category: "Mobile",
    icon: Smartphone,
    color: "skill-mobile",
    items: ["Android (Java)", "Kotlin basics"],
  },
  {
    category: "DevOps & Tools",
    icon: Wrench,
    color: "skill-devops",
    items: ["Git / GitHub", "CI/CD Pipelines", "Docker", "Jest", "Agile / Scrum"],
  },
  {
    category: "Soft Skills",
    icon: Users,
    color: "skill-soft",
    items: ["Technical Training", "Mentorship", "Code Review", "Technical Documentation", "Cross-functional Collaboration"],
  },
];

const experience = [
  {
    role: "Web Developer Trainer",
    company: "Modcom Institute of Technology",
    location: "Nairobi, KE",
    period: "Dec 2023 – Present",
    highlights: [
      "Design and deliver full-stack curricula (React, Node, MongoDB, Flask) to cohorts of 20+ students with 90%+ completion rates.",
      "Lead R&D into emerging technologies and security practices, integrating findings into live training modules.",
      "Mentor trainees through capstone projects from concept to deployment.",
    ],
  },
  {
    role: "Front-End Developer",
    company: "Naukri Info Edge",
    location: "Remote",
    period: "Feb 2023 – Dec 2023",
    highlights: [
      "Refactored React codebase with code splitting, lazy loading, and memoization — 40% faster response time.",
      "Implemented secure-coding standards (XSS hardening, CSP) — reducing vulnerability exposure by 15%.",
      "Improved UI-to-API delivery efficiency by 15% through tight backend and QA collaboration.",
    ],
  },
  {
    role: "Front-End Developer",
    company: "Maad Africa Inc",
    location: "Nairobi, KE",
    period: "Dec 2020 – Nov 2022",
    highlights: [
      "Built 10+ responsive React / Redux apps for a pan-African wholesale marketplace serving thousands of traders.",
      "Designed a shared component library across a 5-engineer team — cut feature build time by ~30%.",
      "Drove SPA architecture and cross-browser test suites that reduced regression bugs by 20%.",
    ],
  },
  {
    role: "Junior Node.js Developer",
    company: "WiSolar Clean Energy",
    location: "Cape Town, ZA (Remote)",
    period: "Nov 2019 – Aug 2020",
    highlights: [
      "Optimised MongoDB queries on a high-volume application — 23% reduction in average response time.",
      "Designed CI/CD pipelines, cutting deployment time by 5% and eliminating manual release bottlenecks.",
      "Delivered 4 interactive apps with React and RESTful APIs; agile workflow drove 18% productivity gain.",
    ],
  },
];

// ─── Component ─────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <>
      {/* ── Scoped styles ── */}
      <style>{`
        /* Hero gradient strip */
        .about-hero-accent {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 80% 60% at 50% -10%,
            color-mix(in srgb, var(--brand-500) 12%, transparent),
            transparent 70%);
          pointer-events: none;
        }

        /* Avatar ring */
        .avatar-ring {
          width: 72px;
          height: 72px;
          border-radius: 9999px;
          background: linear-gradient(135deg, var(--brand-500), var(--brand-700));
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.75rem;
          font-weight: 700;
          color: #fff;
          flex-shrink: 0;
          letter-spacing: -0.02em;
        }

        /* Stat card */
        .stat-card {
          background: var(--bg-subtle);
          border: 1px solid var(--border-muted);
          border-radius: var(--radius-md);
          padding: 16px 20px;
          text-align: center;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .stat-card:hover {
          border-color: color-mix(in srgb, var(--brand-400) 50%, var(--border));
          box-shadow: var(--shadow-md);
        }
        .stat-value {
          font-size: 1.875rem;
          font-weight: 800;
          letter-spacing: -0.04em;
          color: var(--brand-600);
          line-height: 1;
        }
        .dark .stat-value { color: var(--brand-400); }
        .stat-label {
          font-size: 0.6875rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-top: 4px;
        }

        /* Skill section pills */
        .skill-icon-wrap {
          width: 34px;
          height: 34px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .skill-frontend  .skill-icon-wrap { background: #ede9fe; color: #6d28d9; }
        .skill-backend   .skill-icon-wrap { background: #dbeafe; color: #1d4ed8; }
        .skill-mobile    .skill-icon-wrap { background: #dcfce7; color: #15803d; }
        .skill-devops    .skill-icon-wrap { background: #fef3c7; color: #b45309; }
        .skill-soft      .skill-icon-wrap { background: #fce7f3; color: #be185d; }
        .dark .skill-frontend  .skill-icon-wrap { background: #2e1065; color: #c4b5fd; }
        .dark .skill-backend   .skill-icon-wrap { background: #1e3a5f; color: #93c5fd; }
        .dark .skill-mobile    .skill-icon-wrap { background: #052e16; color: #86efac; }
        .dark .skill-devops    .skill-icon-wrap { background: #451a03; color: #fcd34d; }
        .dark .skill-soft      .skill-icon-wrap { background: #500724; color: #f9a8d4; }

        .skill-pill {
          display: inline-flex;
          align-items: center;
          padding: 3px 10px;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 500;
          background: var(--bg-muted);
          color: var(--text-secondary);
          border: 1px solid var(--border-muted);
          transition: background 0.12s, color 0.12s;
        }
        .skill-pill:hover {
          background: var(--bg-subtle);
          color: var(--text-primary);
        }

        /* Timeline */
        .timeline-item {
          position: relative;
          padding-left: 28px;
        }
        .timeline-item::before {
          content: '';
          position: absolute;
          left: 7px;
          top: 8px;
          bottom: -24px;
          width: 1px;
          background: var(--border);
        }
        .timeline-item:last-child::before { display: none; }
        .timeline-dot {
          position: absolute;
          left: 0;
          top: 6px;
          width: 15px;
          height: 15px;
          border-radius: 9999px;
          background: var(--bg);
          border: 2px solid var(--brand-500);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .timeline-dot-inner {
          width: 5px;
          height: 5px;
          border-radius: 9999px;
          background: var(--brand-500);
        }

        /* Section divider */
        .section-divider {
          height: 1px;
          background: linear-gradient(to right,
            transparent,
            var(--border) 20%,
            var(--border) 80%,
            transparent);
          margin: 48px 0;
        }

        /* CTA card */
        .cta-card {
          background: linear-gradient(135deg,
            color-mix(in srgb, var(--brand-600) 8%, var(--bg-subtle)),
            var(--bg-subtle)
          );
          border: 1px solid color-mix(in srgb, var(--brand-400) 30%, var(--border));
          border-radius: var(--radius-xl);
          padding: 32px;
        }

        /* Social button override */
        .social-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border);
          background: var(--bg);
          color: var(--text-secondary);
          font-size: 0.8125rem;
          font-weight: 500;
          text-decoration: none;
          transition: background 0.12s, color 0.12s, border-color 0.12s, box-shadow 0.12s, transform 0.1s;
          cursor: pointer;
        }
        .social-btn:hover {
          background: var(--bg-subtle);
          color: var(--text-primary);
          border-color: color-mix(in srgb, var(--brand-400) 50%, var(--border));
          box-shadow: var(--shadow-sm);
        }
        .social-btn:active { transform: scale(0.97); }
      `}</style>

      <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 lg:py-20">

        {/* ── Hero ── */}
        <section className="relative mb-10">
          <div className="about-hero-accent" aria-hidden />
          <div className="flex items-start gap-5 mb-6">
            <div className="avatar-ring" aria-label="Peter's initials">PJ</div>
            <div>
              <p
                className="text-xs font-semibold tracking-widest uppercase mb-1"
                style={{ color: "var(--brand-600)" }}
              >
                Full-Stack Developer
              </p>
              <h1 className="section-heading">Peter Joseph Mwangi</h1>
              <p
                className="text-sm mt-1"
                style={{ color: "var(--text-muted)" }}
              >
                Nairobi, Kenya &nbsp;·&nbsp; React · Next.js · Node.js
              </p>
            </div>
          </div>

          <p
            className="text-lg leading-relaxed mb-3"
            style={{ color: "var(--text-secondary)" }}
          >
            I build high-performance web applications that solve real problems. Over six years I've shipped production systems for marketplaces, clean-energy platforms, and recruitment tools — and spent the last year passing that knowledge on to the next wave of developers as a full-stack trainer.
          </p>
          <p
            className="leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            I care about code that is fast, accessible, and maintainable. When something can be 40% quicker or 30% easier to build for the next engineer, I want to find that path.
          </p>
        </section>

        {/* ── Stats ── */}
        <div
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8"
          role="list"
          aria-label="Key metrics"
        >
          {stats.map((s) => (
            <div key={s.label} className="stat-card" role="listitem">
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Social links ── */}
        <div className="flex items-center gap-2 flex-wrap mb-4">
          {socialLinks.map(({ href, label, icon: Icon }) => (
            <a
              key={href}
              href={href}
              className="social-btn"
              target={href.startsWith("mailto") ? undefined : "_blank"}
              rel="noopener noreferrer"
            >
              <Icon size={14} aria-hidden />
              {label}
            </a>
          ))}
        </div>

        <div className="section-divider" aria-hidden />

        {/* ── Skills ── */}
        <section aria-labelledby="skills-heading">
          <div className="flex items-center gap-2 mb-5">
            <Code2 size={16} style={{ color: "var(--text-muted)" }} aria-hidden />
            <h2
              id="skills-heading"
              className="text-sm font-semibold tracking-widest uppercase"
              style={{ color: "var(--text-muted)" }}
            >
              Technical Skills
            </h2>
          </div>
          <div className="space-y-4">
            {skills.map((group) => (
              <div
                key={group.category}
                className={`card p-4 flex gap-4 items-start ${group.color}`}
              >
                <div className="skill-icon-wrap" aria-hidden>
                  <group.icon size={16} />
                </div>
                <div className="min-w-0">
                  <p
                    className="text-xs font-semibold uppercase tracking-widest mb-2"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {group.category}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {group.items.map((item) => (
                      <span key={item} className="skill-pill">{item}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="section-divider" aria-hidden />

        {/* ── Experience ── */}
        <section aria-labelledby="experience-heading">
          <div className="flex items-center gap-2 mb-6">
            <Briefcase size={16} style={{ color: "var(--text-muted)" }} aria-hidden />
            <h2
              id="experience-heading"
              className="text-sm font-semibold tracking-widest uppercase"
              style={{ color: "var(--text-muted)" }}
            >
              Experience
            </h2>
          </div>
          <ol className="space-y-6" aria-label="Work history">
            {experience.map((job) => (
              <li key={`${job.company}-${job.period}`} className="timeline-item">
                <div className="timeline-dot" aria-hidden>
                  <div className="timeline-dot-inner" />
                </div>
                <div className="card p-4">
                  <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1 mb-3">
                    <div>
                      <h3
                        className="font-semibold text-base"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {job.role}
                      </h3>
                      <p
                        className="text-sm"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {job.company}
                        <span style={{ color: "var(--text-muted)" }}>
                          {" "}· {job.location}
                        </span>
                      </p>
                    </div>
                    <span
                      className="badge badge-other flex-shrink-0 mt-0.5"
                      style={{ fontSize: "0.6875rem" }}
                    >
                      {job.period}
                    </span>
                  </div>
                  <ul className="space-y-1.5">
                    {job.highlights.map((h, i) => (
                      <li
                        key={i}
                        className="flex gap-2 text-sm leading-relaxed"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        <span
                          className="mt-2 h-1 w-1 rounded-full flex-shrink-0"
                          style={{ background: "var(--brand-500)" }}
                          aria-hidden
                        />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <div className="section-divider" aria-hidden />

        {/* ── Education ── */}
        <section aria-labelledby="education-heading" className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap size={16} style={{ color: "var(--text-muted)" }} aria-hidden />
            <h2
              id="education-heading"
              className="text-sm font-semibold tracking-widest uppercase"
              style={{ color: "var(--text-muted)" }}
            >
              Education
            </h2>
          </div>
          <div className="card p-4">
            <div className="flex flex-wrap justify-between items-start gap-2">
              <div>
                <h3
                  className="font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  BSc Computer Science
                </h3>
                <p
                  className="text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Machakos University, Kenya
                </p>
              </div>
            </div>
            <p
              className="text-xs mt-3 leading-relaxed"
              style={{ color: "var(--text-muted)" }}
            >
              Relevant coursework: Data Structures & Algorithms · Database Systems · Software Engineering · Web Technologies · Computer Networks · Operating Systems
            </p>
          </div>
        </section>

        {/* ── CTA ── */}
        <div className="cta-card">
          <h2
            className="font-semibold text-lg mb-1"
            style={{ color: "var(--text-primary)" }}
          >
            See the work
          </h2>
          <p
            className="text-sm mb-5"
            style={{ color: "var(--text-secondary)" }}
          >
            Browse live demos, open-source repos, and full-stack projects — filtered by language, framework, or tech stack.
          </p>
          <Link href="/" className="btn btn-primary">
            View all projects
            <ArrowRight size={14} aria-hidden />
          </Link>
        </div>
      </main>
    </>
  );
}