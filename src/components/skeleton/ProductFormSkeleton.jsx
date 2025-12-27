import React from "react";
import ComponentCard from "../common/ComponentCard";
import { Skeleton } from "@/components/ui/skeleton";

const ProductFormSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <Skeleton className="h-4 w-64" />
      </div>

      <div className="space-y-8">
        {/* Product Basic Info Skeleton */}
        <ComponentCard title={<Skeleton className="h-6 w-48" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="md:col-span-3 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>

            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            ))}
            <div className="md:col-span-3 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-24 w-full rounded-md" />
            </div>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            ))}
          </div>
        </ComponentCard>

        {/* Product Media Skeleton */}
        <ComponentCard title={<Skeleton className="h-6 w-32" />}>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
            <div className="border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center space-y-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        </ComponentCard>

        {/* Product Configuration Skeleton */}
        <ComponentCard title={<Skeleton className="h-6 w-32" />}>
          <div className="flex items-center justify-between border-b pb-4 mb-6">
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
            <Skeleton className="h-10 w-40 rounded-full" />
          </div>
          <div className="h-40 bg-gray-50 rounded-lg animate-pulse"></div>
        </ComponentCard>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-4 pb-12">
          <Skeleton className="h-10 w-24 rounded-lg" />
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default ProductFormSkeleton;
