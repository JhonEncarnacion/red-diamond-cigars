import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import ts from "typescript";
import { generateProductSlug } from "../lib/product-slug";
import { formatProductSize } from "../lib/product-size";
import { productSchema } from "../lib/validators";

test("slugs normalize names, punctuation, spacing and accents", () => {
  assert.equal(generateProductSlug("Maduro Gold Premium"), "maduro-gold-premium");
  assert.equal(generateProductSlug("  San Andrés -- Gold! "), "san-andres-gold");
  assert.equal(generateProductSlug("Maker’s Toro"), "makers-toro");
  assert.equal(generateProductSlug(null), "");
  assert.equal(generateProductSlug("!!!"), "");
});

test("sizes preserve shape and display length before ring gauge", () => {
  for (const ring of [56, 54, 64]) {
    assert.equal(formatProductSize({name: "Toro", size: "Toro", description: `Capa – ${ring}×6`}), `Toro – 6x${ring}`);
  }
  assert.equal(formatProductSize({name: "Toro", size: "Toro – 6x56", description: "Old 54×6"}), "Toro – 6x56");
  assert.equal(formatProductSize({name: "Toro", size: null, description: "56x6"}), "Toro – 6x56");
  assert.equal(formatProductSize({name: "Cigar", size: "Robusto", description: "No dimensions"}), "Robusto");
  assert.equal(formatProductSize({name: "Cigar", description: "No dimensions"}), "Not listed");
});

const values = {name: "Maduro Gold Premium", slug: "untrusted-custom-slug", description: "A factual product description.", strength: "Medium", isActive: true};

test("products validate without an inventory field", () => {
  assert.equal(productSchema.safeParse(values).success, true);
  assert.equal("stock" in productSchema.shape, false);
});

function actions(existing: boolean) {
  let saved: Record<string, unknown> | undefined;
  let authorized = false;
  const prisma = {product: {
    findUnique: async () => { assert.ok(authorized); return existing ? {id: "existing"} : null; },
    create: async ({data}: {data: Record<string, unknown>}) => {saved = data; return {id: "new", ...data};},
  }};
  const dependencies: Record<string, unknown> = {
    "next/cache": {revalidatePath() {}},
    "@/lib/prisma": {prisma},
    "@/lib/validators": {productSchema},
    "@/lib/product-slug": {generateProductSlug},
    "@/lib/admin-auth": {requireAdmin: async () => { authorized = true; }},
  };
  const source = ts.transpileModule(readFileSync("app/actions/products.ts", "utf8"), {
    compilerOptions: {module: ts.ModuleKind.CommonJS},
  }).outputText;
  const exports: {createProduct?: (input: typeof values) => Promise<{success: boolean; message: string}>} = {};
  new Function("require", "exports", source)((name: string) => {
    assert.ok(name in dependencies, `Unexpected dependency ${name}`);
    return dependencies[name];
  }, exports);
  return {create: exports.createProduct!, saved: () => saved};
}

test("creation regenerates the slug on the server and saves no stock", async () => {
  const action = actions(false);
  assert.equal((await action.create(values)).success, true);
  assert.equal(action.saved()?.slug, "maduro-gold-premium");
  assert.equal("stock" in action.saved()!, false);
});

test("duplicate generated slugs and invalid names do not create products", async () => {
  const duplicate = actions(true);
  assert.equal((await duplicate.create(values)).success, false);
  assert.equal(duplicate.saved(), undefined);
  const invalid = actions(false);
  assert.equal((await invalid.create({...values, name: "!!!"})).success, false);
  assert.equal(invalid.saved(), undefined);
});
