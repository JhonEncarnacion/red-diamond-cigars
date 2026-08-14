const PLACEHOLDER_IMAGES = new Set([
  "/images/cigar-placeholder-image.png",
  "/images/cigar-placeholder.png",
]);

const PRODUCT_IMAGES: Record<string, string> = {
  "red-diamond-red-label": "/images/products/red-label.webp",
  "red-diamond-blue-label": "/images/products/blue-label.webp",
  "red-diamond-gold-label": "/images/products/gold-label.webp",
};

type ProductImageSource = {
  slug: string;
  image: string | null;
};

export function getProductImage(product: ProductImageSource) {
  if (product.image && !PLACEHOLDER_IMAGES.has(product.image)) {
    return product.image;
  }

  return (
    PRODUCT_IMAGES[product.slug] ?? "/images/cigar-placeholder-image.png"
  );
}
