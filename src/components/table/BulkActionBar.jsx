import React from "react";
import { Download, Trash2, Check, X } from "lucide-react";
import PrimaryButton from "../ui/PrimaryButton";

const ICONS = {
  export: Download,
  delete: Trash2,
  approve: Check,
  reject: X,
};

const BulkActionBar = ({ selectedCount = 0, actions = [] }) => {
  if (selectedCount === 0) return null;

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2 bg-gray-50 p-3 rounded-md border">
      <p className="text-sm text-gray-700">{selectedCount} selected</p>

      {actions.map((action, i) => {
        const Icon = ICONS[action.icon] || null;
        return (
          <PrimaryButton
            key={i}
            variant={action.variant || "primary"}
            size="sm"
            onClick={action.onClick}
          >
            {Icon && <Icon size={16} />}
            {action.label}
          </PrimaryButton>
        );
      })}
    </div>
  );
};

export default BulkActionBar;
