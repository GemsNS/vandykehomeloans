import { cookies } from "next/headers";
import {
  ADMIN_COOKIE_NAME,
  MAX_AGE_SECONDS,
  signAdminToken,
} from "@/lib/auth-token";

export {
  ADMIN_COOKIE_NAME,
  checkAdminPassword,
  signAdminToken,
  verifyAdminToken,
} from "@/lib/auth-token";

export async function setAdminCookie() {
  const store = await cookies();
  store.set(ADMIN_COOKIE_NAME, await signAdminToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function clearAdminCookie() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE_NAME);
}
