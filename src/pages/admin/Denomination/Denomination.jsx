import React, { useState, useEffect } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Denomination = () => {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [localSearch, setLocalSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ title: "", value: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // Dummy Data (initial)
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      const dummy = [
        { id: 1, title: "RM 500", value: "500", created_at: "2024-10-01" },
        { id: 2, title: "RM 1000", value: "1000", created_at: "2024-10-03" },
        { id: 3, title: "RM 2000", value: "2000", created_at: "2024-10-04" },
      ];
      setData(dummy);
      setFiltered(dummy);
      setIsLoading(false);
    }, 600);
  }, []);

  // Search
  useEffect(() => {
    const filteredData = data.filter((item) =>
      item.title.toLowerCase().includes(localSearch.toLowerCase())
    );
    setFiltered(filteredData);
    setCurrentPage(1);
  }, [localSearch, data]);

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / perPage);
  const startIdx = (currentPage - 1) * perPage;
  const paginatedData = filtered.slice(startIdx, startIdx + perPage);

  // Handlers
  const openCreateModal = () => {
    setEditId(null);
    setFormData({ title: "", value: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditId(item.id);
    setFormData({ title: item.title, value: item.value });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this denomination?")) {
      setData(data.filter((item) => item.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      // Update
      const updated = data.map((item) =>
        item.id === editId
          ? { ...item, title: formData.title, value: formData.value }
          : item
      );
      setData(updated);
    } else {
      // Create
      const newItem = {
        id: Date.now(),
        title: formData.title,
        value: formData.value,
        created_at: new Date().toISOString(),
      };
      setData([newItem, ...data]);
    }
    setIsModalOpen(false);
  };

  const handlePageChange = (page) => setCurrentPage(page);
  const handlePerPageChange = (num) => setPerPage(num);
  const resetAllFilters = () => {
    setLocalSearch("");
    setFiltered(data);
  };

  return (
    <div>
      <PageBreadcrumb
        items={[{ label: "Home", to: "/" }, { label: "Denomination" }]}
      />

      <div className="rounded-xl border bg-white p-4 relative">
        {isLoading && (
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
              value={perPage}
              onChange={(val) => handlePerPageChange(Number(val))}
              options={[
                { label: "10", value: 10 },
                { label: "20", value: 20 },
                { label: "50", value: 50 },
              ]}
            />

            <PrimaryButton variant="secondary" onClick={resetAllFilters}>
              Clear
            </PrimaryButton>
          </div>
        </div>

        {/* Table */}
        <div className="mt-4 overflow-x-auto">
          {isLoading ? (
            <MerchantStaffSkeleton rows={8} cols={3} />
          ) : paginatedData.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No denominations found.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell>{b.id}</TableCell>
                    <TableCell className="capitalize">{b.title}</TableCell>
                    <TableCell>{b.value}</TableCell>
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
                          onClick={() => handleDelete(b.id)}
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

        {filtered.length > perPage && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      {/* Modal for Create / Edit */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editId ? "Edit Denomination" : "Create Denomination"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-3">
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
