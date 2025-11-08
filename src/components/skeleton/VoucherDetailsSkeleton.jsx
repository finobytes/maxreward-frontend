import React from "react";

const VoucherDetailsSkeleton = () => {
  return (
    <div className="animate-pulse space-y-6">
      {/* Voucher Overview Skeleton */}
      <div className="bg-white shadow-md border border-gray-100 rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-300 to-purple-300 p-5 h-24"></div>
        <div className="p-6 space-y-4">
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
          <div className="flex justify-between items-center">
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
            <div className="h-5 w-20 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Member Information Skeleton */}
      <div className="bg-white shadow-md border border-gray-100 rounded-2xl p-6">
        <div className="h-6 w-48 bg-gray-200 mb-6 rounded"></div>
        {[...Array(6)].map((_, i) => (
          <SkeletonRow key={i} />
        ))}
      </div>

      {/* Payment Info Skeleton */}
      <div className="bg-white shadow-md border border-gray-100 rounded-2xl p-6">
        <div className="h-6 w-56 bg-gray-200 mb-6 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </div>
          <div className="w-full max-w-sm h-40 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};

// 🔹 Small reusable skeleton row
const SkeletonRow = () => (
  <div className="flex justify-between items-center">
    <div className="h-4 w-32 bg-gray-200 rounded"></div>
    <div className="h-4 w-24 bg-gray-300 rounded"></div>
  </div>
);

export default VoucherDetailsSkeleton;
