import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { Client } from "pg";
import ts from "typescript";
import { getInquiryProduct, snapshotInquiryProduct } from "../lib/inquiry-product";

type Result = Promise<{success: boolean; message: string}>;
function loadActions(file: string, prisma: unknown, deny = false) {
  const exports = {} as {deleteProduct: (id: string) => Result; deleteInquiry: (id: string) => Result};
  const source = ts.transpileModule(readFileSync(file, "utf8"), {compilerOptions: {module: ts.ModuleKind.CommonJS}}).outputText;
  new Function("require", "exports", source)((name: string) => {
    if (name === "@/lib/prisma") return {prisma};
    if (name === "@/lib/admin-auth") return {requireAdmin: async () => {if (deny) throw Error("Denied");}};
    if (name === "next/cache") return {revalidatePath() {}};
    return {};
  }, exports);
  return exports;
}

const product = {id: "p", name: "Original cigar", description: "Description 56×6", strength: "Mild", size: "Toro", wrapper: "Corojo"};

test("saved inquiry details survive edits or a missing catalog product", () => {
  const snapshot = snapshotInquiryProduct(product);
  const before = getInquiryProduct({...snapshot, product});
  assert.deepEqual(getInquiryProduct({...snapshot, product: null}), before);
  assert.deepEqual(getInquiryProduct({...snapshot, product: {...product, name: "Renamed"}}), before);
});

test("inquiry deletion requires admin access and deletes only the specified inquiry", async () => {
  const ids: string[] = [];
  const prisma = {inquiry: {deleteMany: async ({where}: {where: {id: string}}) => {ids.push(where.id); return {count: where.id === "missing" ? 0 : 1};}}};
  await assert.rejects(loadActions("app/actions/inquiries.ts", prisma, true).deleteInquiry("a"), /Denied/);
  assert.deepEqual(ids, []);
  const actions = loadActions("app/actions/inquiries.ts", prisma);
  assert.equal((await actions.deleteInquiry("a")).success, true);
  assert.equal((await actions.deleteInquiry("missing")).success, false);
  assert.deepEqual(ids, ["a", "missing"]);
});

// Explicit disposable database only; never use the application's DATABASE_URL.
test("PostgreSQL migration and independent deletion preserve customer history", {skip: !process.env.TEST_DATABASE_URL}, async () => {
  const db = new Client({connectionString: process.env.TEST_DATABASE_URL});
  await db.connect();
  const schema = `deletion_test_${Date.now()}`;
  try {
    await db.query(`CREATE SCHEMA "${schema}"`);
    await db.query(`SET search_path TO "${schema}"`);
    await db.query(`
      CREATE TABLE "Product" (id TEXT PRIMARY KEY, slug TEXT UNIQUE, name TEXT, description TEXT, strength TEXT, size TEXT, wrapper TEXT);
      CREATE TABLE "Inquiry" (id TEXT PRIMARY KEY, "productId" TEXT NOT NULL REFERENCES "Product"(id) ON DELETE CASCADE,
        "fullName" TEXT, message TEXT, "adminNotes" TEXT, status TEXT, "isArchived" BOOLEAN, "updatedAt" TIMESTAMP DEFAULT '2020-01-01');
      INSERT INTO "Product" VALUES ('p1','one','Original','Description 56×6','Mild','Toro','Corojo'), ('p2','two','Other','Description','Full','Toro','Habano');
      INSERT INTO "Inquiry" (id,"productId","fullName",message,"adminNotes",status,"isArchived") VALUES
        ('i1','p1','Customer A','Message A','Notes A','NEW',false),
        ('i2','p1','Customer B','Message B','Notes B','COMPLETED',true),
        ('i3','p2','Customer C','Message C','Notes C','NEW',false);
    `);
    const migration = readFileSync("prisma/sql/preserve-product-inquiries.sql", "utf8");
    await db.query(migration);
    await db.query(migration); // Repeatability must preserve existing history.
    const before = (await db.query('SELECT * FROM "Inquiry" ORDER BY id')).rows;
    assert.equal(before[0].productName, "Original");
    await db.query(`UPDATE "Product" SET name = 'Renamed' WHERE id = 'p1'`);
    const query = (parts: TemplateStringsArray, ...values: unknown[]) => db.query(parts.reduce((sql, part, index) => sql + (index ? `$${index}` : "") + part, ""), values);
    const tx = {
      $queryRaw: async (parts: TemplateStringsArray, ...values: unknown[]) => (await query(parts, ...values)).rows,
      $executeRaw: async (parts: TemplateStringsArray, ...values: unknown[]) => (await query(parts, ...values)).rowCount,
      product: {delete: async ({where}: {where: {id: string}}) => (await db.query('DELETE FROM "Product" WHERE id=$1 RETURNING *', [where.id])).rows[0]},
    };
    const prisma = {
      $transaction: async (fn: (transaction: typeof tx) => Promise<unknown>) => {
        await db.query('BEGIN');
        try {const result = await fn(tx); await db.query('COMMIT'); return result;}
        catch (error) {await db.query('ROLLBACK'); throw error;}
      },
      inquiry: {deleteMany: async ({where}: {where: {id: string}}) => ({count: (await db.query('DELETE FROM "Inquiry" WHERE id=$1', [where.id])).rowCount})},
    };
    assert.equal((await loadActions("app/actions/products.ts", prisma).deleteProduct("p1")).success, true);
    const after = (await db.query('SELECT * FROM "Inquiry" ORDER BY id')).rows;
    assert.deepEqual(after, before.map(row => row.productId === "p1" ? {...row, productId: null} : row));
    assert.equal((await loadActions("app/actions/inquiries.ts", prisma).deleteInquiry("i3")).success, true);
    assert.equal((await db.query('SELECT * FROM "Product" WHERE id=$1', ['p2'])).rowCount, 1);
    assert.equal((await db.query('SELECT * FROM "Inquiry"')).rowCount, 2);
    // The database foreign key independently preserves inquiries on direct deletion.
    await db.query(`INSERT INTO "Inquiry" (id,"productId") VALUES ('i4','p2'); DELETE FROM "Product" WHERE id='p2'`);
    assert.equal((await db.query(`SELECT "productId" FROM "Inquiry" WHERE id='i4'`)).rows[0].productId, null);
  } finally {
    await db.query('ROLLBACK');
    await db.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
    await db.end();
  }
});
