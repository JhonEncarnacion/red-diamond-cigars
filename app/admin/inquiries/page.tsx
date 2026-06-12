import { prisma } from "@/lib/prisma";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default async function AdminInquiriesPage() {
  const inquiries = await prisma.inquiry.findMany({
    include: {
      product: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div>
        <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Admin
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight">
          Cigar Inquiries
        </h1>
        <p className="mt-4 text-muted-foreground">
          View customer interest requests submitted through the cigar catalog.
        </p>
      </div>

      <div className="mt-10 rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Cigar</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {inquiries.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-8 text-center text-muted-foreground"
                >
                  No inquiries yet.
                </TableCell>
              </TableRow>
            ) : (
              inquiries.map((inquiry) => (
                <TableRow key={inquiry.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{inquiry.fullName}</p>
                      <p className="text-sm text-muted-foreground">
                        {inquiry.email}
                      </p>
                      {inquiry.phone && (
                        <p className="text-sm text-muted-foreground">
                          {inquiry.phone}
                        </p>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>{inquiry.product.name}</TableCell>

                  <TableCell>{inquiry.quantity}</TableCell>

                  <TableCell>{inquiry.location}</TableCell>

                  <TableCell>
                    <Badge variant="outline">{inquiry.status}</Badge>
                  </TableCell>

                  <TableCell>
                    {new Intl.DateTimeFormat("en", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }).format(inquiry.createdAt)}
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
