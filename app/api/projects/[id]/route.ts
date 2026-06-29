// app/api/projects/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import { isAdminRequest } from "@/lib/requireAdmin";
import { z } from "zod";

type Params = {
  params: Promise<{ id: string }>;
};

// GET /api/projects/[id]
// Public endpoint - fetch project by slug or MongoDB ObjectId.
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    await connectDB();

    const { id } = await params;

    const project = await Project.findOne({
      $or: [
        { slug: id },
        ...(id.match(/^[a-f\d]{24}$/i) ? [{ _id: id }] : []),
      ],
    }).lean();

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(project);
  } catch (err) {
    console.error("[GET /api/projects/[id]]", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

// ─── Update schema (mirrors CreateSchema, all fields optional for PATCH-style PUT) ──
const DemoCredentialSchema = z.object({
  role: z.string().min(1).max(50),
  label: z.string().min(1).max(80),
  username: z.string().optional(),
  password: z.string().min(1),
  description: z.string().max(200).optional(),
});

const UpdateSchema = z.object({
  title: z.string().min(1).max(120).optional(),
  description: z.string().min(1).max(300).optional(),
  longDescription: z.string().optional(),
  stack: z
    .array(
      z.object({
        name: z.string(),
        category: z.enum(["language", "framework", "database", "tool", "platform", "other"]),
        color: z.string().optional(),
      })
    )
    .optional(),
  tags: z.array(z.string()).optional(),
  imageUrls: z.array(z.string()).optional(),
  imagePublicIds: z.array(z.string()).optional(),
  thumbnailUrl: z.string().optional(),
  thumbnailPublicId: z.string().optional(),
  liveUrl: z.string().url().optional().or(z.literal("")),
  repoUrl: z.string().url().optional().or(z.literal("")),
  featured: z.boolean().optional(),
  status: z.enum(["completed", "in-progress", "archived"]).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  // Per-project demo/test credentials — stored plaintext intentionally.
  demoCredentials: z.array(DemoCredentialSchema).optional(),
});

// PUT /api/projects/[id]
// Protected endpoint.
export async function PUT(req: NextRequest, { params }: Params) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    await connectDB();

    const { id } = await params;
    const body = await req.json();

    // Validate and sanitise — prevents arbitrary field injection
    const data = UpdateSchema.parse(body);

    // Coerce date strings to Date objects if present
    const update: Record<string, unknown> = { ...data };
    if (data.startDate) update.startDate = new Date(data.startDate);
    if (data.endDate) update.endDate = new Date(data.endDate);

    const project = await Project.findByIdAndUpdate(
      id,
      { $set: update },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(project);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 });
    }
    console.error("[PUT /api/projects/[id]]", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/[id]
// Protected endpoint.
export async function DELETE(req: NextRequest, { params }: Params) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    await connectDB();

    const { id } = await params;

    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (err) {
    console.error("[DELETE /api/projects/[id]]", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}