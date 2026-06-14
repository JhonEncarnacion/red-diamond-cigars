import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProductArchiveButton } from "@/components/admin/ProductArchiveButton";
import { requireAdmin } from "@/lib/admin-auth";

export default async function AdminProductsPage() {
  await requireAdmin();

  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Admin
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight">Products</h1>

          <p className="mt-4 text-muted-foreground">
            Manage the cigar catalog, stock levels, and product visibility.
          </p>
        </div>

        <Button asChild>
          <Link href="/admin/products/new">Add product</Link>
        </Button>
      </div>

      <div className="mt-10 rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cigar</TableHead>
              <TableHead>Strength</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-8 text-center text-muted-foreground"
                >
                  No products yet.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <div className="relative h-14 w-14 overflow-hidden rounded-md bg-muted">
                        <Image
                          src={product.image ?? "/images/cigar-placeholder.png"}
                          alt={product.name}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      </div>

                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {product.origin ?? "Origin not listed"}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>{product.strength}</TableCell>

                  <TableCell>{product.size ?? "Not listed"}</TableCell>

                  <TableCell>
                    <Badge
                      variant={product.stock <= 10 ? "destructive" : "outline"}
                    >
                      {product.stock} left
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <Badge variant={product.isActive ? "outline" : "secondary"}>
                      {product.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/cigars/${product.slug}`}
                        className="text-sm font-medium underline-offset-4 hover:underline"
                      >
                        View
                      </Link>

                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="text-sm font-medium underline-offset-4 hover:underline"
                      >
                        Edit
                      </Link>

                      <ProductArchiveButton
                        productId={product.id}
                        isActive={product.isActive}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
