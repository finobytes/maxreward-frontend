import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type = "text", ...props }, ref) {
  return (
    <input
      ref={ref}
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs",
        "placeholder:text-gray-400 text-gray-800 bg-transparent",
        "focus:outline-hidden focus:ring-3 focus:border-brand-300 focus:ring-brand-500/20",
        "disabled:opacity-40 disabled:bg-gray-100 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  );
}

const ForwardedInput = React.forwardRef(Input);
ForwardedInput.displayName = "Input";

export { ForwardedInput as Input };
