import React from "react";

const VoucherFromSkeleton = () => {
  return (
    <div className="mt-[70px] space-y-6 animate-pulse p-2">
      {/* Page Header Skeleton */}
      <div className="h-6 w-48 bg-gray-200 rounded"></div>

      {/* Denomination Skeletons */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-gray-300"></div>
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
              <div className="flex justify-between items-center border rounded-lg px-2 py-1 w-56">
                <div className="h-4 w-4 bg-gray-300 rounded"></div>
                <div className="h-4 w-6 bg-gray-200 rounded"></div>
                <div className="h-4 w-4 bg-gray-300 rounded"></div>
              </div>
            </div>
          ))}

          {/* Payment Method */}
          <div className="mt-6">
            <div className="h-4 w-36 bg-gray-200 rounded mb-3"></div>
            <div className="flex items-center gap-6">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-gray-300"></div>
                  <div className="h-4 w-16 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Voucher Type */}
          <div className="mt-6">
            <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
            <div className="h-10 w-48 bg-gray-100 rounded-md"></div>
          </div>

          {/* Equivalent Points */}
          <div className="mt-6">
            <div className="h-4 w-40 bg-gray-200 rounded mb-2"></div>
            <div className="h-10 w-48 bg-gray-100 rounded-md"></div>
          </div>
        </div>

        {/* Right Section Placeholder */}
        <div className="space-y-5">
          {[...Array(5)].map((_, i) => (
            <div key={i}>
              <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
              <div className="h-10 w-full bg-gray-100 rounded-md"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VoucherFromSkeleton;
