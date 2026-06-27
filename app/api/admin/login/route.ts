// app/api/admin/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import {
  createSessionToken,
  ADMIN_COOKIE_NAME,
  ADMIN_COOKIE_MAX_AGE_SECONDS,
} from "@/lib/adminSession";

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export async function POST(req: NextRequest) {
  const adminSecret = process.env.ADMIN_SECRET;
  // TEMP DEBUG — remove after diagnosing
  console.log("[login route] ADMIN_SECRET length:", adminSecret?.length, "first 3 chars:", adminSecret?.slice(0, 3));
  if (!adminSecret) {
    console.error("[POST /api/admin/login] ADMIN_SECRET not configured");
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  let body: { password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const password = body.password ?? "";

  if (!password || !safeEqual(password, adminSecret)) {
    // Generic message — don't reveal whether the field was empty vs. wrong.
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  const token = await createSessionToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_COOKIE_MAX_AGE_SECONDS,
  });
  return res;
}
