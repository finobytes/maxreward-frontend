import React from "react";
import PrimaryButton from "../../../../components/ui/PrimaryButton";
import { Download } from "lucide-react";

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

      <PrimaryButton variant="danger" size="sm" onClick={onSetActive}>
        Delete
      </PrimaryButton>

      <PrimaryButton variant="success" size="sm" onClick={onSetBlocked}>
        Approve
      </PrimaryButton>

      <PrimaryButton variant="danger" size="sm" onClick={onSetSuspended}>
        Reject
      </PrimaryButton>
      <PrimaryButton variant="success" size="sm" onClick={onDelete}>
        <Download size={20} /> Export CSV
      </PrimaryButton>
    </div>
  );
};

export default BulkActionBar;
