import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  PencilLine,
  Trash2Icon,
  Plus,
  Loader,
  AlertTriangle,
} from "lucide-react";
import DropdownSelect from "../../../../components/ui/dropdown/DropdownSelect";
import PrimaryButton from "../../../../components/ui/PrimaryButton";
import InputField from "../../../../components/form/input/InputField";
import Pagination from "../../../../components/table/Pagination";
import PageBreadcrumb from "../../../../components/common/PageBreadcrumb";
import MerchantStaffSkeleton from "../../../../components/skeleton/MerchantStaffSkeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import { useAttribute } from "../../../../redux/features/admin/attribute/useAttribute";
import HasPermission from "@/components/common/HasPermission";
import {
  setSearch,
  setPage,
  setPerPage,
  resetFilters,
} from "../../../../redux/features/admin/attribute/attributeSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "../../../../components/ui/dialog";
import { toast } from "sonner";
import SearchInput from "../../../../components/form/form-elements/SearchInput";

const useDebounced = (value, delay = 400) => {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
};

const Attribute = () => {
  const dispatch = useDispatch();
  const { search, per_page } = useSelector((s) => s.attribute);

  const [localSearch, setLocalSearch] = useState(search || "");
  const debouncedSearch = useDebounced(localSearch, 450);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    dispatch(setSearch(debouncedSearch));
  }, [debouncedSearch]);

  const {
    data: attributes,
    pagination: meta,
    isLoading,
    isFetching,
    isError,
    formData,
    editId,
    actions: {
      setFormData,
      handleSubmit,
      handleEdit,
      handleDelete,
      resetFilters: resetAllFilters,
    },
  } = useAttribute();

  const handlePageChange = (p) => dispatch(setPage(p));
  const handlePerPageChange = (n) => dispatch(setPerPage(n));

  const openCreateModal = () => {
    setFormData({
      name: "",
      slug: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    handleEdit(item);
    setIsModalOpen(true);
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      await handleSubmit(e);
      toast.success(
        editId
          ? "Attribute updated successfully!"
          : "Attribute created successfully!",
      );
      setIsModalOpen(false);
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  const openDeleteModal = (id) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);

    try {
      await handleDelete(deleteId);
      toast.success("Attribute deleted successfully!");
      setIsDeleteModalOpen(false);
      setDeleteId(null);
    } catch (error) {
      toast.error("Failed to delete attribute");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div>
      <PageBreadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: "E-Commerce" },
          { label: "Attribute" },
        ]}
      />

      <div className="rounded-xl border bg-white p-4 relative">
        {isFetching && !isLoading && (
          <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-sm flex items-center justify-center rounded-xl">
            <Loader className="w-6 h-6 animate-spin text-gray-500" />
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <SearchInput
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search attribute..."
          />

          <div className="flex items-center gap-3">
            <HasPermission required="admin.e-commerce.attribute.create">
              <PrimaryButton variant="primary" onClick={openCreateModal}>
                <Plus size={16} /> Create
              </PrimaryButton>
            </HasPermission>

            <DropdownSelect
              value={per_page}
              onChange={(val) => handlePerPageChange(Number(val))}
              options={[
                { label: "10", value: 10 },
                { label: "20", value: 20 },
                { label: "50", value: 50 },
              ]}
            />

            <PrimaryButton
              variant="secondary"
              onClick={() => {
                resetAllFilters();
                setLocalSearch("");
              }}
            >
              Clear
            </PrimaryButton>
          </div>
        </div>

        {/* Table */}
        <div className="mt-4 overflow-x-auto">
          {isLoading ? (
            <MerchantStaffSkeleton rows={8} cols={3} />
          ) : isError ? (
            <div className="p-6 text-center text-red-500">
              Failed to load attributes.
            </div>
          ) : !attributes?.data?.length ? (
            <div className="p-6 text-center text-gray-500">
              No attributes found.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>S/N</TableHead>
                  <TableHead>Name</TableHead>
                  {/* <TableHead>Slug</TableHead> */}
                  <TableHead>Created At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {attributes?.data?.map((item, idx) => (
                  <TableRow key={item.id}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell className="capitalize">{item.name}</TableCell>
                    {/* <TableCell>{item.slug}</TableCell> */}

                    <TableCell>
                      {new Date(item.created_at).toLocaleDateString()}
                    </TableCell>

                    <TableCell>
                      <div className="flex gap-2">
                        <HasPermission required="admin.e-commerce.attribute.edit">
                          <button
                            onClick={() => openEditModal(item)}
                            className="p-2 rounded-md bg-blue-100 text-blue-600 hover:bg-blue-200"
                          >
                            <PencilLine size={16} />
                          </button>
                        </HasPermission>

                        <HasPermission required="admin.e-commerce.attribute.delete">
                          <button
                            onClick={() => openDeleteModal(item.id)}
                            className="p-2 rounded-md bg-red-100 text-red-600 hover:bg-red-200"
                          >
                            <Trash2Icon size={16} />
                          </button>
                        </HasPermission>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {meta && (
          <Pagination
            currentPage={meta.current_page}
            totalPages={meta.last_page}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      {/* Create / Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editId ? "Edit Attribute" : "Create Attribute"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={submitForm} className="space-y-4 mt-3">
            <div>
              <label className="text-sm font-medium">Attribute Name</label>
              <InputField
                type="text"
                value={formData.name}
                required
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter attribute name"
              />
            </div>

            {/* <div>
              <label className="text-sm font-medium">Slug</label>
              <InputField
                type="text"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                placeholder="Enter slug (optional)"
              />
            </div> */}

            <div className="flex justify-end gap-3">
              <PrimaryButton
                type="button"
                variant="secondary"
                onClick={() => !formLoading && setIsModalOpen(false)}
                disabled={formLoading}
              >
                Cancel
              </PrimaryButton>

              <PrimaryButton
                type="submit"
                variant="primary"
                disabled={formLoading}
              >
                {formLoading ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : editId ? (
                  "Update"
                ) : (
                  "Create"
                )}
              </PrimaryButton>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <div className="flex flex-col items-center">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>

              <DialogTitle className="text-xl mt-2">
                Delete Attribute
              </DialogTitle>
              <DialogDescription className="text-center mt-2">
                Are you sure you want to delete this attribute? This action is
                permanent and cannot be undone.
              </DialogDescription>
            </div>
          </DialogHeader>

          <DialogFooter className="mt-4">
            <PrimaryButton
              variant="secondary"
              onClick={() => !deleteLoading && setIsDeleteModalOpen(false)}
              disabled={deleteLoading}
            >
              Cancel
            </PrimaryButton>

            <PrimaryButton
              variant="danger"
              onClick={confirmDelete}
              disabled={deleteLoading}
            >
              {deleteLoading ? (
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

export default Attribute;
