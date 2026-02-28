import { Navigate } from "react-router";
import { useSelector } from "react-redux";
import { useVerifyMeQuery } from "../../redux/features/auth/authApi";
import { NAV_CONFIG } from "../../config/navConfig";
import Loader from "../shared/Loader";

/**
 * Smart redirect component for admin index route.
 * Checks user permissions and redirects to the first accessible page.
 * - Main admin (type: "admin") → /admin/dashboard
 * - Staff with dashboard permission → /admin/dashboard
 * - Staff without dashboard permission → first accessible nav item
 */
const AdminHomeRedirect = () => {
  const { user } = useSelector((state) => state.auth);
  const { data, isLoading } = useVerifyMeQuery(user?.role, {
    skip: !user?.role,
  });

  if (isLoading || !data) return <Loader />;

  // Main admin sees everything
  if (data?.type === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Extract permissions from roles[].permissions[].name
  const userPermissions = [];
  if (data?.roles && Array.isArray(data.roles)) {
    data.roles.forEach((roleObj) => {
      if (roleObj.permissions && Array.isArray(roleObj.permissions)) {
        roleObj.permissions.forEach((perm) => {
          if (perm.name && !userPermissions.includes(perm.name)) {
            userPermissions.push(perm.name);
          }
        });
      }
    });
  }

  // Check if user has permission (exact or prefix match)
  const hasPermission = (requiredPerm) => {
    return userPermissions.some(
      (userPerm) =>
        userPerm === requiredPerm || userPerm.startsWith(requiredPerm + "."),
    );
  };

  // Find first accessible path from navConfig
  const findFirstAccessiblePath = (items) => {
    for (const item of items) {
      // Skip Logout and Profile (they have no permission or are utility items)
      if (item.name === "Logout" || item.name === "Profile") continue;

      // If item has a direct path and user has permission (or no permission required)
      if (item.path && (!item.permission || hasPermission(item.permission))) {
        return item.path;
      }

      // If item has subItems, search through them
      if (item.subItems) {
        for (const subItem of item.subItems) {
          if (
            subItem.path &&
            (!subItem.permission || hasPermission(subItem.permission))
          ) {
            return subItem.path;
          }
        }
      }
    }
    return null;
  };

  const adminNavItems = NAV_CONFIG.admin || [];
  const firstPath = findFirstAccessiblePath(adminNavItems);

  // Redirect to first accessible path, fallback to profile
  return <Navigate to={firstPath || "/admin/profile"} replace />;
};

export default AdminHomeRedirect;
