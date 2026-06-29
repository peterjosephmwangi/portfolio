// lib/adminSession.ts
// Edge-runtime-safe: uses Web Crypto (crypto.subtle), not Node's `crypto` module.
// This file is imported by middleware.ts, which runs on the Edge Runtime by
// default — Node built-ins like require("crypto") are not available there.

const COOKIE_NAME = "admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

function getSigningKey(): string {
  // Reuses ADMIN_SECRET so there's nothing new to configure.
  // For stronger isolation you could add a separate ADMIN_SESSION_SECRET env var instead.
  const key = process.env.ADMIN_SECRET;
  if (!key) {
    throw new Error("ADMIN_SECRET is not set in the environment.");
  }
  return key;
}

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function importHmacKey(secret: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
}

async function sign(payload: string): Promise<string> {
  const key = await importHmacKey(getSigningKey());
  const encoder = new TextEncoder();
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return toHex(signature);
}

/**
 * Builds a signed, expiring session token: "<expiryMs>.<signature>"
 * No user-identifying data is stored — this is a single-admin site,
 * so the token just proves "someone who knew ADMIN_SECRET issued this
 * before it expired."
 */
export async function createSessionToken(): Promise<string> {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const payload = String(expiresAt);
  const signature = await sign(payload);
  return `${payload}.${signature}`;
}

function timingSafeEqualHex(a: string, b: string): boolean {
  // Hex strings of equal expected length (SHA-256 -> 64 hex chars).
  // XOR every char regardless of early mismatch to avoid short-circuit timing leaks.
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  const expected = await sign(payload);
  if (!timingSafeEqualHex(signature, expected)) return false;

  const expiresAt = Number(payload);
  if (!Number.isFinite(expiresAt)) return false;
  if (Date.now() > expiresAt) return false;

  return true;
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME;
export const ADMIN_COOKIE_MAX_AGE_SECONDS = SESSION_TTL_MS / 1000;
