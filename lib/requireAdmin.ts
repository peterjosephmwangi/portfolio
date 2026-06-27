import { NextRequest } from "next/server";
import { verifySessionToken, ADMIN_COOKIE_NAME } from "@/lib/adminSession";

/**
 * Returns true if the request carries a valid admin session cookie.
 * Middleware already blocks unauthenticated mutating requests to
 * /api/projects and /api/upload before they reach these handlers —
 * this check is defense-in-depth in case middleware config ever drifts.
 */
export async function isAdminRequest(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}
