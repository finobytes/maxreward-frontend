import React from "react";
import { cn } from "../../lib/utils";
import { Link } from "react-router";

const VARIANTS = {
  primary: "bg-brand-600 text-white hover:bg-brand-500 focus:ring-brand-600",
  secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400",
  danger: "bg-red-600 text-white hover:bg-red-500 focus:ring-red-600",
  success: "bg-green-600 text-white hover:bg-green-500 focus:ring-green-600",
  warning: "bg-yellow-500 text-white hover:bg-yellow-400 focus:ring-yellow-500",
  accent: "bg-purple-600 text-white hover:bg-purple-500 focus:ring-purple-600",
};

const SIZES = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

const PrimaryButton = ({
  children,
  variant = "primary",
  size = "md",
  to,
  onClick,
  type = "button",
  ...props
}) => {
  const classes = cn(
    "inline-flex items-center justify-center gap-x-2 rounded-md shadow focus:outline-none focus:ring-1 transition-colors",
    VARIANTS[variant],
    SIZES[size]
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes} {...props}>
      {children}
    </button>
  );
};

export default PrimaryButton;
