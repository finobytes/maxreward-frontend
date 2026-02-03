import React, { useEffect, useState } from "react";
import {
  AlertTriangle,
  Loader,
  PencilLine,
  Plus,
  Trash2Icon,
} from "lucide-react";
import PageBreadcrumb from "../../../components/common/PageBreadcrumb";
import SearchInput from "../../../components/form/form-elements/SearchInput";
import InputField from "../../../components/form/input/InputField";
import DropdownSelect from "../../../components/ui/dropdown/DropdownSelect";
import PrimaryButton from "../../../components/ui/PrimaryButton";
import Pagination from "../../../components/table/Pagination";
import MerchantStaffSkeleton from "../../../components/skeleton/MerchantStaffSkeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  useCreateShippingMethodMutation,
  useDeleteShippingMethodMutation,
  useGetShippingMethodsQuery,
  useToggleShippingMethodStatusMutation,
  useUpdateShippingMethodMutation,
} from "../../../redux/features/admin/shippingMethod/shippingMethodApi";

const useDebounced = (value, delay = 400) => {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
};

const initialFormState = {
  name: "",
  code: "",
  description: "",
  min_days: "",
  max_days: "",
  sort_order: "0",
  is_active: true,
};

const ShippingMethods = () => {
  const [localSearch, setLocalSearch] = useState("");
  const debouncedSearch = useDebounced(localSearch, 450);

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [formData, setFormData] = useState(initialFormState);
  const [editId, setEditId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter, perPage]);

  const {
    data: methodsResponse,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetShippingMethodsQuery({
    page,
    per_page: perPage,
    search: debouncedSearch,
    is_active: statusFilter,
  });

  const [createShippingMethod, { isLoading: isCreating }] =
    useCreateShippingMethodMutation();
  const [updateShippingMethod, { isLoading: isUpdating }] =
    useUpdateShippingMethodMutation();
  const [deleteShippingMethod, { isLoading: isDeleting }] =
    useDeleteShippingMethodMutation();
  const [toggleShippingMethodStatus] = useToggleShippingMethodStatusMutation();

  const methods = methodsResponse?.data?.data || methodsResponse?.data || [];
  const meta = methodsResponse?.meta || methodsResponse?.data || {};
  const currentPage = meta?.current_page || page;
  const currentPerPage = meta?.per_page || perPage;
  const totalPages =
    meta?.last_page ||
    Math.max(1, Math.ceil((meta?.total || methods.length) / currentPerPage));

  const openCreateModal = () => {
    setEditId(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const openEditModal = (method) => {
    setEditId(method.id);
    setFormData({
      name: method?.name || "",
      code: method?.code || "",
      description: method?.description || "",
      min_days:
        method?.min_days !== null && method?.min_days !== undefined
          ? String(method.min_days)
          : "",
      max_days:
        method?.max_days !== null && method?.max_days !== undefined
          ? String(method.max_days)
          : "",
      sort_order:
        method?.sort_order !== null && method?.sort_order !== undefined
          ? String(method.sort_order)
          : "0",
      is_active: method?.is_active === 1 || method?.is_active === true,
    });
    setIsModalOpen(true);
  };

  const submitForm = async (e) => {
    e.preventDefault();
    const name = formData.name.trim();
    const code = formData.code.trim().toUpperCase();
    const minDays = Number(formData.min_days);
    const maxDays = Number(formData.max_days);
    const sortOrder =
      formData.sort_order === "" ? 0 : Number(formData.sort_order);

    if (!name) {
      toast.error("Please enter a shipping method name.");
      return;
    }
    if (!code) {
      toast.error("Please enter a method code.");
      return;
    }
    if (Number.isNaN(minDays) || Number.isNaN(maxDays)) {
      toast.error("Min days and max days must be valid numbers.");
      return;
    }
    if (maxDays < minDays) {
      toast.error("Max days must be greater than or equal to min days.");
      return;
    }

    const payload = {
      name,
      code,
      description: formData.description?.trim() || null,
      min_days: minDays,
      max_days: maxDays,
      sort_order: Number.isNaN(sortOrder) ? 0 : sortOrder,
      is_active: formData.is_active,
    };

    try {
      if (editId) {
        await updateShippingMethod({ id: editId, data: payload }).unwrap();
      } else {
        await createShippingMethod(payload).unwrap();
      }

      toast.success(
        editId
          ? "Shipping method updated successfully!"
          : "Shipping method created successfully!",
      );
      setIsModalOpen(false);
      setFormData(initialFormState);
      setEditId(null);
      refetch();
    } catch (error) {
      toast.error(
        error?.data?.message || "Failed to save shipping method. Try again.",
      );
    }
  };

  const openDeleteModal = (id) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteShippingMethod(deleteId).unwrap();
      toast.success("Shipping method deleted successfully!");
      setIsDeleteModalOpen(false);
      setDeleteId(null);
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete shipping method.");
    }
  };

  const handleToggleStatus = async (method) => {
    if (!method?.id) return;
    setTogglingId(method.id);
    try {
      await toggleShippingMethodStatus(method.id).unwrap();
      toast.success("Method status updated successfully!");
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update method status.");
    } finally {
      setTogglingId(null);
    }
  };

  const resetFilters = () => {
    setLocalSearch("");
    setStatusFilter("");
    setPerPage(10);
    setPage(1);
  };

  return (
    <div>
      <PageBreadcrumb
        items={[{ label: "Home", to: "/" }, { label: "Shipping Methods" }]}
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
            placeholder="Search by name or code..."
          />

          <div className="flex flex-wrap items-center gap-3">
            <PrimaryButton variant="primary" onClick={openCreateModal}>
              <Plus size={16} /> Create
            </PrimaryButton>

            <DropdownSelect
              value={statusFilter}
              onChange={(val) => setStatusFilter(val)}
              options={[
                { label: "All Status", value: "" },
                { label: "Active", value: "1" },
                { label: "Inactive", value: "0" },
              ]}
            />

            <DropdownSelect
              value={perPage}
              onChange={(val) => setPerPage(Number(val))}
              options={[
                { label: "10", value: 10 },
                { label: "20", value: 20 },
                { label: "50", value: 50 },
              ]}
            />

            <PrimaryButton variant="secondary" onClick={resetFilters}>
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
              Failed to load shipping methods.
            </div>
          ) : !methods.length ? (
            <div className="p-6 text-center text-gray-500">
              No shipping methods found.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>S/N</TableHead>
                  <TableHead>Method Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Delivery Days</TableHead>
                  <TableHead>Sort Order</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {methods.map((method, idx) => {
                  const isActive =
                    method?.is_active === 1 || method?.is_active === true;
                  return (
                    <TableRow key={method.id}>
                      <TableCell>
                        {(currentPage - 1) * currentPerPage + (idx + 1)}
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span>{method.name}</span>
                          {method.description ? (
                            <span className="text-xs text-gray-500">
                              {method.description}
                            </span>
                          ) : null}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-gray-600">
                        {method.code}
                      </TableCell>
                      <TableCell>
                        {method.min_days} - {method.max_days} days
                      </TableCell>
                      <TableCell>{method.sort_order ?? 0}</TableCell>
                      <TableCell>
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(method)}
                          disabled={togglingId === method.id}
                          className={`px-2 py-1 rounded-full text-xs font-medium transition ${
                            isActive
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-red-100 text-red-700 hover:bg-red-200"
                          } ${
                            togglingId === method.id
                              ? "opacity-70 cursor-not-allowed"
                              : ""
                          }`}
                          title="Toggle status"
                        >
                          {togglingId === method.id ? (
                            <Loader className="w-3 h-3 animate-spin" />
                          ) : isActive ? (
                            "Active"
                          ) : (
                            "Inactive"
                          )}
                        </button>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditModal(method)}
                            className="p-2 rounded-md bg-blue-100 text-blue-600 hover:bg-blue-200"
                          >
                            <PencilLine size={16} />
                          </button>
                          <button
                            onClick={() => openDeleteModal(method.id)}
                            className="p-2 rounded-md bg-red-100 text-red-600 hover:bg-red-200"
                          >
                            <Trash2Icon size={16} />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>

      {/* Create / Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent scrollable>
          <DialogHeader>
            <DialogTitle>
              {editId ? "Edit Shipping Method" : "Create Shipping Method"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={submitForm} className="space-y-4 mt-3">
            <div>
              <label className="text-sm font-medium">Method Name</label>
              <InputField
                type="text"
                value={formData.name}
                required
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter method name"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Code</label>
              <InputField
                type="text"
                value={formData.code}
                required
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    code: e.target.value.toUpperCase(),
                  })
                }
                placeholder="e.g. STANDARD"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Min Days</label>
                <InputField
                  type="number"
                  min="0"
                  value={formData.min_days}
                  required
                  onChange={(e) =>
                    setFormData({ ...formData, min_days: e.target.value })
                  }
                  placeholder="0"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Max Days</label>
                <InputField
                  type="number"
                  min="0"
                  value={formData.max_days}
                  required
                  onChange={(e) =>
                    setFormData({ ...formData, max_days: e.target.value })
                  }
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Sort Order</label>
              <InputField
                type="number"
                min="0"
                value={formData.sort_order}
                onChange={(e) =>
                  setFormData({ ...formData, sort_order: e.target.value })
                }
                placeholder="0"
              />
            </div>

            <div className="flex items-center pt-1">
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

            <div className="flex justify-end gap-3 pt-2">
              <PrimaryButton
                type="button"
                variant="secondary"
                onClick={() =>
                  !isCreating && !isUpdating && setIsModalOpen(false)
                }
                disabled={isCreating || isUpdating}
              >
                Cancel
              </PrimaryButton>

              <PrimaryButton
                type="submit"
                variant="primary"
                disabled={isCreating || isUpdating}
              >
                {isCreating || isUpdating ? (
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
                Delete Shipping Method
              </DialogTitle>
              <DialogDescription className="text-center mt-2">
                Are you sure you want to delete this shipping method? This
                action is permanent and cannot be undone.
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

export default ShippingMethods;
