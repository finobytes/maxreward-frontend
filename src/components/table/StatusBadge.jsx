import React from "react";

const StatusBadge = ({ status, children }) => {
  const styles = {
    active: "bg-green-100 text-green-700",
    Inactive: "bg-red-100 text-red-700",
    Blocked: "bg-red-100 text-red-700",
    Suspended: "bg-yellow-100 text-yellow-700",
    Rejected: "bg-red-100 text-red-700",
    Registered: "bg-green-100 text-green-700",
    Pending: "bg-yellow-100 text-yellow-700",
    "Max Voucher": "bg-blue-100 text-blue-700",
    "Refer Voucher": "bg-purple-100 text-purple-700",
    Completed: "bg-green-100 text-green-700",
    Failed: "bg-red-100 text-red-700",
    Online: "bg-indigo-100 text-indigo-700",
    Manual: "bg-gray-100 text-gray-700",
  };
  return (
    <span
      className={`px-3 py-1 text-xs font-medium rounded-full ${
        styles[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {children || status}
    </span>
  );
};

export default StatusBadge;
