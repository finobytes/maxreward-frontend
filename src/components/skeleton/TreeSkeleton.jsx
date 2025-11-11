import React from "react";

const TreeSkeleton = () => {
  return (
    <div className="w-full h-[80vh] flex flex-col items-center justify-center gap-4">
      <div className="animate-pulse flex flex-col items-center gap-3">
        <div className="w-16 h-16 rounded-full bg-gray-200"></div>
        <div className="w-24 h-4 bg-gray-200 rounded"></div>
        <div className="w-16 h-3 bg-gray-200 rounded"></div>
      </div>

      <div className="flex gap-10 mt-10">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-gray-200"></div>
          <div className="w-20 h-4 bg-gray-200 rounded"></div>
        </div>

        <div className="animate-pulse flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-gray-200"></div>
          <div className="w-20 h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default TreeSkeleton;
