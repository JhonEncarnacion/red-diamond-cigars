-- Apply before deploying the matching application. Preserves all inquiry records.
BEGIN;
LOCK TABLE "Product", "Inquiry" IN ACCESS EXCLUSIVE MODE;
ALTER TABLE "Inquiry" ADD COLUMN IF NOT EXISTS "productOriginalId" TEXT;
ALTER TABLE "Inquiry" ADD COLUMN IF NOT EXISTS "productName" TEXT;
ALTER TABLE "Inquiry" ADD COLUMN IF NOT EXISTS "productDescription" TEXT;
ALTER TABLE "Inquiry" ADD COLUMN IF NOT EXISTS "productStrength" TEXT;
ALTER TABLE "Inquiry" ADD COLUMN IF NOT EXISTS "productSize" TEXT;
ALTER TABLE "Inquiry" ADD COLUMN IF NOT EXISTS "productWrapper" TEXT;
UPDATE "Inquiry" AS i SET
  "productOriginalId" = p."id",
  "productName" = p."name",
  "productDescription" = p."description",
  "productStrength" = p."strength",
  "productSize" = p."size",
  "productWrapper" = p."wrapper"
FROM "Product" AS p
WHERE i."productId" = p."id" AND i."productName" IS NULL;
ALTER TABLE "Inquiry" ALTER COLUMN "productId" DROP NOT NULL;
ALTER TABLE "Inquiry" DROP CONSTRAINT IF EXISTS "Inquiry_productId_fkey";
ALTER TABLE "Inquiry" ADD CONSTRAINT "Inquiry_productId_fkey"
  FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;
