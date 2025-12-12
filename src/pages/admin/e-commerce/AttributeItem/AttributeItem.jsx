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
import Select from "../../../../components/form/Select";
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
import { useAttributeItem } from "../../../../redux/features/admin/attributeItem/useAttributeItem";
import { useGetAllAttributesQuery } from "../../../../redux/features/admin/attribute/attributeApi";
import {
  setSearch,
  setPage,
  setPerPage,
  resetFilters,
} from "../../../../redux/features/admin/attributeItem/attributeItemSlice";
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

const AttributeItem = () => {
  const dispatch = useDispatch();
  const { search, per_page } = useSelector((s) => s.attributeItem);

  const [localSearch, setLocalSearch] = useState(search || "");
  const debouncedSearch = useDebounced(localSearch, 450);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { data: allAttributes } = useGetAllAttributesQuery();
  const attributes = allAttributes?.data?.attributes;

  useEffect(() => {
    dispatch(setSearch(debouncedSearch));
  }, [debouncedSearch]);

  const {
    data: attributeItems,
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
  } = useAttributeItem();

  const handlePageChange = (p) => dispatch(setPage(p));
  const handlePerPageChange = (n) => dispatch(setPerPage(n));

  const openCreateModal = () => {
    setFormData({
      attribute_id: "",
      name: "",
      slug: "",
      is_active: true,
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
          ? "Attribute Item updated successfully!"
          : "Attribute Item created successfully!"
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
      toast.success("Attribute Item deleted successfully!");
      setIsDeleteModalOpen(false);
      setDeleteId(null);
    } catch (error) {
      toast.error("Failed to delete attribute item");
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
          { label: "Attribute Item" },
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
            placeholder="Search attribute item..."
          />

          <div className="flex items-center gap-3">
            <PrimaryButton variant="primary" onClick={openCreateModal}>
              <Plus size={16} /> Create
            </PrimaryButton>

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
            <MerchantStaffSkeleton rows={8} cols={5} />
          ) : isError ? (
            <div className="p-6 text-center text-red-500">
              Failed to load attribute items.
            </div>
          ) : !attributeItems?.data?.length ? (
            <div className="p-6 text-center text-gray-500">
              No attribute items found.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>S/N</TableHead>
                  <TableHead>Attribute</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {attributeItems?.data?.map((item, idx) => (
                  <TableRow key={item.id}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell className="capitalize">
                      {item.attribute?.name || "N/A"}
                    </TableCell>
                    <TableCell className="capitalize">{item.name}</TableCell>

                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.is_active ? "Active" : "Inactive"}
                      </span>
                    </TableCell>

                    <TableCell>
                      {new Date(item.created_at).toLocaleDateString()}
                    </TableCell>

                    <TableCell>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-2 rounded-md bg-blue-100 text-blue-600 hover:bg-blue-200"
                        >
                          <PencilLine size={16} />
                        </button>

                        <button
                          onClick={() => openDeleteModal(item.id)}
                          className="p-2 rounded-md bg-red-100 text-red-600 hover:bg-red-200"
                        >
                          <Trash2Icon size={16} />
                        </button>
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
              {editId ? "Edit Attribute Item" : "Create Attribute Item"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={submitForm} className="space-y-4 mt-3">
            <div>
              <label className="text-sm font-medium">Attribute</label>
              <Select
                value={formData.attribute_id}
                onChange={(e) =>
                  setFormData({ ...formData, attribute_id: e.target.value })
                }
                options={attributes?.map((attr) => ({
                  value: attr.id,
                  label: attr.name,
                }))}
                placeholder="Select Attribute"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Item Name</label>
              <InputField
                type="text"
                value={formData.name}
                required
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter item name"
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

            <div className="flex items-center pt-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      is_active: e.target.checked,
                    })
                  }
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium">Active</span>
              </label>
            </div>

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
                Delete Attribute Item
              </DialogTitle>
              <DialogDescription className="text-center mt-2">
                Are you sure you want to delete this item? This action is
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

export default AttributeItem;
