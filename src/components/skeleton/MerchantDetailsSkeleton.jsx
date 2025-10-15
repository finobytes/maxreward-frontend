import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import ComponentCard from "@/components/common/ComponentCard";

const MerchantDetailsSkeleton = () => {
  return (
    <div className="animate-in fade-in duration-300 space-y-6">
      {/* Breadcrumb placeholder */}
      <div className="h-4 w-40 bg-gray-100 rounded"></div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Column */}
        <div className="space-y-4">
          {/* Profile Header */}
          <ComponentCard>
            <div className="relative">
              {/* Banner */}
              <Skeleton className="h-36 w-full rounded-xl" />
              <div className="absolute -bottom-10 left-6 flex items-center gap-4">
                <Skeleton className="h-20 w-20 rounded-full ring-4 ring-white" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-3 w-28" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            </div>
            <div className="pt-14 flex flex-wrap gap-4 justify-start">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 bg-gray-50 border rounded-lg px-4 py-3"
                >
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <div>
                    <Skeleton className="h-3 w-16 mb-1" />
                    <Skeleton className="h-4 w-10" />
                  </div>
                </div>
              ))}
            </div>
          </ComponentCard>

          {/* Personal Info */}
          <ComponentCard>
            <Skeleton className="h-5 w-32 mb-4" />
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="flex justify-between items-center border-b border-gray-100 py-2"
              >
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-40" />
              </div>
            ))}
          </ComponentCard>

          {/* Active Referrals */}
          <ComponentCard>
            <div className="flex justify-between mb-4">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-6 w-6 rounded" />
                </div>
              ))}
            </div>
          </ComponentCard>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Tabs */}
          <ComponentCard>
            <div className="flex items-center gap-3 mb-6">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-8 w-24 rounded-lg" />
              ))}
            </div>

            {/* Tab Content */}
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="flex justify-between items-center border-b border-gray-100 pb-2"
                >
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
          </ComponentCard>
        </div>
      </div>
    </div>
  );
};

export default MerchantDetailsSkeleton;
