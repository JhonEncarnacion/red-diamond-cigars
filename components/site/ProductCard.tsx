import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/generated/prisma/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-4/3 bg-muted">
        <Image
          src={product.image ?? "/images/cigar-placeholder.png"}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>

      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-sm text-muted-foreground">
              {product.origin} · {product.size}
            </p>
          </div>

          <span className="rounded-full border px-2 py-1 text-xs">
            {product.strength}
          </span>
        </div>
      </CardHeader>

      <CardContent>
        <p className="line-clamp-3 text-sm text-muted-foreground">
          {product.description}
        </p>
      </CardContent>

      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/cigars/${product.slug}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
