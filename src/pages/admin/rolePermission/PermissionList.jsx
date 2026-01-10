import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PageBreadcrumb from "../../../components/common/PageBreadcrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import PrimaryButton from "../../../components/ui/PrimaryButton";
import Select from "@/components/form/Select";
import { toast } from "sonner";
import { z } from "zod";
import {
  useCreatePermissionMutation,
  useGetPermissionsQuery,
  useUpdatePermissionMutation,
  useDeletePermissionMutation,
  useGetSectionsQuery,
  useGetActionsQuery,
} from "../../../redux/features/admin/rolePermission/rolePermissionApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2, Plus, AlertTriangle, Loader } from "lucide-react";

// Schema Validation (Zod)
const permissionSchema = z.object({
  name: z.string().min(2, "Permission name is required"),
  guard_name: z.enum(["admin", "merchant", "member"], {
    errorMap: () => ({ message: "Please select a valid guard type" }),
  }),
  section: z.string().optional(),
  action: z.string().optional(),
});

const PermissionList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPermission, setEditingPermission] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingPermissionId, setDeletingPermissionId] = useState(null);
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);

  // API Hooks
  const { data: permissionsData, isLoading: isLoadingPermissions } = useGetPermissionsQuery({
    page,
    per_page: perPage,
  });
  const { data: sectionsData } = useGetSectionsQuery();
  const { data: actionsData } = useGetActionsQuery();
  const [createPermission, { isLoading: isCreating }] = useCreatePermissionMutation();
  const [updatePermission, { isLoading: isUpdating }] = useUpdatePermissionMutation();
  const [deletePermission, { isLoading: isDeleting }] = useDeletePermissionMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(permissionSchema),
    defaultValues: {
      name: "",
      guard_name: "admin",
      section: "",
      action: "",
    },
  });

  // Watch form values
  const watchGuardName = watch("guard_name");
  const watchSection = watch("section");
  const watchAction = watch("action");

  // Auto-generate permission name when section and action are selected
  useEffect(() => {
    if (watchGuardName && watchSection && watchAction) {
      let generatedName;

      // generatedName = `${watchGuardName}.${watchSection}.${watchAction}`;

      if (watchGuardName === "admin") {
        generatedName = `${watchGuardName}.${watchSection}.${watchAction}`.toLowerCase();
      } else {
        // For merchant and other guards, exclude guard name
        generatedName = `${watchSection}.${watchAction}`.toLowerCase();
      }
      setValue("name", generatedName);
    }
  }, [watchGuardName, watchSection, watchAction, setValue]);

  // Form Submit (Create or Update)
  const onSubmit = async (formData) => {
    try {
      let res;

      // Only send name and guard_name to API
      const apiData = {
        name: formData.name,
        guard_name: formData.guard_name,
      };

      if (editingPermission) {
        // Update existing permission
        res = await updatePermission({ id: editingPermission.id, data: apiData }).unwrap();
      } else {
        // Create new permission
        res = await createPermission(apiData).unwrap();
      }

      if (res?.success) {
        toast.success(res?.message || `Permission ${editingPermission ? 'updated' : 'created'} successfully!`);
        reset();
        setIsModalOpen(false);
        setEditingPermission(null);
      } else {
        toast.error(res?.message || `Failed to ${editingPermission ? 'update' : 'create'} permission`);
      }
    } catch (err) {
      console.error(`${editingPermission ? 'Update' : 'Create'} Failed:`, err);
      const validationErrors = err?.data?.errors;
      if (validationErrors) {
        Object.entries(validationErrors).forEach(([field, messages]) =>
          toast.error(`${field}: ${messages.join(", ")}`)
        );
      } else {
        toast.error(err?.data?.message || "Something went wrong!");
      }
    }
  };

  // Edit Permission
  const handleEdit = (permission) => {
    setEditingPermission(permission);

    // Parse permission name to extract section and action
    const nameParts = permission.name.split('.');
    let section = "";
    let action = "";

    if (permission.guard_name === "admin" && nameParts.length === 3) {
      // Format: admin.section.action
      section = nameParts[1];
      action = nameParts[2];
    } else if (nameParts.length === 2) {
      // Format: section.action (for merchant/member)
      section = nameParts[0];
      action = nameParts[1];
    }

    reset({
      name: permission.name,
      guard_name: permission.guard_name,
      section: section,
      action: action,
    });
    setIsModalOpen(true);
  };

  // Open Delete Modal
  const handleDeleteClick = (id) => {
    setDeletingPermissionId(id);
    setIsDeleteModalOpen(true);
  };

  // Confirm Delete
  const confirmDelete = async () => {
    if (!deletingPermissionId) return;

    try {
      const res = await deletePermission(deletingPermissionId).unwrap();
      if (res?.success) {
        toast.success(res?.message || "Permission deleted successfully!");
        setIsDeleteModalOpen(false);
        setDeletingPermissionId(null);
      } else {
        toast.error(res?.message || "Failed to delete permission");
      }
    } catch (err) {
      console.error("Delete Failed:", err);
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };

  // Extract all permissions from grouped data
  const getPermissionsFromData = () => {
    if (!permissionsData?.data) return [];

    const data = permissionsData.data;
    const allPermissions = [];

    // Combine permissions from all guard types
    if (data.merchant) allPermissions.push(...data.merchant);
    if (data.admin) allPermissions.push(...data.admin);
    if (data.member) allPermissions.push(...data.member);

    return allPermissions;
  };

  const permissions = getPermissionsFromData();

  return (
    <div>
      <PageBreadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: "Role Permission", to: "/admin/role-permission" },
          // { label: "Permission List" },
        ]}
      />

      <ComponentCard
        title="Permission List"
        headerAction={
          <PrimaryButton onClick={() => {
            setEditingPermission(null);
            reset({ name: "", guard_name: "admin", section: "", action: "" });
            setIsModalOpen(true);
          }} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create New Permission
          </PrimaryButton>
        }
      >
        {isLoadingPermissions ? (
          <div className="text-center py-8">Loading permissions...</div>
        ) : permissions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No permissions found. Create a new permission to get started.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Permission Name</TableHead>
                <TableHead>Guard Type</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {permissions.map((permission) => (
                <TableRow key={permission.id}>
                  <TableCell>{permission.id}</TableCell>
                  <TableCell className="font-medium">{permission.name}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {permission.guard_name}
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(permission.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(permission)}
                        className="p-2 hover:bg-gray-100 rounded"
                        title="Edit Permission"
                      >
                        <Pencil className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(permission.id)}
                        className="p-2 hover:bg-gray-100 rounded"
                        title="Delete Permission"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </ComponentCard>

      {/* Create/Edit Permission Modal */}
      <Dialog open={isModalOpen} onOpenChange={(open) => {
        setIsModalOpen(open);
        if (!open) {
          setEditingPermission(null);
          reset({ name: "", guard_name: "merchant", section: "", action: "" });
        }
      }}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingPermission ? 'Edit Permission' : 'Create New Permission'}</DialogTitle>
          </DialogHeader>
          <hr className="my-2" />

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
              {/* Guard Name */}
              <div>
                <Label htmlFor="guard_name">Guard Type</Label>
                <Select
                  {...register("guard_name")}
                  error={!!errors.guard_name}
                  hint={errors.guard_name?.message}
                  options={[
                    { value: "admin", label: "Admin" },
                    { value: "merchant", label: "Merchant" },
                    // { value: "member", label: "Member" },
                  ]}
                />
              </div>

              {/* Section Dropdown */}
              <div>
                <Label htmlFor="section">Section</Label>
                <Select
                  {...register("section")}
                  error={!!errors.section}
                  hint={errors.section?.message}
                  options={
                    sectionsData?.data?.data?.map((section) => ({
                      value: section.name,
                      label: section.display_name || section.name,
                    })) || []
                  }
                />
              </div>

              {/* Action Dropdown */}
              <div>
                <Label htmlFor="action">Action</Label>
                <Select
                  {...register("action")}
                  error={!!errors.action}
                  hint={errors.action?.message}
                  options={
                    actionsData?.data?.data?.map((action) => ({
                      value: action.name,
                      label: action.display_name || action.name,
                    })) || []
                  }
                />
              </div>

              {/* Permission Name (Auto-generated) */}
              <div>
                <Label htmlFor="name">
                  Permission Name
                  <span className="text-xs text-gray-500 ml-2">(Auto-generated)</span>
                </Label>
                <Input
                  type="text"
                  id="name"
                  placeholder="Enter permission name (e.g., admin.product.view)"
                  {...register("name")}
                  error={!!errors.name}
                  hint={errors.name?.message}
                  readOnly
                  className="bg-gray-100"
                />
              </div>
            </div>



            <DialogFooter className="mt-6">
              <PrimaryButton
                variant="secondary"
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingPermission(null);
                  reset({ name: "", guard_name: "merchant", section: "", action: "" });
                }}
              >
                Cancel
              </PrimaryButton>
              <PrimaryButton type="submit" disabled={isCreating || isUpdating}>
                {editingPermission
                  ? (isUpdating ? "Updating..." : "Update Permission")
                  : (isCreating ? "Creating..." : "Create Permission")
                }
              </PrimaryButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <div className="flex flex-col items-center">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>

              <DialogTitle className="text-xl mt-2">
                Delete Permission
              </DialogTitle>
              <DialogDescription className="text-center mt-2">
                Are you sure you want to delete this permission? This action is
                permanent and cannot be undone.
              </DialogDescription>
            </div>
          </DialogHeader>

          <DialogFooter className="mt-4">
            <PrimaryButton
              variant="secondary"
              onClick={() => !isDeleting && setIsDeleteModalOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </PrimaryButton>

            <PrimaryButton
              variant="danger"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                "Delete"
              )}
            </PrimaryButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PermissionList;
