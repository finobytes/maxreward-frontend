import React from "react";
import { cn } from "../../../lib/utils";

const Input = ({
  type = "text",
  id,
  name,
  placeholder,
  value,
  onChange,
  className = "",
  min,
  max,
  step,
  disabled = false,
  success = false,
  error = false,
  hint,
}) => {
  let inputClasses = cn(
    "h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3",
    disabled
      ? "text-gray-500 border-gray-300 opacity-40 bg-gray-100 cursor-not-allowed"
      : error
      ? "border-error-500 focus:border-error-300 focus:ring-error-500/20"
      : success
      ? "border-success-500 focus:border-success-300 focus:ring-success-500/20"
      : "bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20",
    className
  );

  return (
    <div className="relative">
      <input
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className={inputClasses}
      />

      {hint && (
        <p
          className={cn(
            "mt-1.5 text-xs",
            error
              ? "text-error-500"
              : success
              ? "text-success-500"
              : "text-gray-500"
          )}
        >
          {hint}
        </p>
      )}
    </div>
  );
};

export default Input;
