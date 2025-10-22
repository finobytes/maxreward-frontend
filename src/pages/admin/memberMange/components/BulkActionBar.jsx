import React from "react";
import PrimaryButton from "../../../../components/ui/PrimaryButton";

const BulkActionBar = ({
  selectedCount,
  onSetActive,
  onSetBlocked,
  onSetSuspended,
  onDelete,
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2 bg-gray-50 p-3 rounded-md border">
      <p className="text-sm text-gray-700">{selectedCount} selected</p>
      <PrimaryButton variant="danger" size="sm" onClick={onSetBlocked}>
        Set Blocked
      </PrimaryButton>
      <PrimaryButton variant="warning" size="sm" onClick={onSetSuspended}>
        Set Suspended
      </PrimaryButton>
    </div>
  );
};

export default BulkActionBar;
