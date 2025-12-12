import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  PencilLine,
  Trash2Icon,
  Plus,
  Loader,
  AlertTriangle,
} from "lucide-react";
import SearchInput from "../../../../components/form/form-elements/SearchInput";
import InputField from "../../../../components/form/input/InputField";
import Select from "../../../../components/form/Select";
import DropdownSelect from "../../../../components/ui/dropdown/DropdownSelect";
import PrimaryButton from "../../../../components/ui/PrimaryButton";
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
import { useSubCategory } from "../../../../redux/features/admin/subCategory/useSubCategory";
import { useGetAllCategoriesQuery } from "../../../../redux/features/admin/category/categoryApi";
import {
  setSearch,
  setPage,
  setPerPage,
  resetFilters,
} from "../../../../redux/features/admin/subCategory/subCategorySlice";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "../../../../components/ui/dialog";
import { toast } from "sonner";

const useDebounced = (value, delay = 400) => {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
};

const SubCategory = () => {
  const dispatch = useDispatch();
  const { search, page, per_page } = useSelector((s) => s.subCategory);
  const [localSearch, setLocalSearch] = useState(search || "");
  const debouncedSearch = useDebounced(localSearch, 450);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Delete Modal States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch categories for dropdown
  const { data: allCategories } = useGetAllCategoriesQuery();
  const categories = allCategories?.data?.categories;

  useEffect(() => {
    dispatch(setSearch(debouncedSearch));
  }, [debouncedSearch, dispatch]);

  const {
    data: subCategories,
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
  } = useSubCategory();
  console.log("subCategories", subCategories?.data);
  const handlePageChange = (p) => dispatch(setPage(p));
  const handlePerPageChange = (n) => dispatch(setPerPage(n));

  const openCreateModal = () => {
    setFormData({
      name: "",
      category_id: "",
      description: "",
      // sort_order: "",
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
          ? "Sub Category updated successfully!"
          : "Sub Category created successfully!"
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
      toast.success("Sub Category deleted successfully!");
      setIsDeleteModalOpen(false);
      setDeleteId(null);
    } catch (error) {
      toast.error("Failed to delete sub category");
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
          { label: "Sub Category" },
        ]}
      />

      <div className="rounded-xl border bg-white p-4 relative">
        {isFetching && !isLoading && (
          <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-sm flex items-center justify-center rounded-xl">
            <Loader className="w-6 h-6 animate-spin text-gray-500" />
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <SearchInput
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search sub category..."
          />

          <div className="flex flex-wrap items-center gap-3">
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
                dispatch(resetAllFilters());
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
            <MerchantStaffSkeleton rows={8} cols={4} />
          ) : isError ? (
            <div className="p-6 text-center text-red-500">
              Failed to load sub categories.
            </div>
          ) : !subCategories?.data?.length ? (
            <div className="p-6 text-center text-gray-500">
              No sub categories found.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>S/N</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Sub Category Name</TableHead>
                  {/* <TableHead>Sort Order</TableHead> */}
                  <TableHead>Status</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subCategories?.data?.map((b, idx) => (
                  <TableRow key={b.id}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell className="capitalize">
                      {b.category?.name || "N/A"}
                    </TableCell>
                    <TableCell className="capitalize">{b.name}</TableCell>
                    {/* <TableCell>{b.sort_order}</TableCell> */}
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          b.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {b.is_active ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {new Date(b.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(b)}
                          className="p-2 rounded-md bg-blue-100 text-blue-600 hover:bg-blue-200"
                        >
                          <PencilLine size={16} />
                        </button>
                        <button
                          onClick={() => openDeleteModal(b.id)}
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

      {/* Modal for Create / Edit */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editId ? "Edit Sub Category" : "Create Sub Category"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={submitForm} className="space-y-4 mt-3">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Category
              </label>
              <Select
                value={formData.category_id}
                onChange={(e) =>
                  setFormData({ ...formData, category_id: e.target.value })
                }
                options={categories?.map((cat) => ({
                  value: cat.id,
                  label: cat.name,
                }))}
                placeholder="Select Category"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Sub Category Name
              </label>
              <InputField
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter sub category name"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="mt-1 w-full border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter description"
                rows={3}
              />
            </div>

            <div className="flex gap-4">
              {/* <div className="flex-1">
                <label className="text-sm font-medium text-gray-700">
                  Sort Order
                </label>
                <InputField
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) =>
                    setFormData({ ...formData, sort_order: e.target.value })
                  }
                  placeholder="0"
                />
              </div> */}
              <div className="flex items-center pt-6">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) =>
                      setFormData({ ...formData, is_active: e.target.checked })
                    }
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Active
                  </span>
                </label>
              </div>
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
                Delete Sub Category
              </DialogTitle>
              <DialogDescription className="text-center mt-2">
                Are you sure you want to delete this sub category? This action
                is permanent and cannot be undone.
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

export default SubCategory;
