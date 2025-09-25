import React from "react";
import { cn } from "../../lib/utils";

const Label = ({ htmlFor, children, className }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        "mb-1.5 block text-sm font-medium text-gray-700",
        className
      )}
    >
      {children}
    </label>
  );
};

export default Label;
