import React from "react";
import PrimaryButton from "../../../../components/ui/PrimaryButton";

const BulkActionBar = ({ selectedCount, onSetActive, onSetBlocked }) => {
  if (selectedCount === 0) return null;

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2 bg-gray-50 p-3 rounded-md border">
      <p className="text-sm text-gray-700">{selectedCount} selected</p>

      <PrimaryButton variant="success" size="sm" onClick={onSetActive}>
        Re-send
      </PrimaryButton>

      <PrimaryButton variant="danger" size="sm" onClick={onSetBlocked}>
        Cancel
      </PrimaryButton>
    </div>
  );
};

export default BulkActionBar;
