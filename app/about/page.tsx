import { Metadata } from "next";
import Link from "next/link";
import { Github, Linkedin, Twitter, Mail, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description: "About me — developer, builder, open source contributor.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <h1 className="section-heading mb-4">About me</h1>
      <div className="prose prose-zinc dark:prose-invert max-w-none">
        <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
          I&apos;m a software developer with a passion for building things. This portfolio
          showcases 200+ projects spanning web development, data engineering, mobile apps,
          CLI tools, and open source contributions.
        </p>
        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-8">
          Every project here is something I built to solve a real problem, learn a new
          technology, or explore an interesting idea. Browse by language, framework, or tag
          to find projects relevant to what you&apos;re looking for.
        </p>
      </div>

      <div className="flex items-center gap-3 mb-10 flex-wrap">
        {[
          { href: "https://github.com/yourusername", label: "GitHub", icon: Github },
          { href: "https://linkedin.com/in/yourprofile", label: "LinkedIn", icon: Linkedin },
          { href: "https://twitter.com/yourhandle", label: "Twitter", icon: Twitter },
          { href: "mailto:you@example.com", label: "Email", icon: Mail },
        ].map(({ href, label, icon: Icon }) => (
          <a
            key={href}
            href={href}
            className="btn-secondary"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon size={15} />
            {label}
          </a>
        ))}
      </div>

      <div className="card p-6">
        <h2 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
          Browse the work
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
          Filter by language, framework, or search for something specific.
        </p>
        <Link href="/" className="btn-primary w-fit">
          View all projects
          <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}
