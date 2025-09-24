import React from "react";

const StatusBadge = ({ status }) => {
  const styles = {
    Active: "bg-green-100 text-green-700",
    Blocked: "bg-red-100 text-red-700",
    Suspended: "bg-yellow-100 text-yellow-700",
  };
  return (
    <span
      className={`px-3 py-1 text-xs font-medium rounded-full ${styles[status]}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
