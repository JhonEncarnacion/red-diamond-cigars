import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

export async function requireAdmin() {
  const user = await currentUser();

  const primaryEmail = user?.emailAddresses.find(
    (email) => email.id === user.primaryEmailAddressId,
  )?.emailAddress;

  if (!primaryEmail || primaryEmail !== process.env.ADMIN_AUTH_EMAIL) {
    notFound();
  }

  return user;
}
