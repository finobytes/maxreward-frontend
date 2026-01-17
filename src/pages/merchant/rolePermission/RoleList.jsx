import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PageBreadcrumb from "../../../components/common/PageBreadcrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import PrimaryButton from "../../../components/ui/PrimaryButton";
import { toast } from "sonner";
import { z } from "zod";
import {
  useCreateRoleMutation,
  useGetRolesQuery,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
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

const roleSchema = z.object({
  name: z.string().min(2, "Role name is required"),
});

const RoleList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingRoleId, setDeletingRoleId] = useState(null);
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);

  const { data: rolesData, isLoading: isLoadingRoles } = useGetRolesQuery({
    page,
    per_page: perPage,
  });
  const [createRole, { isLoading: isCreating }] = useCreateRoleMutation();
  const [updateRole, { isLoading: isUpdating }] = useUpdateRoleMutation();
  const [deleteRole, { isLoading: isDeleting }] = useDeleteRoleMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (formData) => {
    try {
      let res;
      const payload = { ...formData, guard_name: "merchant" };

      if (editingRole) {
        res = await updateRole({ id: editingRole.id, data: payload }).unwrap();
      } else {
        res = await createRole(payload).unwrap();
      }

      if (res?.success) {
        toast.success(
          res?.message || `Role ${editingRole ? "updated" : "created"} successfully!`
        );
        reset();
        setIsModalOpen(false);
        setEditingRole(null);
      } else {
        toast.error(
          res?.message || `Failed to ${editingRole ? "update" : "create"} role`
        );
      }
    } catch (err) {
      console.error(`${editingRole ? "Update" : "Create"} Failed:`, err);
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

  const handleEdit = (role) => {
    setEditingRole(role);
    reset({
      name: role.name,
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    setDeletingRoleId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingRoleId) return;

    try {
      const res = await deleteRole(deletingRoleId).unwrap();
      if (res?.success) {
        toast.success(res?.message || "Role deleted successfully!");
        setIsDeleteModalOpen(false);
        setDeletingRoleId(null);
      } else {
        toast.error(res?.message || "Failed to delete role");
      }
    } catch (err) {
      console.error("Delete Failed:", err);
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };

  const roles = rolesData?.data?.merchant || [];

  return (
    <div>
      <PageBreadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: "Role Permission", to: "/merchant/role-permission" },
        ]}
      />

      <ComponentCard
        title="Role List"
        headerAction={
          <PrimaryButton
            onClick={() => {
              setEditingRole(null);
              reset({ name: "" });
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create New Role
          </PrimaryButton>
        }
      >
        {isLoadingRoles ? (
          <div className="text-center py-8">Loading roles...</div>
        ) : roles.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No roles found. Create a new role to get started.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Role Name</TableHead>
                <TableHead>Guard Type</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell>{role.id}</TableCell>
                  <TableCell className="font-medium">{role.name}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {role.guard_name}
                    </span>
                  </TableCell>
                  <TableCell>
                    {role.permissions?.length > 0 ? (
                      <span className="text-sm text-gray-600">
                        {role.permissions.length} permission
                        {role.permissions.length > 1 ? "s" : ""}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">
                        No permissions
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(role.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(role)}
                        className="p-2 hover:bg-gray-100 rounded"
                        title="Edit Role"
                      >
                        <Pencil className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(role.id)}
                        className="p-2 hover:bg-gray-100 rounded"
                        title="Delete Role"
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

      <Dialog
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) {
            setEditingRole(null);
            reset({ name: "" });
          }
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingRole ? "Edit Role" : "Create New Role"}
            </DialogTitle>
          </DialogHeader>
          <hr className="my-2" />

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
              <div>
                <Label htmlFor="name">Role Name</Label>
                <Input
                  type="text"
                  id="name"
                  placeholder="Enter role name (e.g., manager, supervisor)"
                  {...register("name")}
                  error={!!errors.name}
                  hint={errors.name?.message}
                />
              </div>
            </div>

            <DialogFooter className="mt-6">
              <PrimaryButton
                variant="secondary"
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingRole(null);
                  reset({ name: "" });
                }}
              >
                Cancel
              </PrimaryButton>
              <PrimaryButton type="submit" disabled={isCreating || isUpdating}>
                {editingRole
                  ? isUpdating
                    ? "Updating..."
                    : "Update Role"
                  : isCreating
                  ? "Creating..."
                  : "Create Role"}
              </PrimaryButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <div className="flex flex-col items-center">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>

              <DialogTitle className="text-xl mt-2">Delete Role</DialogTitle>
              <DialogDescription className="text-center mt-2">
                Are you sure you want to delete this role? This action is
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

export default RoleList;
