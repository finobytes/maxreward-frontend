import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PencilLine, Trash2Icon, Plus, Loader } from "lucide-react";
import SearchInput from "../../../components/form/form-elements/SearchInput";
import DropdownSelect from "../../../components/ui/dropdown/DropdownSelect";
import PrimaryButton from "../../../components/ui/PrimaryButton";
import Pagination from "../../../components/table/Pagination";
import PageBreadcrumb from "../../../components/common/PageBreadcrumb";
import MerchantStaffSkeleton from "../../../components/skeleton/MerchantStaffSkeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useBusinessType } from "../../../redux/features/admin/businessType/useBusinessType";
import {
  setSearch,
  setPage,
  setPerPage,
  resetFilters,
} from "../../../redux/features/admin/businessType/businessTypeSlice";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import BulkActionBar from "../../../components/table/BulkActionBar";
import { toast } from "sonner";
import HasPermission from "@/components/common/HasPermission";

const useDebounced = (value, delay = 400) => {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
};

const BusinessType = () => {
  const dispatch = useDispatch();
  const { search, page, per_page } = useSelector((s) => s.businessType);
  const [localSearch, setLocalSearch] = useState(search || "");
  const debouncedSearch = useDebounced(localSearch, 450);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(setSearch(debouncedSearch));
  }, [debouncedSearch, dispatch]);

  const {
    data: businessTypes,
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
  } = useBusinessType();

  const handlePageChange = (p) => dispatch(setPage(p));
  const handlePerPageChange = (n) => dispatch(setPerPage(n));

  const openCreateModal = () => {
    setFormData({ name: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    handleEdit(item);
    setIsModalOpen(true);
  };

  const onSubmit = async (e) => {
    await handleSubmit(e);
    setIsModalOpen(false);
  };
  console.log(businessTypes.data);
  const [selected, setSelected] = useState([]);

  const toggleSelectAll = (checked) => {
    if (checked) {
      setSelected(businessTypes?.data?.map((m) => m.id));
    } else {
      setSelected([]);
    }
  };
  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };
  // Bulk actions (placeholder)
  const bulkUpdateStatus = (newStatus) => {
    toast.warning(`Bulk update to ${newStatus} (not implemented yet)`);
  };

  return (
    <div>
      <PageBreadcrumb
        items={[{ label: "Home", to: "/" }, { label: "Business Type" }]}
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
            placeholder="Search business type..."
          />

          <div className="flex flex-wrap items-center gap-3">
            <HasPermission required="admin.merchant manage.business type.create">
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
                dispatch(resetAllFilters());
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
              Failed to load business types.
            </div>
          ) : !businessTypes?.data.length ? (
            <div className="p-6 text-center text-gray-500">
              No business types found.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <input
                      type="checkbox"
                      checked={
                        businessTypes?.data?.length > 0 &&
                        selected.length === businessTypes?.data?.length
                      }
                      onChange={(e) => toggleSelectAll(e.target.checked)}
                      className="w-4 h-4 rounded"
                    />
                  </TableHead>
                  <TableHead>S/N</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {businessTypes?.data?.map((b, idx) => (
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
                    <TableCell className="capitalize">{b.name}</TableCell>
                    <TableCell>
                      {new Date(b.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <HasPermission required="admin.merchant manage.business type.edit">
                          <button
                            onClick={() => openEditModal(b)}
                            className="p-2 rounded-md bg-blue-100 text-blue-600 hover:bg-blue-200"
                          >
                            <PencilLine size={16} />
                          </button>
                        </HasPermission>
                        <HasPermission required="admin.merchant manage.business type.delete">
                          <button
                            onClick={() => handleDelete(b.id)}
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

      {/* Modal for Create / Edit */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editId ? "Edit Business Type" : "Create Business Type"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={onSubmit} className="space-y-4 mt-3">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Business Type Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="mt-1 w-full border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter business type name"
                required
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
    </div>
  );
};

export default BusinessType;
