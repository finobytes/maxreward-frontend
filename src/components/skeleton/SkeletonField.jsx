import React from "react";

const SkeletonField = ({ height = "42px", width = "100%" }) => {
  return (
    <div
      className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-md border border-gray-300 dark:border-gray-600"
      style={{
        height,
        width,
      }}
    />
  );
};

export default SkeletonField;
