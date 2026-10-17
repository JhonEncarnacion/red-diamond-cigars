type SizeProduct = { name: string; size?: string | null; description: string };

export function formatProductSize(product: SizeProduct): string {
  const size = product.size?.trim() ?? "";
  const pattern = /\b(\d+(?:\.\d+)?)\s*[x×]\s*(\d+(?:\.\d+)?)\b/i;
  const dimensions = size.match(pattern) ?? product.description.match(pattern);
  const shape = size.replace(pattern, "").replace(/[–—-]/g, "").trim()
    || product.name.match(/\b(Toro|Robusto|Churchill|Corona|Gordo|Lancero)\b/i)?.[0]
    || "";
  if (!dimensions) return size || "Not listed";
  // Older descriptions store ring gauge first (56×6); display length first.
  const [first, second] = [Number(dimensions[1]), Number(dimensions[2])];
  const formatted = first > 20 && second <= 20
    ? `${dimensions[2]}x${dimensions[1]}`
    : `${dimensions[1]}x${dimensions[2]}`;
  return shape ? `${shape} – ${formatted}` : formatted;
}
