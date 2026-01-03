import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

const ProductSkeleton = ({ rows = 10, cols = 6 }) => {
  return (
    <>
      {[...Array(rows)].map((_, i) => (
        <TableRow key={i}>
          <TableCell>
            <Skeleton className="w-4 h-4 rounded" />
          </TableCell>
          {[...Array(cols)].map((_, j) => (
            <TableCell key={j}>
              <Skeleton className="h-4 w-full" />
            </TableCell>
          ))}
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

export default ProductSkeleton;
