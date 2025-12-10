import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  PencilLine,
  Trash2Icon,
  Plus,
  Loader,
  X,
  CloudUpload,
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

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  // Delete Modal States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    dispatch(setSearch(debouncedSearch));
  }, [debouncedSearch, dispatch]);

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
      resetFilters: resetAllFilters,
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

  const onSubmit = async (e) => {
    await handleSubmit(e);
    setIsModalOpen(false);
  };

  const openDeleteModal = (id) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      try {
        await handleDelete(deleteId);
        toast.success("Category deleted successfully");
        setIsDeleteModalOpen(false);
        setDeleteId(null);
      } catch (error) {
        toast.error("Failed to delete category");
        console.error(error);
      }
    }
  };

  const [selected, setSelected] = useState([]);

  const toggleSelectAll = (checked) => {
    if (checked) {
      setSelected(categories?.data?.map((m) => m.id));
    } else {
      setSelected([]);
    }
  };
  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };
  // Bulk actions (placeholder)
  const bulkUpdateStatus = (newStatus) => {
    toast.warning(`Bulk update to ${newStatus} (not implemented yet)`);
  };
  console.log(categories?.data);
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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <SearchInput
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search category..."
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
                resetAllFilters();
                setLocalSearch("");
                setSelected([]);
              }}
            >
              Clear
            </PrimaryButton>
          </div>
        </div>
        {/* Bulk Actions */}
        {selected.length > 0 && (
          <BulkActionBar
            selectedCount={selected.length}
            actions={[
              {
                label: "Delete",
                variant: "danger",
                onClick: () => bulkUpdateStatus("delete"),
              },
            ]}
          />
        )}
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
                  <TableHead>
                    <input
                      type="checkbox"
                      checked={
                        categories?.data?.length > 0 &&
                        selected.length === categories?.data?.length
                      }
                      onChange={(e) => toggleSelectAll(e.target.checked)}
                      className="w-4 h-4 rounded"
                    />
                  </TableHead>
                  <TableHead>S/N</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories?.data?.map((b, idx) => (
                  <TableRow key={b.id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selected.includes(b.id)}
                        onChange={() => toggleSelect(b.id)}
                        className="w-4 h-4 rounded"
                      />
                    </TableCell>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>
                      {b.image_url ? (
                        <img
                          src={b.image_url}
                          alt={b.name}
                          className="w-10 h-10 object-cover rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-xs">
                          No Img
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="capitalize">{b.name}</TableCell>
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
              {editId ? "Edit Category" : "Create Category"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={onSubmit} className="space-y-4 mt-3">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Category Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="mt-1 w-full border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter category name"
                required
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Category Image
              </label>
              <Dropzone
                onFilesChange={(file) => {
                  setFormData((prev) => ({ ...prev, image: file || null }));
                }}
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
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </PrimaryButton>
              <PrimaryButton type="submit" variant="primary">
                {editId ? "Update" : "Create"}
              </PrimaryButton>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <DialogTitle className="text-xl">Confirm Deletion</DialogTitle>
            </div>
            <DialogDescription className="text-center pt-2">
              Are you sure you want to delete this category? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <PrimaryButton
              variant="secondary"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </PrimaryButton>
            <PrimaryButton variant="danger" onClick={confirmDelete}>
              Delete
            </PrimaryButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Category;
