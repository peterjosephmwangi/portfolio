// app/projects/[slug]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import ProjectModel from "@/models/Project";
import { TechBadge } from "@/components/ui/TechBadge";
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Calendar,
  Eye,
  Tag,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

const OBJECT_ID_RE = /^[a-f\d]{24}$/i;

async function getProject(slug: string) {
  await connectDB();

  const project = await ProjectModel.findOneAndUpdate(
    {
      $or: [
        { slug },
        ...(OBJECT_ID_RE.test(slug) ? [{ _id: slug }] : []),
      ],
    },
    { $inc: { viewCount: 1 } },
    { returnDocument: "after" }
  ).lean();

  return project;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return { title: "Project not found" };

  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: project.thumbnailUrl ? [project.thumbnailUrl] : [],
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  const languages = project.stack.filter((t) => t.category === "language");
  const frameworks = project.stack.filter((t) => t.category === "framework");
  const databases = project.stack.filter((t) => t.category === "database");
  const tools = project.stack.filter(
    (t) => !["language", "framework", "database"].includes(t.category)
  );

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mb-6"
      >
        <ArrowLeft size={16} /> Back to projects
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Hero image */}
          {project.thumbnailUrl && (
            <div className="relative aspect-video rounded-xl overflow-hidden bg-[var(--bg-muted)] border border-[var(--border)]">
              <Image
                src={project.thumbnailUrl}
                alt={project.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
            </div>
          )}

          {/* Additional images */}
          {project.imageUrls.length > 0 && (
            <div className="grid grid-cols-2 gap-3">
              {project.imageUrls.map((url, i) => (
                <div
                  key={i}
                  className="relative aspect-video rounded-lg overflow-hidden bg-[var(--bg-muted)] border border-[var(--border)]"
                >
                  <Image
                    src={url}
                    alt={`${project.title} screenshot ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Description */}
          <div className="card p-6">
            <h2 className="font-semibold text-[var(--text-primary)] mb-3">
              About this project
            </h2>
            {project.longDescription ? (
              <p className="text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap text-sm">
                {project.longDescription}
              </p>
            ) : (
              <p className="text-[var(--text-secondary)] leading-relaxed text-sm">
                {project.description}
              </p>
            )}
          </div>

          {/* Tech stack breakdown */}
          {project.stack.length > 0 && (
            <div className="card p-6">
              <h2 className="font-semibold text-[var(--text-primary)] mb-4">
                Tech Stack
              </h2>
              <div className="flex flex-col gap-4">
                {languages.length > 0 && (
                  <StackGroup label="Languages" techs={languages} />
                )}
                {frameworks.length > 0 && (
                  <StackGroup label="Frameworks & Libraries" techs={frameworks} />
                )}
                {databases.length > 0 && (
                  <StackGroup label="Databases" techs={databases} />
                )}
                {tools.length > 0 && (
                  <StackGroup label="Tools & Platforms" techs={tools} />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-4">
          {/* Title & meta */}
          <div className="card p-5">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h1 className="text-xl font-bold text-[var(--text-primary)] leading-tight">
                {project.title}
              </h1>
              {project.featured && (
                <span className="badge bg-brand text-white border-transparent flex-shrink-0">
                  ⭐ Featured
                </span>
              )}
            </div>
            <p className="text-sm text-[var(--text-muted)] mb-4">
              {project.description}
            </p>

            {/* Meta info */}
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex items-center gap-2 text-[var(--text-muted)]">
                <Eye size={14} />
                <span>{project.viewCount?.toLocaleString() || 0} views</span>
              </div>
              {project.startDate && (
                <div className="flex items-center gap-2 text-[var(--text-muted)]">
                  <Calendar size={14} />
                  <span>
                    {formatDate(project.startDate.toString())}
                    {project.endDate &&
                      ` — ${formatDate(project.endDate.toString())}`}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span
                  className="inline-block w-2 h-2 rounded-full"
                  style={{
                    backgroundColor:
                      project.status === "completed"
                        ? "var(--green-text)"
                        : project.status === "in-progress"
                        ? "var(--amber-text)"
                        : "var(--zinc-text)",
                  }}
                />
                <span className="text-[var(--text-muted)] capitalize">
                  {project.status === "in-progress" ? "In Progress" : project.status}
                </span>
              </div>
            </div>
          </div>

          {/* Links */}
          {(project.liveUrl || project.repoUrl) && (
            <div className="card p-5 flex flex-col gap-2">
              <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1">
                Links
              </h3>
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full justify-center"
                >
                  <ExternalLink size={15} />
                  Live Demo
                </a>
              )}
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary w-full justify-center"
                >
                  <Github size={15} />
                  Source Code
                </a>
              )}
            </div>
          )}

          {/* Tags */}
          {project.tags.length > 0 && (
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-3">
                <Tag size={13} className="text-[var(--text-muted)]" />
                <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                  Tags
                </h3>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/?tag=${encodeURIComponent(tag)}`}
                    className="badge badge-other hover:border-[var(--brand-400)] transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StackGroup({
  label,
  techs,
}: {
  label: string;
  techs: Array<{ name: string; category: string; color?: string }>;
}) {
  return (
    <div>
      <p className="text-xs text-[var(--text-muted)] mb-2">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {techs.map((t) => (
          <TechBadge
            key={t.name}
            tech={t as Parameters<typeof TechBadge>[0]["tech"]}
          />
        ))}
      </div>
    </div>
  );
}