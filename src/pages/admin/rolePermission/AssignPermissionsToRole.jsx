import { useState, useMemo } from "react";
import { toast } from "sonner";
import PageBreadcrumb from "../../../components/common/PageBreadcrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import Label from "../../../components/form/Label";
import Select from "@/components/form/Select";
import PrimaryButton from "../../../components/ui/PrimaryButton";
import { Checkbox } from "@/components/ui/checkbox";
import {
  useGetAllRolesQuery,
  useGetAllPermissionsQuery,
  useAssignPermissionsToRoleMutation,
} from "../../../redux/features/admin/rolePermission/rolePermissionApi";
import { Search, CheckSquare, Square, Loader2, Shield } from "lucide-react";

const normalizePermissionParts = (permissionName) => {
  const parts = permissionName.split(".");
  if (
    parts.length >= 3 &&
    ["admin", "merchant", "member"].includes(parts[0])
  ) {
    return parts.slice(1);
  }
  return parts;
};

const AssignPermissionsToRole = () => {
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const selectedGuard = "admin";

  // API Hooks
  const { data: rolesData, isLoading: isLoadingRoles } = useGetAllRolesQuery();
  const { data: permissionsData, isLoading: isLoadingPermissions } =
    useGetAllPermissionsQuery();
  const [assignPermissions, { isLoading: isAssigning }] =
    useAssignPermissionsToRoleMutation();


    console.log("rolesData--------", rolesData);

  // Get roles based on selected guard
  const roles = useMemo(() => {
    if (!rolesData?.data) return [];
    return rolesData.data[selectedGuard] || [];
  }, [rolesData, selectedGuard]);

  // Get permissions based on selected guard
  const permissions = useMemo(() => {
    if (!permissionsData?.data) return [];
    return permissionsData.data[selectedGuard] || [];
  }, [permissionsData, selectedGuard]);

  // Get selected role details
  const selectedRole = useMemo(() => {
    if (!selectedRoleId || !roles.length) return null;
    return roles.find((role) => role.id === parseInt(selectedRoleId));
  }, [selectedRoleId, roles]);

  // Filter permissions by search query
  const filteredPermissions = useMemo(() => {
    if (!searchQuery.trim()) return permissions;
    return permissions.filter((permission) =>
      permission.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [permissions, searchQuery]);

  const filteredPermissionNames = useMemo(
    () => filteredPermissions.map((permission) => permission.name),
    [filteredPermissions]
  );

  const allFilteredSelected = useMemo(() => {
    if (filteredPermissionNames.length === 0) return false;
    return filteredPermissionNames.every((name) =>
      selectedPermissions.includes(name)
    );
  }, [filteredPermissionNames, selectedPermissions]);

  // Group permissions by category (section)
  const groupedPermissions = useMemo(() => {
    const groups = {};

    filteredPermissions.forEach((permission) => {
      // Extract category from permission name (e.g., "admin.product.index" -> "product")
      const parts = normalizePermissionParts(permission.name);
      const category = parts.length > 1 ? parts[0] : "others";

      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(permission);
    });

    return groups;
  }, [filteredPermissions]);

  // Initialize selected permissions when role changes
  const handleRoleChange = (e) => {
    const roleId = e.target.value;
    setSelectedRoleId(roleId);

    // Pre-select existing permissions for this role
    const role = roles.find((r) => r.id === parseInt(roleId));
    if (role?.permissions) {
      setSelectedPermissions(role.permissions.map((p) => p.name));
    } else {
      setSelectedPermissions([]);
    }
  };

  // Handle permission checkbox toggle
  const handlePermissionToggle = (permissionName, checked) => {
    setSelectedPermissions((prev) => {
      const exists = prev.includes(permissionName);
      if (checked) {
        return exists ? prev : [...prev, permissionName];
      }
      return exists ? prev.filter((p) => p !== permissionName) : prev;
    });
  };

  // Select/Deselect all permissions in a category
  const handleCategoryToggle = (category, checked) => {
    const categoryPermissions = groupedPermissions[category].map((p) => p.name);

    if (checked === true) {
      setSelectedPermissions((prev) => [
        ...new Set([...prev, ...categoryPermissions]),
      ]);
      return;
    }

    setSelectedPermissions((prev) =>
      prev.filter((p) => !categoryPermissions.includes(p))
    );
  };

  // Select/Deselect all permissions
  const handleSelectAllChange = (checked) => {
    if (checked === true) {
      setSelectedPermissions((prev) => [
        ...new Set([...prev, ...filteredPermissionNames]),
      ]);
      return;
    }

    setSelectedPermissions((prev) =>
      prev.filter((name) => !filteredPermissionNames.includes(name))
    );
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();


    console.log("selectedPermissions:::::", selectedPermissions);


    console.log("selectedRoleId:::::", selectedRoleId);

    if (!selectedRoleId) {
      toast.error("Please select a role");
      return;
    }

    if (selectedPermissions.length === 0) {
      toast.error("Please select at least one permission");
      return;
    }

    try {
      const res = await assignPermissions({
        roleId: parseInt(selectedRoleId, 10),
        permissions: selectedPermissions,
      }).unwrap();

      if (res?.success) {
        toast.success(
          res?.message ||
            `${selectedPermissions.length} permissions assigned successfully!`
        );
      } else {
        toast.error(res?.message || "Failed to assign permissions");
      }
    } catch (err) {
      console.error("Assign Permissions Failed:", err);
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div>
      <PageBreadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: "Role Permission", to: "/admin/role-permission" },
          { label: "Assign Permissions to Role" },
        ]}
      />

      <ComponentCard
        title="Assign Permissions to Role"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Role Selection Section */}
          <div className="grid grid-cols-1 gap-4 p-4 bg-gray-50 rounded-lg border">
            {/* Role Selection */}
            <div>
              <Label htmlFor="role">Select Role</Label>
              <Select
                id="role"
                value={selectedRoleId}
                onChange={handleRoleChange}
                disabled={isLoadingRoles || roles.length === 0}
                options={[
                  { value: "", label: "-- Select a Role --" },
                  ...roles.map((role) => ({
                    value: role.id.toString(),
                    label: `${role.name} (${role.permissions?.length || 0} permissions)`,
                  })),
                ]}
              />
            </div>
          </div>

          {/* Selected Role Info */}
          {selectedRole && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-blue-900">
                    {selectedRole.name}
                  </h3>
                  <p className="text-sm text-blue-700">
                    {/* Guard: <span className="font-medium">{selectedRole.guard_name}</span> | */}
                    Current Permissions:{" "}
                    <span className="font-medium">
                      {selectedRole.permissions?.length || 0}
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-blue-700">
                    New Selection:{" "}
                    <span className="text-lg font-bold text-blue-900">
                      {selectedPermissions.length}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Permissions Selection Section */}
          {selectedRoleId && (
            <div className="space-y-4">
              {/* Search and Select All */}
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search permissions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <label className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg">
                  <Checkbox
                    checked={allFilteredSelected}
                    onCheckedChange={handleSelectAllChange}
                    disabled={filteredPermissionNames.length === 0}
                  />
                  <span>
                    Select All ({filteredPermissions.length})
                  </span>
                </label>
              </div>

              {/* Permissions List */}
              {isLoadingPermissions ? (
                <div className="text-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-400" />
                  <p className="text-sm text-gray-500 mt-2">Loading permissions...</p>
                </div>
              ) : Object.keys(groupedPermissions).length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No permissions found
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(groupedPermissions).map(([category, perms]) => {
                    const allSelected = perms.every((p) =>
                      selectedPermissions.includes(p.name)
                    );
                    const someSelected = perms.some((p) =>
                      selectedPermissions.includes(p.name)
                    );

                    return (
                      <div
                        key={category}
                        className="border border-gray-200 rounded-lg overflow-hidden"
                      >
                        {/* Category Header */}
                        <div
                          className={`px-4 py-3 transition-colors ${
                            allSelected
                              ? "bg-blue-100 border-blue-300"
                              : someSelected
                              ? "bg-blue-50"
                              : "bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Checkbox
                                checked={allSelected}
                                onCheckedChange={(checked) =>
                                  handleCategoryToggle(category, checked)
                                }
                                className={
                                  someSelected && !allSelected
                                    ? "data-[state=checked]:bg-blue-500"
                                    : ""
                                }
                              />
                              <h4 className="font-semibold text-gray-900 capitalize">
                                {category}
                              </h4>
                            </div>
                            <span className="text-sm text-gray-600">
                              {perms.filter((p) => selectedPermissions.includes(p.name)).length} / {perms.length} selected
                            </span>
                          </div>
                        </div>

                        {/* Permissions in Category */}
                        <div className="p-4 bg-white grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {perms.map((permission) => {
                            const checkboxId = `perm-${permission.id}`;
                            return (
                              <div
                                key={permission.id}
                                className="flex items-start gap-2 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                              >
                                <Checkbox
                                  id={checkboxId}
                                  checked={selectedPermissions.includes(permission.name)}
                                  onCheckedChange={(checked) =>
                                    handlePermissionToggle(permission.name, checked)
                                  }
                                  className="mt-0.5"
                                />
                                <Label htmlFor={checkboxId} className="flex-1 min-w-0 cursor-pointer">
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {normalizePermissionParts(permission.name).slice(-1)[0]}
                                  </p>
                                  {/* <p className="text-xs text-gray-500 truncate">
                                    {permission.name}
                                  </p> */}
                                </Label>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Submit Button */}
          {selectedRoleId && (
            <div className="flex justify-end gap-3 pt-4 border-t">
              <PrimaryButton
                type="button"
                variant="secondary"
                onClick={() => {
                  setSelectedRoleId("");
                  setSelectedPermissions([]);
                  setSearchQuery("");
                }}
              >
                Cancel
              </PrimaryButton>
              <PrimaryButton type="submit" disabled={isAssigning}>
                {isAssigning ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Assigning...
                  </>
                ) : (
                  `Assign ${selectedPermissions.length} Permission${
                    selectedPermissions.length !== 1 ? "s" : ""
                  }`
                )}
              </PrimaryButton>
            </div>
          )}
        </form>
      </ComponentCard>
    </div>
  );
};

export default AssignPermissionsToRole;
