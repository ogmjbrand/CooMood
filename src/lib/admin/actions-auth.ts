"use server";

import { redirect } from "next/navigation";
import { checkAdminPassword, clearAdminSessionCookie, setAdminSessionCookie } from "./auth";

export async function loginAdminAction(
  _prevState: { error: string } | undefined,
  formData: FormData
): Promise<{ error: string } | undefined> {
  const password = String(formData.get("password") ?? "");

  if (!process.env.ADMIN_PASSWORD) {
    return { error: "Admin login is not configured. Set ADMIN_PASSWORD on the server." };
  }

  if (!checkAdminPassword(password)) {
    return { error: "Incorrect password." };
  }

  await setAdminSessionCookie();
  redirect("/admin");
}

export async function logoutAdminAction() {
  await clearAdminSessionCookie();
  redirect("/admin/login");
}
