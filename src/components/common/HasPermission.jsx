import React from "react";
import { usePermissions } from "../../hooks/usePermissions";

/**
 * A wrapper component to conditionally render UI based on user permissions
 *
 * Usage:
 * <HasPermission required="admin.accounts.voucher.create">
 *    <button>Create Voucher</button>
 * </HasPermission>
 *
 * @param {string|string[]} required - The required permission string(s)
 * @param {React.ReactNode} fallback - An optional fallback component if unauthorized
 */
const HasPermission = ({ required, children, fallback = null }) => {
  const { hasPermission, isLoading } = usePermissions();

  if (isLoading) {
    return null; // hide layout entirely until loaded, or render placeholder if suitable.
  }

  // Pass checks if they match the permissions array
  if (hasPermission(required)) {
    return <>{children}</>;
  }

  // Unauthorized display
  return fallback;
};

export default HasPermission;
