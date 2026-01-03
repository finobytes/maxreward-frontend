import React from "react";
import ComponentCard from "../common/ComponentCard";
import { Skeleton } from "@/components/ui/skeleton";

const ProductDetailsSkeleton = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Breadcrumb Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Images */}
        <div className="lg:col-span-1 space-y-4">
          {/* Main Image */}
          <div className="aspect-square bg-white border rounded-xl overflow-hidden shadow-sm p-4 relative">
            <Skeleton className="w-full h-full rounded-lg" />
          </div>

          {/* Quick Image Gallery */}
          <div className="grid grid-cols-4 gap-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-lg" />
            ))}
          </div>
        </div>

        {/* Right Column: Key Details */}
        <div className="lg:col-span-2 space-y-6">
          <ComponentCard>
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-4 border-b pb-4 mb-4">
              <div className="space-y-3 w-full">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-8 w-1/2 rounded" />
                  <Skeleton className="h-6 w-24 rounded-full" />
                </div>

                <div className="flex items-center gap-4 mt-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-40" />
                </div>
              </div>
              <Skeleton className="h-8 w-24 rounded-full" />
            </div>

            {/* Price & Points Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-6 w-24" />
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="mt-6 space-y-3">
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>

            {/* Classification */}
            <div className="mt-6 space-y-3">
              <Skeleton className="h-6 w-32 mb-3" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="space-y-2 p-3 bg-gray-50 rounded-lg border border-gray-100"
                  >
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ))}
              </div>
            </div>
          </ComponentCard>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsSkeleton;
