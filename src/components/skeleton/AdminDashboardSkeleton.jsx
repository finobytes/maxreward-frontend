import React from "react";

const AdminDashboardSkeleton = () => {
  return (
    <div className="animate-pulse">
      {/* Title Skeleton */}
      <div className="h-6 w-40 bg-gray-200 rounded mb-6"></div>

      {/* Top Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow p-5 flex flex-col gap-4"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
              <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
            </div>
            <div className="h-6 w-20 bg-gray-200 rounded"></div>
            <div className="h-3 w-16 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-100 rounded-lg"></div>
          </div>
        ))}
      </div>

      {/* Middle Section Skeleton */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 h-72 bg-gray-100 rounded-2xl"></div>
        <div className="lg:col-span-1 h-72 bg-gray-100 rounded-2xl"></div>
      </div>

      {/* Bottom Cards Skeleton */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-60 bg-gray-100 rounded-2xl"></div>
        ))}
      </div>

      {/* Audience / Member / Visitors */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-60 bg-gray-100 rounded-2xl"></div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboardSkeleton;
