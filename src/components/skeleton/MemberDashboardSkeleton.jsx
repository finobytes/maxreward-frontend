import React from "react";

const MemberDashboardSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Title */}
      <div className="h-6 w-40 bg-gray-200 rounded-md" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left big card placeholder */}
        <div className="h-64 bg-gray-200 rounded-xl" />

        {/* Right cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-5 shadow-sm flex justify-between"
            >
              {/* Left skeleton */}
              <div className="space-y-3">
                <div className="h-6 w-6 bg-gray-200 rounded-full" />
                <div className="h-4 w-24 bg-gray-200 rounded-md" />
                <div className="h-6 w-20 bg-gray-200 rounded-md" />
                <div className="h-3 w-16 bg-gray-200 rounded-md" />
              </div>

              {/* Right chart skeleton */}
              <div className="w-20 h-14 bg-gray-200 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MemberDashboardSkeleton;
