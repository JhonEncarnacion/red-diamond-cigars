import { createHash } from "node:crypto";
import { isIP } from "node:net";
import type { Prisma } from "./generated/prisma/client";

export class InquiryRateLimitExceeded extends Error {
  constructor() {
    super("Inquiry submission limit reached");
    this.name = "InquiryRateLimitExceeded";
  }
}

// Only trust the platform-provided header on Vercel. Other deployments share
// a conservative fallback bucket until their trusted proxy is configured.
export function getInquiryClientKey(
  requestHeaders: Pick<Headers, "get">,
  isVercel: boolean,
): string {
  const ip = isVercel
    ? requestHeaders.get("x-vercel-forwarded-for")?.trim()
    : undefined;

  if (!ip || !isIP(ip)) return "unknown";

  // Canonicalize IPv6 so alternate spellings cannot create separate buckets.
  return isIP(ip) === 6 ? new URL(`http://[${ip}]`).hostname : ip;
}

function bucketKey(kind: string, value: string) {
  return `${kind}:${createHash("sha256").update(value).digest("hex")}`;
}

/** Must run in a transaction: rejection rolls back all bucket reservations. */
export async function reserveInquirySubmission(
  tx: Prisma.TransactionClient,
  email: string,
  clientKey: string,
): Promise<void> {
  const limits = [
    { key: "site", maximum: 50, seconds: 3600 },
    { key: bucketKey("ip", clientKey), maximum: 5, seconds: 900 },
    { key: bucketKey("email", email.trim().toLowerCase()), maximum: 3, seconds: 3600 },
  ];

  // Lock in the same order for every request. The atomic upsert prevents
  // concurrent requests or separate server instances from exceeding a limit.
  for (const { key, maximum, seconds } of limits) {
    const reserved = await tx.$queryRaw<{ key: string }[]>`
      INSERT INTO "InquiryRateLimit" ("key", "count", "expiresAt")
      VALUES (${key}, 1, CURRENT_TIMESTAMP + ${seconds} * INTERVAL '1 second')
      ON CONFLICT ("key") DO UPDATE SET
        "count" = CASE
          WHEN "InquiryRateLimit"."expiresAt" <= CURRENT_TIMESTAMP THEN 1
          ELSE "InquiryRateLimit"."count" + 1
        END,
        "expiresAt" = CASE
          WHEN "InquiryRateLimit"."expiresAt" <= CURRENT_TIMESTAMP
            THEN CURRENT_TIMESTAMP + ${seconds} * INTERVAL '1 second'
          ELSE "InquiryRateLimit"."expiresAt"
        END
      WHERE "InquiryRateLimit"."expiresAt" <= CURRENT_TIMESTAMP
        OR "InquiryRateLimit"."count" < ${maximum}
      RETURNING "key"
    `;

    if (reserved.length === 0) throw new InquiryRateLimitExceeded();
  }

  // Bound cleanup work and avoid retaining old hashed identities indefinitely.
  await tx.$executeRaw`
    DELETE FROM "InquiryRateLimit" WHERE "key" IN (
      SELECT "key" FROM "InquiryRateLimit"
      WHERE "expiresAt" <= CURRENT_TIMESTAMP
      ORDER BY "expiresAt" LIMIT 100
    )
  `;
}
