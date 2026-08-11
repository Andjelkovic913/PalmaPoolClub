import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Access control for `/admin`.
 *
 * One venue, one owner, one password — so a full user table would be more
 * moving parts than the problem has. What this must still get right:
 *
 *   · The cookie is an HMAC of a constant, keyed by `OWNER_PASSWORD`. It
 *     carries no secret, cannot be forged without the password, and changing
 *     the password invalidates every existing session for free.
 *   · `httpOnly` + `sameSite: lax` + `secure` in production, so it is not
 *     readable from JavaScript and does not ride along on cross-site requests.
 *   · Comparison is `timingSafeEqual`, not `===`.
 *   · **Every server action re-checks.** Hiding the UI is not access control;
 *     an action is a public HTTP endpoint whether or not a button renders.
 *
 * With no `OWNER_PASSWORD` set, `/admin` refuses everyone rather than letting
 * everyone in — an unset secret must never mean "no lock".
 */

const COOKIE = "palma_admin";
/** Constant payload — the signature is the whole point, not the contents. */
const PAYLOAD = "palma-admin-v1";

export function isAdminConfigured(): boolean {
  return Boolean(process.env.OWNER_PASSWORD);
}

function expectedToken(): string | null {
  const secret = process.env.OWNER_PASSWORD;
  if (!secret) return null;
  return createHmac("sha256", secret).update(PAYLOAD).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

/** Is the current request from a signed-in owner? */
export async function isAdmin(): Promise<boolean> {
  const expected = expectedToken();
  if (!expected) return false;
  const got = (await cookies()).get(COOKIE)?.value;
  return Boolean(got && safeEqual(got, expected));
}

/**
 * Verify a submitted password and start a session.
 *
 * Returns false for a wrong password AND when no password is configured, so
 * a misconfigured deployment fails closed.
 */
export async function signIn(password: string): Promise<boolean> {
  const secret = process.env.OWNER_PASSWORD;
  const expected = expectedToken();
  if (!secret || !expected) return false;
  if (!safeEqual(password, secret)) return false;

  (await cookies()).set(COOKIE, expected, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: 60 * 60 * 12,
  });
  return true;
}

export async function signOut(): Promise<void> {
  (await cookies()).delete(COOKIE);
}

/**
 * Guard for server actions. Throws rather than returning a flag, so a caller
 * that forgets to check the result still cannot proceed.
 */
export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) {
    throw new Error("Nemate pristup.");
  }
}
