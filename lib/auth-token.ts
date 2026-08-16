const COOKIE_NAME = "vdhl_admin";
const MAX_AGE_SECONDS = 60 * 60 * 12;

function secret(): string {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "dev-only-secret";
}

function toHex(buffer: ArrayBuffer): string {
  return [...new Uint8Array(buffer)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i += 1) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

async function hmacSha256(message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(message),
  );
  return toHex(signature);
}

export async function signAdminToken(): Promise<string> {
  const issuedAt = Date.now().toString();
  const hmac = await hmacSha256(issuedAt);
  return `${issuedAt}.${hmac}`;
}

export async function verifyAdminToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const [issuedAt, hmac] = token.split(".");
  if (!issuedAt || !hmac) return false;
  const age = Date.now() - Number(issuedAt);
  if (!Number.isFinite(age) || age < 0 || age > MAX_AGE_SECONDS * 1000) return false;
  const expected = await hmacSha256(issuedAt);
  return timingSafeEqual(hmac, expected);
}

export function checkAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD ?? "vandyke-admin";
  return timingSafeEqual(password, expected);
}

export { COOKIE_NAME as ADMIN_COOKIE_NAME, MAX_AGE_SECONDS };
