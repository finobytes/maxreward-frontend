import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  PencilLine,
  Trash2Icon,
  Plus,
  Loader,
  X,
  AlertTriangle,
} from "lucide-react";
import Dropzone from "../../../../components/form/form-elements/Dropzone";
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
import { useCategory } from "../../../../redux/features/admin/category/useCategory";
import {
  setSearch,
  setPage,
  setPerPage,
} from "../../../../redux/features/admin/category/categorySlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "../../../../components/ui/dialog";
import BulkActionBar from "../../../../components/table/BulkActionBar";
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

const Category = () => {
  const dispatch = useDispatch();
  const { search, per_page } = useSelector((s) => s.category);

  const [localSearch, setLocalSearch] = useState(search || "");
  const debouncedSearch = useDebounced(localSearch, 450);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    dispatch(setSearch(debouncedSearch));
  }, [debouncedSearch]);

  const {
    data: categories,
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
      resetFilters,
    },
  } = useCategory();

  const handlePageChange = (p) => dispatch(setPage(p));
  const handlePerPageChange = (n) => dispatch(setPerPage(n));

  const openCreateModal = () => {
    setFormData({ name: "", image: null });
    setImagePreview(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    handleEdit(item);
    setImagePreview(item.image_url);
    setIsModalOpen(true);
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      await handleSubmit(e);
      toast.success(
        editId
          ? "Category updated successfully!"
          : "Category created successfully!"
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
      toast.success("Category deleted successfully!");
      setIsDeleteModalOpen(false);
      setDeleteId(null);
    } catch (error) {
      toast.error("Failed to delete category");
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
          { label: "Category" },
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
            placeholder="Search category..."
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
                resetFilters();
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
              Failed to load categories.
            </div>
          ) : !categories?.data?.length ? (
            <div className="p-6 text-center text-gray-500">
              No categories found.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>S/N</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {categories?.data?.map((item, idx) => (
                  <TableRow key={item.id}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-10 h-10 object-cover rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-xs">
                          No Img
                        </div>
                      )}
                    </TableCell>

                    <TableCell className="capitalize">{item.name}</TableCell>

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
              {editId ? "Edit Category" : "Create Category"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={submitForm} className="space-y-4 mt-3">
            <div>
              <label className="text-sm font-medium">Category Name</label>
              <input
                type="text"
                value={formData.name}
                required
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="mt-1 w-full border rounded-md p-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Category Image</label>
              <Dropzone
                onFilesChange={(file) =>
                  setFormData((prev) => ({ ...prev, image: file || null }))
                }
                maxFiles={1}
                initialFiles={imagePreview ? [imagePreview] : []}
                validationMessage={
                  !editId && !formData.image ? "Image is required" : null
                }
              />
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
                Delete Category
              </DialogTitle>
              <DialogDescription className="text-center mt-2">
                Are you sure you want to delete this category? This action is
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

export default Category;
