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
  useCreateSectionMutation,
  useGetSectionsQuery,
  useUpdateSectionMutation,
  useDeleteSectionMutation,
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
const sectionSchema = z.object({
  name: z.string().min(2, "Section name is required"),
  status: z.enum(["active", "inactive"], {
    errorMap: () => ({ message: "Please select a valid status" }),
  }),
});

const SectionList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingSectionId, setDeletingSectionId] = useState(null);

  // API Hooks
  const { data: sectionsData, isLoading: isLoadingSections } =
    useGetSectionsQuery();
  const [createSection, { isLoading: isCreating }] = useCreateSectionMutation();
  const [updateSection, { isLoading: isUpdating }] = useUpdateSectionMutation();
  const [deleteSection, { isLoading: isDeleting }] = useDeleteSectionMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(sectionSchema),
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

      if (editingSection) {
        // Update existing section
        res = await updateSection({
          id: editingSection.id,
          data: payload,
        }).unwrap();
      } else {
        // Create new section
        res = await createSection(payload).unwrap();
      }

      if (res?.success) {
        toast.success(
          res?.message ||
            `Section ${editingSection ? "updated" : "created"} successfully!`,
        );
        reset();
        setIsModalOpen(false);
        setEditingSection(null);
      } else {
        toast.error(
          res?.message ||
            `Failed to ${editingSection ? "update" : "create"} section`,
        );
      }
    } catch (err) {
      console.error(`${editingSection ? "Update" : "Create"} Failed:`, err);
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

  // Edit Section
  const handleEdit = (section) => {
    setEditingSection(section);
    reset({
      name: section.name,
      status:
        section.status === true || section.status === "active"
          ? "active"
          : "inactive",
    });
    setIsModalOpen(true);
  };

  // Open Delete Modal
  const handleDeleteClick = (id) => {
    setDeletingSectionId(id);
    setIsDeleteModalOpen(true);
  };

  // Confirm Delete
  const confirmDelete = async () => {
    if (!deletingSectionId) return;

    try {
      const res = await deleteSection(deletingSectionId).unwrap();
      if (res?.success) {
        toast.success(res?.message || "Section deleted successfully!");
        setIsDeleteModalOpen(false);
        setDeletingSectionId(null);
      } else {
        toast.error(res?.message || "Failed to delete section");
      }
    } catch (err) {
      console.error("Delete Failed:", err);
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };

  const sections = sectionsData?.data?.data || [];

  return (
    <div>
      <PageBreadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: "Role Permission", to: "/admin/role-permission" },
        ]}
      />

      <ComponentCard
        title="Section List"
        headerAction={
          <HasPermission required="admin.role permission.role permission.create">
            <PrimaryButton
              onClick={() => {
                setEditingSection(null);
                reset({ name: "", status: "active" });
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create New Section
            </PrimaryButton>
          </HasPermission>
        }
      >
        {isLoadingSections ? (
          <div className="text-center py-8">Loading sections...</div>
        ) : sections.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No sections found. Create a new section to get started.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Section Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sections.map((section) => (
                <TableRow key={section.id}>
                  <TableCell>{section.id}</TableCell>
                  <TableCell className="font-medium">{section.name}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        section.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {section.status ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell>
                    {section.created_at
                      ? new Date(section.created_at).toLocaleDateString()
                      : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <HasPermission required="admin.role permission.role permission.edit">
                        <button
                          onClick={() => handleEdit(section)}
                          className="p-2 hover:bg-gray-100 rounded"
                          title="Edit Section"
                        >
                          <Pencil className="w-4 h-4 text-blue-600" />
                        </button>
                      </HasPermission>
                      <HasPermission required="admin.role permission.role permission.delete">
                        <button
                          onClick={() => handleDeleteClick(section.id)}
                          className="p-2 hover:bg-gray-100 rounded"
                          title="Delete Section"
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

      {/* Create/Edit Section Modal */}
      <Dialog
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) {
            setEditingSection(null);
            reset({ name: "", status: "active" });
          }
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingSection ? "Edit Section" : "Create New Section"}
            </DialogTitle>
          </DialogHeader>
          <hr className="my-2" />

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
              {/* Section Name */}
              <div>
                <Label htmlFor="name">Section Name</Label>
                <Input
                  type="text"
                  id="name"
                  placeholder="Enter section name"
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
                  setEditingSection(null);
                  reset({ name: "", status: "active" });
                }}
              >
                Cancel
              </PrimaryButton>
              <PrimaryButton type="submit" disabled={isCreating || isUpdating}>
                {editingSection
                  ? isUpdating
                    ? "Updating..."
                    : "Update Section"
                  : isCreating
                    ? "Creating..."
                    : "Create Section"}
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

              <DialogTitle className="text-xl mt-2">Delete Section</DialogTitle>
              <DialogDescription className="text-center mt-2">
                Are you sure you want to delete this section? This action is
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

export default SectionList;
