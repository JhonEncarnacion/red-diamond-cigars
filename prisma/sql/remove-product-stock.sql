-- Run after all deployments use the schema without stock. This permanently removes old counts.
ALTER TABLE "Product" DROP COLUMN IF EXISTS "stock";
