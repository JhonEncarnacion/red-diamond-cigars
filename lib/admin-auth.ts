import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { hasAdminAccess } from "./admin-access";

export async function requireAdmin() {
  const user = await currentUser();

  if (!hasAdminAccess(user, process.env.ADMIN_AUTH_EMAIL, process.env.ADMIN_AUTH_EMAILS)) {
    notFound();
  }

  return user!;
}
