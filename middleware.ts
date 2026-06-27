// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, ADMIN_COOKIE_NAME } from "@/lib/adminSession";

const PROTECTED_API_METHODS = new Set(["POST", "PUT", "DELETE", "PATCH"]);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;

  // TEMP DEBUG — remove after diagnosing
  console.log("[middleware] ADMIN_SECRET length:", process.env.ADMIN_SECRET?.length, "first 3 chars:", process.env.ADMIN_SECRET?.slice(0, 3));

  const hasValidSession = await verifySessionToken(token);

  const isProtectedApi =
    pathname.startsWith("/api/projects") && PROTECTED_API_METHODS.has(req.method);
  const isUploadApi = pathname.startsWith("/api/upload");

  if (!isProtectedApi && !isUploadApi) {
    return NextResponse.next();
  }

  if (hasValidSession) {
    return NextResponse.next();
  }

  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export const config = {
  matcher: ["/api/projects/:path*", "/api/upload/:path*"],
};
