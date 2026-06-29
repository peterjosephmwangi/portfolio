// app/api/projects/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import { slugify } from "@/lib/utils";
import { isAdminRequest } from "@/lib/requireAdmin";
import { z } from "zod";

const PAGE_SIZE = 12;

// GET /api/projects — search, filter, paginate (public, no auth required)
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);

    const query = searchParams.get("q") || "";
    const languages = searchParams.getAll("language");
    const frameworks = searchParams.getAll("framework");
    const tags = searchParams.getAll("tag");
    const status = searchParams.get("status") || "";
    const featured = searchParams.get("featured");
    const sort = searchParams.get("sort") || "newest";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, parseInt(searchParams.get("limit") || String(PAGE_SIZE), 10));

    const filter: Record<string, unknown> = {};

    if (query) {
      filter.$text = { $search: query };
    }

    const stackFilters: Array<Record<string, unknown>> = [];
    if (languages.length > 0) {
      stackFilters.push({
        stack: {
          $elemMatch: {
            name: { $in: languages.map((l) => new RegExp(l, "i")) },
            category: "language",
          },
        },
      });
    }
    if (frameworks.length > 0) {
      stackFilters.push({
        stack: {
          $elemMatch: {
            name: { $in: frameworks.map((f) => new RegExp(f, "i")) },
            category: "framework",
          },
        },
      });
    }
    if (stackFilters.length > 0) {
      filter.$and = stackFilters;
    }

    if (tags.length > 0) {
      filter.tags = { $all: tags.map((t) => new RegExp(t, "i")) };
    }

    if (status) filter.status = status;
    if (featured === "true") filter.featured = true;

    const sortMap: Record<string, Record<string, number>> = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      title: { title: 1 },
      featured: { featured: -1, createdAt: -1 },
    };
    const sortOrder = sortMap[sort] || sortMap.newest;

    const projection = query ? { score: { $meta: "textScore" } } : {};
    const sortWithRelevance = query
      ? { score: { $meta: "textScore" }, ...sortOrder }
      : sortOrder;

    const skip = (page - 1) * limit;

    const [projects, total] = await Promise.all([
      Project.find(filter, projection)
        .sort(sortWithRelevance)
        .skip(skip)
        .limit(limit)
        .lean(),
      Project.countDocuments(filter),
    ]);

    return NextResponse.json({
      projects,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      hasMore: skip + projects.length < total,
    });
  } catch (err) {
    console.error("[GET /api/projects]", err);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

// ─── Zod Schemas ──────────────────────────────────────────────────────────────

const DemoCredentialSchema = z.object({
  role: z.string().min(1).max(50),
  label: z.string().min(1).max(80),
  username: z.string().optional(),
  password: z.string().min(1),
  description: z.string().max(200).optional(),
});

const CreateSchema = z.object({
  title: z.string().min(1).max(120),
  description: z.string().min(1).max(300),
  longDescription: z.string().optional(),
  stack: z.array(
    z.object({
      name: z.string(),
      category: z.enum(["language", "framework", "database", "tool", "platform", "other"]),
      color: z.string().optional(),
    })
  ),
  tags: z.array(z.string()).default([]),
  imageUrls: z.array(z.string()).default([]),
  imagePublicIds: z.array(z.string()).default([]),
  thumbnailUrl: z.string().default(""),
  thumbnailPublicId: z.string().optional(),
  liveUrl: z.string().url().optional().or(z.literal("")),
  repoUrl: z.string().url().optional().or(z.literal("")),
  featured: z.boolean().default(false),
  status: z.enum(["completed", "in-progress", "archived"]).default("completed"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  // Per-project demo/test credentials — stored plaintext intentionally,
  // these are meant to be displayed to visitors for testing purposes.
  demoCredentials: z.array(DemoCredentialSchema).default([]),
});

// POST /api/projects — create (admin only)
// Middleware already blocks this for unauthenticated requests; isAdminRequest
// here is defense-in-depth in case middleware config ever drifts.
export async function POST(req: NextRequest) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const body = await req.json();
    const data = CreateSchema.parse(body);

    const slug = slugify(data.title);

    let uniqueSlug = slug;
    let counter = 1;
    while (await Project.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${slug}-${counter++}`;
    }

    const project = await Project.create({
      ...data,
      slug: uniqueSlug,
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      endDate: data.endDate ? new Date(data.endDate) : undefined,
    });

    return NextResponse.json(project, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 });
    }
    console.error("[POST /api/projects]", err);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}