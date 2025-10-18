import React from "react";

const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 rounded-md ${className}`}></div>
);

const ProfileSkeleton = () => {
  return (
    <div className="space-y-4 max-w-[650px]">
      {/* Profile Card Skeleton */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pt-4 shadow-md">
        <Skeleton className="w-full h-[9rem] rounded-sm" /> {/* Cover */}
        <div className="relative -top-10 left-6 flex items-center gap-4">
          <Skeleton className="w-24 h-24 rounded-full border-4 border-white shadow-md" />
          <div>
            <Skeleton className="w-40 h-5 mb-2" />
            <Skeleton className="w-24 h-4" />
          </div>
        </div>
        <div className="flex justify-end mb-2">
          <Skeleton className="w-28 h-8 rounded-xl" />
        </div>
      </div>

      {/* Owner Info Card Skeleton */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-6 pt-5 shadow-md">
        <Skeleton className="w-32 h-5 mb-3" />
        <div className="border-t border-gray-300 mb-3"></div>
        <div className="space-y-3">
          {Array.from({ length: 7 }).map((_, idx) => (
            <div key={idx} className="flex justify-between">
              <Skeleton className="w-24 h-4" />
              <Skeleton className="w-40 h-4" />
            </div>
          ))}
        </div>
      </div>

      {/* Password Update Skeleton */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-6 py-5 shadow-md">
        <Skeleton className="w-36 h-5 mb-3" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx}>
              <Skeleton className="w-32 h-4 mb-2" />
              <Skeleton className="w-full h-10" />
            </div>
          ))}
          <Skeleton className="w-36 h-10 rounded-lg mt-3" />
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
