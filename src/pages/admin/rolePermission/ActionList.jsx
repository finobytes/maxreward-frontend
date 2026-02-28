import { useState } from "react";
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
  useCreateActionMutation,
  useGetActionsQuery,
  useUpdateActionMutation,
  useDeleteActionMutation,
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
import HasPermission from "@/components/common/HasPermission";

// Schema Validation (Zod)
const actionSchema = z.object({
  name: z.string().min(2, "Action name is required"),
  status: z.enum(["active", "inactive"], {
    errorMap: () => ({ message: "Please select a valid status" }),
  }),
});

const ActionList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAction, setEditingAction] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingActionId, setDeletingActionId] = useState(null);

  // API Hooks
  const { data: actionsData, isLoading: isLoadingActions } =
    useGetActionsQuery();
  const [createAction, { isLoading: isCreating }] = useCreateActionMutation();
  const [updateAction, { isLoading: isUpdating }] = useUpdateActionMutation();
  const [deleteAction, { isLoading: isDeleting }] = useDeleteActionMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(actionSchema),
    defaultValues: {
      name: "",
      status: "active",
    },
  });

  // Form Submit (Create or Update)
  const onSubmit = async (formData) => {
    try {
      let res;

      // Convert status string to boolean for API
      const payload = {
        ...formData,
        status: formData.status === "active" ? true : false,
      };

      if (editingAction) {
        // Update existing action
        res = await updateAction({
          id: editingAction.id,
          data: payload,
        }).unwrap();
      } else {
        // Create new action
        res = await createAction(payload).unwrap();
      }

      if (res?.success) {
        toast.success(
          res?.message ||
            `Action ${editingAction ? "updated" : "created"} successfully!`,
        );
        reset();
        setIsModalOpen(false);
        setEditingAction(null);
      } else {
        toast.error(
          res?.message ||
            `Failed to ${editingAction ? "update" : "create"} action`,
        );
      }
    } catch (err) {
      console.error(`${editingAction ? "Update" : "Create"} Failed:`, err);
      const validationErrors = err?.data?.errors;
      if (validationErrors) {
        Object.entries(validationErrors).forEach(([field, messages]) =>
          toast.error(`${field}: ${messages.join(", ")}`),
        );
      } else {
        toast.error(err?.data?.message || "Something went wrong!");
      }
    }
  };

  // Edit Action
  const handleEdit = (action) => {
    setEditingAction(action);
    reset({
      name: action.name,
      status:
        action.status === true || action.status === "active"
          ? "active"
          : "inactive",
    });
    setIsModalOpen(true);
  };

  // Open Delete Modal
  const handleDeleteClick = (id) => {
    setDeletingActionId(id);
    setIsDeleteModalOpen(true);
  };

  // Confirm Delete
  const confirmDelete = async () => {
    if (!deletingActionId) return;

    try {
      const res = await deleteAction(deletingActionId).unwrap();
      if (res?.success) {
        toast.success(res?.message || "Action deleted successfully!");
        setIsDeleteModalOpen(false);
        setDeletingActionId(null);
      } else {
        toast.error(res?.message || "Failed to delete action");
      }
    } catch (err) {
      console.error("Delete Failed:", err);
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };

  const actions = actionsData?.data?.data || [];

  return (
    <div>
      <PageBreadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: "Role Permission", to: "/admin/role-permission" },
        ]}
      />

      <ComponentCard
        title="Action List"
        headerAction={
          <HasPermission required="admin.role permission.role permission.create">
            <PrimaryButton
              onClick={() => {
                setEditingAction(null);
                reset({ name: "", status: "active" });
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create New Action
            </PrimaryButton>
          </HasPermission>
        }
      >
        {isLoadingActions ? (
          <div className="text-center py-8">Loading actions...</div>
        ) : actions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No actions found. Create a new action to get started.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Action Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {actions.map((action) => (
                <TableRow key={action.id}>
                  <TableCell>{action.id}</TableCell>
                  <TableCell className="font-medium">{action.name}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        action.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {action.status ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell>
                    {action.created_at
                      ? new Date(action.created_at).toLocaleDateString()
                      : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <HasPermission required="admin.role permission.role permission.edit">
                        <button
                          onClick={() => handleEdit(action)}
                          className="p-2 hover:bg-gray-100 rounded"
                          title="Edit Action"
                        >
                          <Pencil className="w-4 h-4 text-blue-600" />
                        </button>
                      </HasPermission>
                      <HasPermission required="admin.role permission.role permission.delete">
                        <button
                          onClick={() => handleDeleteClick(action.id)}
                          className="p-2 hover:bg-gray-100 rounded"
                          title="Delete Action"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </HasPermission>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </ComponentCard>

      {/* Create/Edit Action Modal */}
      <Dialog
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) {
            setEditingAction(null);
            reset({ name: "", status: "active" });
          }
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingAction ? "Edit Action" : "Create New Action"}
            </DialogTitle>
          </DialogHeader>
          <hr className="my-2" />

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
              {/* Action Name */}
              <div>
                <Label htmlFor="name">Action Name</Label>
                <Input
                  type="text"
                  id="name"
                  placeholder="Enter action name"
                  {...register("name")}
                  error={!!errors.name}
                  hint={errors.name?.message}
                />
              </div>

              {/* Status */}
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  {...register("status")}
                  error={!!errors.status}
                  hint={errors.status?.message}
                  options={[
                    { value: "active", label: "Active" },
                    { value: "inactive", label: "Inactive" },
                  ]}
                />
              </div>
            </div>

            <DialogFooter className="mt-6">
              <PrimaryButton
                variant="secondary"
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingAction(null);
                  reset({ name: "", status: "active" });
                }}
              >
                Cancel
              </PrimaryButton>
              <PrimaryButton type="submit" disabled={isCreating || isUpdating}>
                {editingAction
                  ? isUpdating
                    ? "Updating..."
                    : "Update Action"
                  : isCreating
                    ? "Creating..."
                    : "Create Action"}
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

              <DialogTitle className="text-xl mt-2">Delete Action</DialogTitle>
              <DialogDescription className="text-center mt-2">
                Are you sure you want to delete this action? This action is
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

export default ActionList;
