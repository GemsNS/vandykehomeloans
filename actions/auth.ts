"use server";

import { redirect } from "next/navigation";
import { checkAdminPassword, clearAdminCookie, setAdminCookie } from "@/lib/auth";
import { adminLoginSchema } from "@/lib/validations";

export async function loginAdmin(formData: FormData) {
  const parsed = adminLoginSchema.safeParse({
    password: String(formData.get("password") ?? ""),
  });
  if (!parsed.success || !checkAdminPassword(parsed.data.password)) {
    redirect("/admin/login?error=1");
  }
  await setAdminCookie();
  redirect("/admin");
}

export async function logoutAdmin() {
  await clearAdminCookie();
  redirect("/admin/login");
}
