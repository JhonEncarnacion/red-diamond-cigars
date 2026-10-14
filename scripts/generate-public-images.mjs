import { readdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const imageRoot = path.join(root, "public", "images");
const supportedImage = /\.(avif|gif|jpe?g|png|webp)$/i;

function collect(directory, prefix = "/images") {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const filePath = path.join(directory, entry.name);
    const imagePath = `${prefix}/${entry.name}`;
    if (entry.isDirectory()) return collect(filePath, imagePath);
    return entry.isFile() && supportedImage.test(entry.name) ? [imagePath] : [];
  });
}

const images = collect(imageRoot).sort();
if (!images.includes("/images/cigar-placeholder-image.png")) {
  throw new Error("The product placeholder image is missing.");
}
writeFileSync(path.join(root, "lib", "public-images.json"), JSON.stringify(images, null, 2) + "\n");
console.log(`Indexed ${images.length} local images.`);
