import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

const ProductTableSkeleton = ({ rows = 8 }) => {
  return (
    <>
      {[...Array(rows)].map((_, i) => (
        <TableRow key={i}>
          {/* S/N */}
          <TableCell>
            <Skeleton className="w-6 h-4" />
          </TableCell>

          {/* Image */}
          <TableCell>
            <Skeleton className="h-12 w-12 rounded-lg" />
          </TableCell>

          {/* Product Name & Variations count */}
          <TableCell>
            <div className="space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-20" />
            </div>
          </TableCell>

          {/* Brand */}
          <TableCell>
            <Skeleton className="h-4 w-24" />
          </TableCell>

          {/* Category */}
          <TableCell>
            <Skeleton className="h-4 w-24" />
          </TableCell>

          {/* Sub Category */}
          <TableCell>
            <Skeleton className="h-4 w-24" />
          </TableCell>

          {/* Model */}
          <TableCell>
            <Skeleton className="h-4 w-24" />
          </TableCell>

          {/* Price / Points */}
          <TableCell>
            <div className="space-y-1">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-3 w-32" />
            </div>
          </TableCell>

          {/* Product Type */}
          <TableCell>
            <Skeleton className="h-6 w-20 rounded-full" />
          </TableCell>

          {/* Status */}
          <TableCell className="text-center">
            <Skeleton className="h-6 w-24 rounded-full mx-auto" />
          </TableCell>

          {/* Action */}
          <TableCell>
            <div className="flex justify-center gap-2">
              <Skeleton className="w-8 h-8 rounded-md" />
              <Skeleton className="w-8 h-8 rounded-md" />
              <Skeleton className="w-8 h-8 rounded-md" />
            </div>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};

export default ProductTableSkeleton;
