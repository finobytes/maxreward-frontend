import { useSelector } from "react-redux";
import { useVerifyMeQuery } from "../redux/features/auth/authApi";
import { useMemo } from "react";

export const usePermissions = () => {
  const { user } = useSelector((state) => state.auth);
  const role = user?.role;

  // Utilize cached data from verify me so we don't trigger extra API calls
  const { data, isLoading } = useVerifyMeQuery(role, {
    skip: !role,
  });

  const permissions = useMemo(() => {
    let userPermissions = [];

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

    if (data?.permissions && Array.isArray(data.permissions)) {
      data.permissions.forEach((perm) => {
        const permName = typeof perm === "string" ? perm : perm?.name;
        if (permName && !userPermissions.includes(permName)) {
          userPermissions.push(permName);
        }
      });
    }

    return userPermissions;
  }, [data]);

  // Main admins typically have a 'type' property set to 'admin'
  const isMainAdmin = role === "admin" && data?.type === "admin";
  const isMember = role === "member";

  /**
   * Check if the user has the required action permission
   */
  const hasPermission = (requiredPerm) => {
    // 1. If it's the master admin or generic member, allow bypass
    if (isMainAdmin || isMember) return true;

    if (!requiredPerm) return false;

    // 2. Wrap into array so we can accept either String or Array inputs
    const permsToCheck = Array.isArray(requiredPerm)
      ? requiredPerm
      : [requiredPerm];

    // 3. User must match at least ONE of the requested permissions to pass
    return permsToCheck.some((perm) =>
      permissions.some((p) => p === perm || p.startsWith(perm + ".")),
    );
  };

  return { permissions, hasPermission, isLoading, isMainAdmin };
};
