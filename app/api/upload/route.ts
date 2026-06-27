// app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { uploadImage, uploadThumbnail } from "@/lib/cloudinary";
import { isAdminRequest } from "@/lib/requireAdmin";

// Middleware already blocks this route for unauthenticated requests
// (see middleware.ts matcher: "/api/upload/:path*"). isAdminRequest here
// is defense-in-depth in case middleware config ever drifts.
export async function POST(req: NextRequest) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    const type = (formData.get("type") as string) || "image"; // "image" | "thumbnail"

    if (!files.length) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const uploads = await Promise.all(
      files.map(async (file) => {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

        if (type === "thumbnail") {
          return uploadThumbnail(base64);
        }
        return uploadImage(base64);
      })
    );

    return NextResponse.json({ uploads });
  } catch (err) {
    console.error("[POST /api/upload]", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

// Note: no `config`/`bodyParser` export needed here — that was a Pages Router
// convention. App Router route handlers parse multipart form data natively
// via req.formData(), so there's nothing to opt out of.