import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";
import {
  getInquiryClientKey,
  InquiryRateLimitExceeded,
  reserveInquirySubmission,
} from "../lib/inquiry-rate-limit";

test("only trusts valid Vercel IPs and canonicalizes IPv6", () => {
  const spoofed = new Headers({ "x-forwarded-for": "192.0.2.1" });
  assert.equal(getInquiryClientKey(spoofed, true), "unknown");
  const headers = new Headers({ "x-vercel-forwarded-for": "192.0.2.1" });
  assert.equal(getInquiryClientKey(headers, false), "unknown");
  assert.equal(getInquiryClientKey(headers, true), "192.0.2.1");
  headers.set("x-vercel-forwarded-for", "192.0.2.1, 192.0.2.2");
  assert.equal(getInquiryClientKey(headers, true), "unknown");
  headers.set("x-vercel-forwarded-for", "not-an-ip");
  assert.equal(getInquiryClientKey(headers, true), "unknown");
  headers.set("x-vercel-forwarded-for", "2001:0db8:0:0:0:0:0:1");
  const expanded = getInquiryClientKey(headers, true);
  headers.set("x-vercel-forwarded-for", "2001:db8::1");
  assert.equal(getInquiryClientKey(headers, true), expanded);
});

// Explicitly opt in with a disposable database. Never fall back to DATABASE_URL.
test("PostgreSQL limits, concurrency, rollback, expiry, and cleanup", {
  skip: !process.env.TEST_DATABASE_URL,
}, async (t) => {
  const db = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.TEST_DATABASE_URL! }),
  });
  const setup = readFileSync("prisma/sql/add-inquiry-rate-limit.sql", "utf8");
  try {
    for (const statement of setup.split(";").filter((part) => part.trim())) {
      await db.$executeRawUnsafe(statement);
    }
    const reset = () => db.$executeRaw`TRUNCATE TABLE "InquiryRateLimit"`;
    const reserve = (email: string, ip: string) => db.$transaction(
      (tx) => reserveInquirySubmission(tx, email, ip),
      { maxWait: 10000, timeout: 10000 },
    );
    const countAccepted = (results: PromiseSettledResult<void>[]) => {
      for (const result of results) {
        if (result.status === "rejected") {
          assert.ok(result.reason instanceof InquiryRateLimitExceeded);
        }
      }
      return results.filter((result) => result.status === "fulfilled").length;
    };

    await t.test("concurrent submissions share the IP limit", async () => {
      await reset();
      const results = await Promise.allSettled(Array.from({ length: 12 }, (_, i) =>
        reserve(`person${i}@example.com`, "192.0.2.1")));
      assert.equal(countAccepted(results), 5);
      const rows = await db.$queryRaw<{ count: number }[]>`
        SELECT "count" FROM "InquiryRateLimit" WHERE "key" = 'site'
      `;
      assert.equal(rows[0].count, 5); // Rejections do not consume site capacity.
    });

    await t.test("email case changes and different IPs cannot bypass recipient limit", async () => {
      await reset();
      const results = await Promise.allSettled(Array.from({ length: 8 }, (_, i) =>
        reserve(i % 2 ? "Person@example.com" : "person@example.com", `192.0.2.${i + 1}`)));
      assert.equal(countAccepted(results), 3);
    });

    await t.test("site cap applies across different IPs and recipients", async () => {
      await reset();
      await db.$executeRaw`
        INSERT INTO "InquiryRateLimit" VALUES ('site', 49, CURRENT_TIMESTAMP + INTERVAL '1 hour')
      `;
      const results = await Promise.allSettled(Array.from({ length: 8 }, (_, i) =>
        reserve(`person${i}@example.com`, `192.0.2.${i + 1}`)));
      assert.equal(countAccepted(results), 1);
    });

    await t.test("expired windows reset and old entries are removed", async () => {
      await reset();
      for (let i = 0; i < 3; i++) await reserve("person@example.com", "192.0.2.1");
      await assert.rejects(reserve("person@example.com", "192.0.2.1"), InquiryRateLimitExceeded);
      await db.$executeRaw`UPDATE "InquiryRateLimit" SET "expiresAt" = CURRENT_TIMESTAMP - INTERVAL '1 second'`;
      await db.$executeRaw`
        INSERT INTO "InquiryRateLimit" VALUES ('old', 1, CURRENT_TIMESTAMP - INTERVAL '1 hour')
      `;
      await reserve("person@example.com", "192.0.2.1");
      const rows = await db.$queryRaw<{ key: string; count: number }[]>`SELECT "key", "count" FROM "InquiryRateLimit"`;
      assert.equal(rows.length, 3);
      assert.ok(rows.every((row) => row.count === 1));
      assert.ok(rows.every((row) => !row.key.includes("person@example.com") && !row.key.includes("192.0.2.1")));
    });
  } finally {
    await db.$disconnect();
  }
});
