import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { test } from "node:test";
import {
  getProductImage,
  PRODUCT_PLACEHOLDER_IMAGE,
} from "../lib/product-images";
import { productSchema } from "../lib/validators";
import publicImages from "../lib/public-images.json";
import { sampleProducts } from "../lib/sample-products";

const redImage = "/images/products/toro-habano-corojo-red.webp";
const validProduct = {
  name: "Test Cigar", slug: "test-cigar", description: "A test cigar description.",
  strength: "Medium", isActive: true,
};

test("available image index matches files shipped in public/images", () => {
  const files = readdirSync("public/images", { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile() && /\.(avif|gif|jpe?g|png|webp)$/i.test(entry.name))
    .map((entry) => `${entry.parentPath}/${entry.name}`.replace(/^public/, ""))
    .sort();
  assert.deepEqual(publicImages, files);
  assert.ok(existsSync(`public${PRODUCT_PLACEHOLDER_IMAGE}`));
});

test("valid and blank image paths pass product validation", () => {
  for (const image of [...publicImages, "", undefined]) {
    assert.equal(productSchema.safeParse({ ...validProduct, image }).success, true);
  }
  const parsed = productSchema.parse({ ...validProduct, image: ` ${redImage} ` });
  assert.equal(parsed.image, redImage);
});

test("invalid, external, missing, and traversal paths cannot be saved", () => {
  for (const image of [
    "cigar.jpg", "https://example.com/cigar.jpg", "//example.com/cigar.jpg",
    "/images/missing.png", "/images/products/red-label.webp",
    "/images/../secret.png", "/images/%2e%2e/secret.png",
    "/images/test.svg", `${redImage}?v=1`, `${redImage}#fragment`,
  ]) {
    const parsed = productSchema.safeParse({ ...validProduct, image });
    assert.equal(parsed.success, false, image);
    if (!parsed.success) assert.ok(parsed.error.issues.some((issue) => issue.path[0] === "image"));
    assert.equal(getProductImage({ slug: "test-cigar", image }), PRODUCT_PLACEHOLDER_IMAGE);
  }
});

test("existing invalid paths fall back and valid custom images are preserved", () => {
  assert.equal(getProductImage({ slug: "toro-habano-corojo-red", image: "cigar.jpg" }), PRODUCT_PLACEHOLDER_IMAGE);
  for (const image of publicImages) {
    assert.ok(publicImages.includes(getProductImage({ slug: "unknown", image })));
  }
  assert.equal(getProductImage({ slug: "unknown", image: redImage }), redImage);
  assert.equal(getProductImage({ slug: "toro-habano-corojo-red", image: null }), redImage);
  assert.equal(getProductImage({ slug: "unknown", image: null }), PRODUCT_PLACEHOLDER_IMAGE);
});

test("sample and seed image paths all exist", () => {
  for (const product of sampleProducts) assert.ok(existsSync(`public${product.image}`));
  const seed = readFileSync("prisma/seed.ts", "utf8");
  const paths = [...seed.matchAll(/image: "([^"]+)"/g)].map((match) => match[1]);
  assert.ok(paths.length > 0);
  for (const image of paths) assert.ok(publicImages.includes(image), image);
});


test("current cigar names and fallback images match the catalog", () => {
  const catalog = [
    ["Toro Habano Corojo Red", "toro-habano-corojo-red"],
    ["Toro Habano Ecuador Black", "toro-habano-ecuador-black"],
    ["Maduro San Andres Gold", "maduro-san-andres-gold"],
  ];
  const seed = readFileSync("prisma/seed.ts", "utf8");
  assert.equal(sampleProducts.length, catalog.length);
  for (const [name, slug] of catalog) {
    const image = `/images/products/${slug}.webp`;
    const sample = sampleProducts.find((product) => product.slug === slug);
    assert.equal(sample?.name, name);
    assert.equal(sample?.image, image);
    assert.equal(getProductImage({ slug, image: null }), image);
    assert.equal(getProductImage({ slug, image: PRODUCT_PLACEHOLDER_IMAGE }), image);
    assert.ok(seed.includes(`name: "${name}"`));
    assert.ok(seed.includes(`where: { slug: "${slug}" }`));
  }
});
