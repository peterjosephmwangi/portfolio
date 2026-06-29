"use client";

import { Metadata } from "next";
import {
  Github,
  Mail,
  Globe,
  MapPin,
  Phone,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useState, useRef, FormEvent } from "react";

// ─── Data ──────────────────────────────────────────────────────────────────

const contactMethods = [
  {
    icon: Mail,
    label: "Email",
    value: "ampeterjosep@gmail.com",
    href: "mailto:ampeterjosep@gmail.com",
    description: "Best for project enquiries and freelance work.",
    color: "contact-email",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+254 716 988 147",
    href: "tel:+254716988147",
    description: "Available Mon–Fri, 9 am – 6 pm EAT.",
    color: "contact-phone",
  },
  {
    icon: Github,
    label: "GitHub",
    value: "github.com/peterjosephmwangi",
    href: "https://github.com/peterjosephmwangi",
    description: "Browse open-source repos and code samples.",
    color: "contact-github",
  },
  {
    icon: Globe,
    label: "Portfolio",
    value: "peterjosep.netlify.app",
    href: "https://peterjosep.netlify.app",
    description: "Live demos, projects, and full-stack showcases.",
    color: "contact-portfolio",
  },
];

const inquiryTypes = [
  "Freelance / Contract",
  "Full-time Opportunity",
  "Training & Mentorship",
  "Open Source Collaboration",
  "Other",
];

type FormState = "idle" | "loading" | "success" | "error";

// ─── Component ─────────────────────────────────────────────────────────────

export default function ContactPage() {
  const [formState, setFormState] = useState<FormState>("idle");
  const [selectedType, setSelectedType] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormState("loading");

    // Replace this with your actual form submission logic
    // e.g. fetch("/api/contact", { method: "POST", body: new FormData(e.currentTarget) })
    await new Promise((r) => setTimeout(r, 1400));

    // Simulate success — swap for real error handling
    setFormState("success");
    formRef.current?.reset();
    setSelectedType("");
  }

  function handleReset() {
    setFormState("idle");
    setSelectedType("");
  }

  return (
    <>
      <style>{`
        /* Hero accent */
        .contact-hero-accent {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            ellipse 80% 50% at 50% -10%,
            color-mix(in srgb, var(--brand-500) 10%, transparent),
            transparent 70%
          );
          pointer-events: none;
        }

        /* Contact method cards */
        .contact-method-card {
          display: flex;
          gap: 14px;
          align-items: flex-start;
          padding: 16px;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-muted);
          background: var(--bg-subtle);
          text-decoration: none;
          transition: border-color 0.15s, box-shadow 0.15s, background 0.15s, transform 0.12s;
        }
        .contact-method-card:hover {
          border-color: color-mix(in srgb, var(--brand-400) 50%, var(--border));
          box-shadow: var(--shadow-md);
          background: var(--bg);
          transform: translateY(-1px);
        }
        .contact-method-card:active { transform: translateY(0); }

        .contact-icon-wrap {
          width: 38px;
          height: 38px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .contact-email     .contact-icon-wrap { background: #dbeafe; color: #1d4ed8; }
        .contact-phone     .contact-icon-wrap { background: #dcfce7; color: #15803d; }
        .contact-github    .contact-icon-wrap { background: #f3f4f6; color: #111827; }
        .contact-portfolio .contact-icon-wrap { background: #ede9fe; color: #6d28d9; }
        .dark .contact-email     .contact-icon-wrap { background: #1e3a5f; color: #93c5fd; }
        .dark .contact-phone     .contact-icon-wrap { background: #052e16; color: #86efac; }
        .dark .contact-github    .contact-icon-wrap { background: #1c1c1c; color: #e5e7eb; }
        .dark .contact-portfolio .contact-icon-wrap { background: #2e1065; color: #c4b5fd; }

        /* Form */
        .contact-form-card {
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: var(--radius-xl);
          padding: 32px;
          box-shadow: var(--shadow-sm);
        }

        .form-field { display: flex; flex-direction: column; gap: 6px; }

        .form-input {
          width: 100%;
          background: var(--bg);
          color: var(--text-primary);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 9px 13px;
          font-size: 0.875rem;
          line-height: 1.5;
          font-family: inherit;
          transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
          outline: none;
          resize: vertical;
        }
        .form-input::placeholder { color: var(--text-muted); }
        .form-input:focus {
          border-color: var(--brand-500);
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--brand-400) 18%, transparent);
        }
        .dark .form-input { background: var(--bg-subtle); }
        .dark .form-input:focus { background: var(--bg); }

        /* Inquiry type chips */
        .inquiry-chip {
          display: inline-flex;
          align-items: center;
          padding: 5px 12px;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 500;
          border: 1px solid var(--border);
          background: var(--bg-subtle);
          color: var(--text-secondary);
          cursor: pointer;
          transition: background 0.12s, color 0.12s, border-color 0.12s;
          user-select: none;
        }
        .inquiry-chip:hover {
          background: var(--bg-muted);
          color: var(--text-primary);
        }
        .inquiry-chip.selected {
          background: var(--brand-600);
          border-color: var(--brand-600);
          color: #fff;
        }
        .dark .inquiry-chip.selected {
          background: var(--brand-500);
          border-color: var(--brand-500);
        }

        /* Submit button */
        .submit-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding: 10px 22px;
          border-radius: var(--radius-md);
          background: var(--brand-600);
          color: #fff;
          font-size: 0.875rem;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: background 0.12s, box-shadow 0.12s, transform 0.1s;
          box-shadow: 0 1px 2px rgb(79 70 229 / 0.25);
        }
        .submit-btn:hover:not(:disabled) {
          background: var(--brand-700);
          box-shadow: 0 3px 8px rgb(79 70 229 / 0.3);
        }
        .submit-btn:active:not(:disabled) { transform: scale(0.97); }
        .submit-btn:disabled { opacity: 0.55; cursor: not-allowed; }

        /* Feedback states */
        .feedback-box {
          border-radius: var(--radius-lg);
          padding: 20px 24px;
          display: flex;
          gap: 14px;
          align-items: flex-start;
        }
        .feedback-success {
          background: var(--green-bg);
          border: 1px solid color-mix(in srgb, var(--green-text) 25%, transparent);
        }
        .feedback-error {
          background: #fef2f2;
          border: 1px solid color-mix(in srgb, #ef4444 25%, transparent);
        }
        .dark .feedback-error {
          background: #2d0a0a;
          border-color: color-mix(in srgb, #f87171 25%, transparent);
        }

        /* Location pill */
        .location-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 500;
          background: var(--bg-muted);
          color: var(--text-muted);
          border: 1px solid var(--border-muted);
        }

        /* Section divider */
        .section-divider {
          height: 1px;
          background: linear-gradient(
            to right,
            transparent,
            var(--border) 20%,
            var(--border) 80%,
            transparent
          );
          margin: 40px 0;
        }

        @keyframes fade-up {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up { animation: fade-up 0.25s ease both; }
      `}</style>

      <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 lg:py-20">

        {/* ── Hero ── */}
        <section className="relative mb-10">
          <div className="contact-hero-accent" aria-hidden />
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-2"
            style={{ color: "var(--brand-600)" }}
          >
            Get in touch
          </p>
          <h1 className="section-heading mb-3">Let's build something together</h1>
          <p
            className="text-lg leading-relaxed mb-4"
            style={{ color: "var(--text-secondary)" }}
          >
            Whether you have a project in mind, an open role, or just want to talk tech — I'm always open to a conversation.
          </p>
          <div className="location-pill">
            <MapPin size={11} aria-hidden />
            Nairobi, Kenya &nbsp;·&nbsp; Open to remote
          </div>
        </section>

        {/* ── Contact method cards ── */}
        <section aria-labelledby="channels-heading" className="mb-10">
          <h2
            id="channels-heading"
            className="text-xs font-semibold tracking-widest uppercase mb-4"
            style={{ color: "var(--text-muted)" }}
          >
            Contact channels
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {contactMethods.map((m) => (
              <a
                key={m.href}
                href={m.href}
                target={m.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className={`contact-method-card ${m.color}`}
                aria-label={`${m.label}: ${m.value}`}
              >
                <div className="contact-icon-wrap" aria-hidden>
                  <m.icon size={17} />
                </div>
                <div className="min-w-0">
                  <p
                    className="text-xs font-semibold uppercase tracking-widest mb-0.5"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {m.label}
                  </p>
                  <p
                    className="text-sm font-medium truncate"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {m.value}
                  </p>
                  <p
                    className="text-xs mt-0.5 leading-relaxed"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {m.description}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </section>

        <div className="section-divider" aria-hidden />

        {/* ── Contact form ── */}
        <section aria-labelledby="form-heading">
          <h2
            id="form-heading"
            className="text-xs font-semibold tracking-widest uppercase mb-1"
            style={{ color: "var(--text-muted)" }}
          >
            Send a message
          </h2>
          <p
            className="text-sm mb-6"
            style={{ color: "var(--text-secondary)" }}
          >
            I typically reply within one business day.
          </p>

          <div className="contact-form-card">

            {/* Success state */}
            {formState === "success" && (
              <div className="feedback-box feedback-success animate-fade-up mb-6" role="status">
                <CheckCircle2
                  size={20}
                  style={{ color: "var(--green-text)", flexShrink: 0, marginTop: 1 }}
                  aria-hidden
                />
                <div>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "var(--green-text)" }}
                  >
                    Message sent!
                  </p>
                  <p
                    className="text-sm mt-0.5"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Thanks for reaching out. I'll be in touch soon.{" "}
                    <button
                      onClick={handleReset}
                      className="underline"
                      style={{ color: "var(--brand-600)", background: "none", border: "none", cursor: "pointer", padding: 0, font: "inherit" }}
                    >
                      Send another?
                    </button>
                  </p>
                </div>
              </div>
            )}

            {/* Error state */}
            {formState === "error" && (
              <div className="feedback-box feedback-error animate-fade-up mb-6" role="alert">
                <AlertCircle
                  size={20}
                  style={{ color: "#ef4444", flexShrink: 0, marginTop: 1 }}
                  aria-hidden
                />
                <div>
                  <p className="text-sm font-semibold" style={{ color: "#ef4444" }}>
                    Something went wrong
                  </p>
                  <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
                    Please try again or email me directly at{" "}
                    <a
                      href="mailto:ampeterjosep@gmail.com"
                      className="underline"
                      style={{ color: "var(--brand-600)" }}
                    >
                      ampeterjosep@gmail.com
                    </a>
                    .
                  </p>
                </div>
              </div>
            )}

            <form
              ref={formRef}
              onSubmit={handleSubmit}
              noValidate
              aria-label="Contact form"
            >
              {/* Name + Email */}
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div className="form-field">
                  <label
                    htmlFor="contact-name"
                    className="field-label"
                  >
                    Name <span aria-hidden style={{ color: "var(--brand-500)" }}>*</span>
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="Jane Smith"
                    className="form-input"
                    disabled={formState === "loading" || formState === "success"}
                  />
                </div>
                <div className="form-field">
                  <label
                    htmlFor="contact-email"
                    className="field-label"
                  >
                    Email <span aria-hidden style={{ color: "var(--brand-500)" }}>*</span>
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="jane@company.com"
                    className="form-input"
                    disabled={formState === "loading" || formState === "success"}
                  />
                </div>
              </div>

              {/* Inquiry type */}
              <div className="form-field mb-4">
                <span className="field-label" id="inquiry-label">
                  What's this about?
                </span>
                <input type="hidden" name="inquiry_type" value={selectedType} />
                <div
                  className="flex flex-wrap gap-2 mt-1"
                  role="group"
                  aria-labelledby="inquiry-label"
                >
                  {inquiryTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSelectedType(type === selectedType ? "" : type)}
                      className={`inquiry-chip${selectedType === type ? " selected" : ""}`}
                      aria-pressed={selectedType === type}
                      disabled={formState === "loading" || formState === "success"}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subject */}
              <div className="form-field mb-4">
                <label htmlFor="contact-subject" className="field-label">
                  Subject
                </label>
                <input
                  id="contact-subject"
                  name="subject"
                  type="text"
                  placeholder="Brief summary of your message"
                  className="form-input"
                  disabled={formState === "loading" || formState === "success"}
                />
              </div>

              {/* Message */}
              <div className="form-field mb-6">
                <label htmlFor="contact-message" className="field-label">
                  Message <span aria-hidden style={{ color: "var(--brand-500)" }}>*</span>
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={5}
                  placeholder="Tell me about the project, role, or idea you have in mind…"
                  className="form-input"
                  style={{ minHeight: 120 }}
                  disabled={formState === "loading" || formState === "success"}
                />
              </div>

              {/* Submit */}
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <p
                  className="text-xs"
                  style={{ color: "var(--text-muted)" }}
                >
                  <span aria-hidden style={{ color: "var(--brand-500)" }}>*</span> Required fields
                </p>
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={formState === "loading" || formState === "success"}
                  aria-busy={formState === "loading"}
                >
                  {formState === "loading" ? (
                    <>
                      <Loader2 size={15} className="animate-spin" aria-hidden />
                      Sending…
                    </>
                  ) : (
                    <>
                      <Send size={14} aria-hidden />
                      Send message
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </>
  );
}