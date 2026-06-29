// app/api/projects/meta/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import Project from "@/models/Project";

export const revalidate = 3600; // cache for 1 hour

export async function GET() {
  try {
    await connectDB();

    const [languagesAgg, frameworksAgg, tagsAgg, totalCount] = await Promise.all([
      Project.aggregate([
        { $unwind: "$stack" },
        { $match: { "stack.category": "language" } },
        { $group: { _id: "$stack.name", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 50 },
      ]),
      Project.aggregate([
        { $unwind: "$stack" },
        { $match: { "stack.category": "framework" } },
        { $group: { _id: "$stack.name", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 50 },
      ]),
      Project.aggregate([
        { $unwind: "$tags" },
        { $group: { _id: "$tags", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 80 },
      ]),
      Project.countDocuments(),
    ]);

    return NextResponse.json({
      languages: languagesAgg.map((l) => ({ name: l._id, count: l.count })),
      frameworks: frameworksAgg.map((f) => ({ name: f._id, count: f.count })),
      tags: tagsAgg.map((t) => ({ name: t._id, count: t.count })),
      total: totalCount,
    });
  } catch (err) {
    console.error("[GET /api/projects/meta]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
