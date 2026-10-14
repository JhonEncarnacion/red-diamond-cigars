-- Additive setup for existing databases managed with prisma db push.
CREATE TABLE IF NOT EXISTS "InquiryRateLimit" (
  "key" TEXT NOT NULL,
  "count" INTEGER NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "InquiryRateLimit_pkey" PRIMARY KEY ("key")
);

CREATE INDEX IF NOT EXISTS "InquiryRateLimit_expiresAt_idx"
  ON "InquiryRateLimit"("expiresAt");
