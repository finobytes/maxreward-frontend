// src/pages/admin/denomination/Denomination.jsx
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
import { useDenomination } from "../../../redux/features/admin/denomination/useDenomination";
import {
  setSearch,
  setPage,
  setPerPage,
  resetFilters,
} from "../../../redux/features/admin/denomination/denominationSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import BulkActionBar from "../../../components/table/BulkActionBar";

// debounce hook
const useDebounced = (value, delay = 400) => {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
};

const Denomination = () => {
  const dispatch = useDispatch();
  const { search, page, per_page } = useSelector((s) => s.denomination);
  const [localSearch, setLocalSearch] = useState(search || "");
  const debouncedSearch = useDebounced(localSearch, 450);

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(setSearch(debouncedSearch));
  }, [debouncedSearch, dispatch]);

  const {
    data: denominations,
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
  } = useDenomination();

  const handlePageChange = (p) => dispatch(setPage(p));
  const handlePerPageChange = (n) => dispatch(setPerPage(n));

  const openCreateModal = () => {
    setFormData({ title: "", value: "" });
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

  const [selected, setSelected] = useState([]);

  const toggleSelectAll = (checked) => {
    if (checked) {
      setSelected(denominations?.data?.map((m) => m.id));
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
    console.log("Bulk update status to:", newStatus);
  };
  const bulkDelete = () => {
    console.log("Bulk delete selected merchants:", selected);
  };

  return (
    <div>
      <PageBreadcrumb
        items={[{ label: "Home", to: "/" }, { label: "Denomination" }]}
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
            placeholder="Search denomination..."
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
              Failed to load denominations.
            </div>
          ) : !denominations?.data?.length ? (
            <div className="p-6 text-center text-gray-500">
              No denominations found.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <input
                      type="checkbox"
                      checked={
                        denominations?.data?.length > 0 &&
                        selected.length === denominations?.data?.length
                      }
                      onChange={(e) => toggleSelectAll(e.target.checked)}
                      className="w-4 h-4 rounded"
                    />
                  </TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {denominations?.data?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selected.includes(item.id)}
                        onChange={() => toggleSelect(item.id)}
                        className="w-4 h-4 rounded"
                      />
                    </TableCell>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>{item.value}</TableCell>
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
                          onClick={() => handleDelete(item.id)}
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

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editId ? "Edit Denomination" : "Create Denomination"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={onSubmit} className="space-y-4 mt-3">
            <div>
              <label className="text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="mt-1 w-full border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter denomination title"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Value</label>
              <input
                type="text"
                value={formData.value}
                onChange={(e) =>
                  setFormData({ ...formData, value: e.target.value })
                }
                className="mt-1 w-full border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-orange-500"
                placeholder="Enter denomination value"
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

export default Denomination;
