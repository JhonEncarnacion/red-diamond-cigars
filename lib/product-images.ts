import publicImages from "./public-images.json";

export const PRODUCT_PLACEHOLDER_IMAGE = "/images/cigar-placeholder-image.png";
const availableImages = new Set<string>(publicImages);
const PLACEHOLDER_IMAGES = new Set([
  PRODUCT_PLACEHOLDER_IMAGE,
  "/images/cigar-placeholder-image.png",
]);

const PRODUCT_IMAGES: Record<string, string> = {
  "toro-habano-corojo-red": "/images/products/toro-habano-corojo-red.webp",
  "toro-habano-ecuador-black": "/images/products/toro-habano-ecuador-black.webp",
  "maduro-san-andres-gold": "/images/products/maduro-san-andres-gold.webp",
};

export function getProductImageError(image: string): string | undefined {
  if (!image) return undefined;

  if (!image.startsWith("/images/") || !/\.(avif|gif|jpe?g|png|webp)$/i.test(image)) {
    return "Use a local image path starting with /images/ (PNG, JPG, JPEG, WebP, GIF, or AVIF), or leave it blank.";
  }

  if (!availableImages.has(image)) {
    return "This image is not available. Choose a file in public/images, or leave the image path blank.";
  }
}

type ProductImageSource = {
  slug: string;
  image: string | null;
};

export function getProductImage(product: ProductImageSource) {
  const image = product.image?.trim();
  if (image && !PLACEHOLDER_IMAGES.has(image)) {
    return availableImages.has(image) ? image : PRODUCT_PLACEHOLDER_IMAGE;
  }

  const fallback = PRODUCT_IMAGES[product.slug];
  return fallback && availableImages.has(fallback)
    ? fallback
    : PRODUCT_PLACEHOLDER_IMAGE;
}
