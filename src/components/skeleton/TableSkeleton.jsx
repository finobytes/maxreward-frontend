import React from "react";

const TableSkeleton = ({ rows = 8, cols = 6 }) => {
  return (
    <tbody>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={rowIndex} className="animate-pulse border-b">
          {Array.from({ length: cols }).map((__, colIndex) => (
            <td key={colIndex} className="py-4 px-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
};

export default TableSkeleton;
