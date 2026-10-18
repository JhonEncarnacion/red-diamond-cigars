type AdminIdentity = {
  primaryEmailAddressId: string | null;
  emailAddresses: Array<{
    id: string;
    emailAddress: string;
    verification: { status: string } | null;
  }>;
};

// Match only the verified primary address against explicit approved emails.
export function hasAdminAccess(
  user: AdminIdentity | null,
  existingAdminEmail?: string,
  additionalAdminEmails?: string,
): boolean {
  const primary = user?.emailAddresses.find(
    (email) => email.id === user.primaryEmailAddressId,
  );
  if (!primary || primary.verification?.status !== "verified") return false;

  const approved = new Set(
    [existingAdminEmail ?? "", ...(additionalAdminEmails ?? "").split(",")]
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  );
  return approved.has(primary.emailAddress.trim().toLowerCase());
}
