import React from "react";

const SkeletonField = ({ height = "40px", width = "100%" }) => {
  return (
    <div
      className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-md"
      style={{ height, width }}
    />
  );
};

export default SkeletonField;
