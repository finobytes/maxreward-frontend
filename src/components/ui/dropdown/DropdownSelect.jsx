import { ChevronDown } from "lucide-react";
import React from "react";

const DropdownSelect = ({ options = [], value, onChange }) => {
  return (
    <div className="relative inline-block">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none rounded-md bg-brand-600 text-white py-2.5 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 size-4 text-white"
      />
    </div>
  );
};

export default DropdownSelect;
