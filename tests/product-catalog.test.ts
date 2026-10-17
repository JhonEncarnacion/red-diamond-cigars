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

function mutationActions(options: { exists?: boolean; inquiries?: number; deny?: boolean; collision?: boolean } = {}) {
  const events: string[] = [];
  let saved: Record<string, unknown> | undefined;
  const product = { id: "existing", slug: "original-address" };
  const tx = {
    $queryRaw: async () => { events.push("lock"); return options.exists === false ? [] : [product]; },
    inquiry: { count: async () => { events.push("count"); return options.inquiries ?? 0; } },
    product: { delete: async () => { events.push("delete"); return product; } },
  };
  const dependencies: Record<string, unknown> = {
    "next/cache": { revalidatePath() { events.push("revalidate"); } },
    "@/lib/prisma": { prisma: {
      $transaction: async (callback: (transaction: typeof tx) => Promise<unknown>, config: {isolationLevel: string}) => {
        assert.equal(config.isolationLevel, "ReadCommitted");
        events.push("transaction");
        const result = await callback(tx);
        events.push("commit");
        return result;
      },
      product: {
        findUnique: async ({where}: {where: {id?: string; slug?: string}}) => {
          events.push("find");
          if (where.slug && options.collision) return {id: "other", slug: where.slug};
          return options.exists === false ? null : product;
        },
        update: async ({data}: {data: Record<string, unknown>}) => {
          saved = data; return {...product, ...data};
        },
      },
    } },
    "@/lib/validators": { productSchema },
    "@/lib/product-slug": { generateProductSlug },
    "@/lib/admin-auth": { requireAdmin: async () => { events.push("authorize"); if (options.deny) throw new Error("Denied"); } },
  };
  const source = ts.transpileModule(readFileSync("app/actions/products.ts", "utf8"), {
    compilerOptions: {module: ts.ModuleKind.CommonJS},
  }).outputText;
  type Result = Promise<{success: boolean; message: string}>;
  const exports = {} as {
    deleteProduct: (id: string) => Result;
    updateProduct: (id: string, input: typeof values) => Result;
  };
  new Function("require", "exports", source)((name: string) => {
    assert.ok(name in dependencies);
    return dependencies[name];
  }, exports);
  return {...exports, events, saved: () => saved};
}

test("editing a name preserves its URL and ignores supplied slugs", async () => {
  const action = mutationActions();
  assert.equal((await action.updateProduct("existing", values)).success, true);
  assert.equal(action.saved()?.name, values.name);
  assert.equal("slug" in action.saved()!, false);
});

test("deletion locks the product, checks inquiries, deletes, then invalidates pages", async () => {
  const action = mutationActions();
  assert.equal((await action.deleteProduct("existing")).success, true);
  assert.deepEqual(action.events.slice(0, 6), ["authorize", "transaction", "lock", "count", "delete", "commit"]);
  assert.ok(action.events.slice(6).every(event => event === "revalidate"));
});

test("products with inquiries and missing products are never deleted", async () => {
  for (const options of [{inquiries: 2}, {exists: false}]) {
    const action = mutationActions(options);
    assert.equal((await action.deleteProduct("existing")).success, false);
    assert.ok(!action.events.includes("delete"));
    assert.ok(!action.events.includes("revalidate"));
  }
});

test("unauthorized delete and update requests never reach the database", async () => {
  for (const operation of ["delete", "update"]) {
    const action = mutationActions({deny: true});
    await assert.rejects(operation === "delete"
      ? action.deleteProduct("existing")
      : action.updateProduct("existing", values), /Denied/);
    assert.deepEqual(action.events, ["authorize"]);
  }
});


test("renaming does not compete for another product's generated address", async () => {
  const action = mutationActions({collision: true});
  assert.equal((await action.updateProduct("existing", values)).success, true);
  assert.equal("slug" in action.saved()!, false);
  assert.equal(action.events.filter(event => event === "find").length, 1);
});

test("an invalid edited name does not save any changes", async () => {
  const action = mutationActions();
  assert.equal((await action.updateProduct("existing", {...values, name: ""})).success, false);
  assert.equal(action.saved(), undefined);
});
