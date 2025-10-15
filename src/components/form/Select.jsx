import { ChevronDownIcon } from "lucide-react";
import { cn } from "../../lib/utils";
import React from "react";

const Select = React.forwardRef(
  (
    {
      id,
      name,
      value,
      onChange,
      onBlur,
      options = [],
      placeholder = "Select an option",
      disabled = false,
      error = false,
      success = false,
      className = "",
      ...rest
    },
    ref
  ) => {
    const selectClasses = cn(
      "h-11 w-full rounded-lg border appearance-none px-4 pr-10 text-sm shadow-theme-xs focus:outline-hidden focus:ring-3",
      disabled
        ? "text-gray-500 border-gray-300 opacity-40 bg-gray-100 cursor-not-allowed"
        : error
        ? "border-error-500 focus:border-error-300 focus:ring-error-500/20"
        : success
        ? "border-success-500 focus:border-success-300 focus:ring-success-500/20"
        : "bg-transparent text-gray-800 border-gray-300 placeholder:text-gray-400 focus:border-brand-300 focus:ring-brand-500/20",
      className
    );

    return (
      <div className="relative">
        <select
          ref={ref}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          className={selectClasses}
          {...rest}
        >
          <option value="" disabled>
            {placeholder}
          </option>

          {options.map((opt, idx) => (
            <option key={idx} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <ChevronDownIcon
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-5 text-gray-400"
        />
      </div>
    );
  }
);

Select.displayName = "Select";
export default Select;
