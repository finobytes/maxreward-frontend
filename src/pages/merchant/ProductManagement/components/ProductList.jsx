import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { Eye, PencilLine, Plus, Trash2Icon } from "lucide-react";
import SearchInput from "../../../../components/form/form-elements/SearchInput";
import PrimaryButton from "../../../../components/ui/PrimaryButton";
import DropdownSelect from "../../../../components/ui/dropdown/DropdownSelect";
import StatusBadge from "../../../../components/table/StatusBadge";
import Pagination from "../../../../components/table/Pagination";
import ProductSkeleton from "../../../../components/skeleton/ProductSkeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useProduct } from "../../../../redux/features/merchant/product/useProduct";
import { useDeleteProductMutation } from "../../../../redux/features/merchant/product/productApi";

const ProductList = ({ statusFilter = "", title = "Products" }) => {
  const {
    products,
    pagination,
    isLoading,
    actions: { setSearch, setStatus, resetFilters, setCurrentPage },
    filters: { search, status },
  } = useProduct();

  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
  const [selected, setSelected] = useState([]);

  // Set initial status filter on mount
  useEffect(() => {
    // Only set if different to avoid infinite loops or unnecessary fetching
    // But since we want to enforce the page's context, yes.
    setStatus(statusFilter);
    return () => {
      // Optional: reset on unmount
      // resetFilters();
      // Better not to reset on unmount if we want to keep state when navigating back,
      // but since we have different pages for different statuses, we should probably set it.
    };
  }, [statusFilter]);
  // Note: we intentionally don't include setStatus in deps to avoid issues, usually it's stable.

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = (checked) => {
    if (checked) {
      setSelected(products.map((p) => p.id));
    } else {
      setSelected([]);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(id);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        {/* Header + Filters */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <SearchInput
            placeholder="Search products..."
            value={search}
            onChange={handleSearch}
          />

          <div className="flex flex-col sm:flex-row gap-3 items-center">
            {/* Show status dropdown only if we are on the 'All Products' page (empty filter) */}
            {statusFilter === "" && (
              <DropdownSelect
                value={status}
                onChange={setStatus}
                options={[
                  { label: "All Status", value: "" },
                  { label: "Pending", value: "pending" },
                  { label: "Approved", value: "approved" },
                  { label: "Rejected", value: "rejected" },
                ]}
              />
            )}

            <PrimaryButton variant="secondary" size="md" onClick={resetFilters}>
              Reset
            </PrimaryButton>

            <PrimaryButton
              variant="primary"
              size="md"
              to="/merchant/product/create"
            >
              <Plus size={18} /> Add Product
            </PrimaryButton>
          </div>
        </div>

        {/* Table Section */}
        <div className="mt-4 relative overflow-x-auto w-full">
          <Table className="w-full table-auto border-collapse">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">
                  <input
                    type="checkbox"
                    checked={
                      products.length > 0 && selected.length === products.length
                    }
                    onChange={(e) => toggleSelectAll(e.target.checked)}
                    className="w-4 h-4 rounded"
                  />
                </TableHead>
                <TableHead className="text-gray-700 font-medium">S/N</TableHead>
                <TableHead className="text-gray-700 font-medium">
                  Product Name
                </TableHead>
                <TableHead className="text-gray-700 font-medium">
                  Category
                </TableHead>
                <TableHead className="text-gray-700 font-medium">
                  Brand
                </TableHead>
                <TableHead className="text-gray-700 font-medium">
                  Price
                </TableHead>
                <TableHead className="text-gray-700 font-medium">
                  Status
                </TableHead>
                <TableHead className="text-gray-700 font-medium text-center">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <ProductSkeleton rows={8} cols={6} />
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6">
                    No products found
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product, idx) => (
                  <TableRow
                    key={product.id}
                    className="transition hover:bg-gray-50"
                  >
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selected.includes(product.id)}
                        onChange={() => toggleSelect(product.id)}
                        className="w-4 h-4 rounded"
                      />
                    </TableCell>
                    <TableCell>
                      {(pagination?.currentPage - 1) * pagination?.perPage +
                        (idx + 1)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {/* Placeholder for image if available */}
                        {product.thumbnail && (
                          <img
                            src={product.thumbnail}
                            alt={product.name}
                            className="w-8 h-8 rounded object-cover"
                          />
                        )}
                        <span>{product.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{product.category?.name || "-"}</TableCell>
                    <TableCell>{product.brand?.name || "-"}</TableCell>
                    <TableCell>{product.price}</TableCell>
                    <TableCell>
                      <StatusBadge status={product.status} />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2 justify-center">
                        <Link
                          to={`/merchant/product/edit/${product.id}`}
                          className="p-2 rounded-md bg-blue-100 hover:bg-blue-200 text-blue-500"
                        >
                          <PencilLine size={16} />
                        </Link>

                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 rounded-md bg-red-100 hover:bg-red-200 text-red-500"
                        >
                          <Trash2Icon size={16} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <Pagination
            currentPage={pagination?.currentPage}
            totalPages={pagination?.lastPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductList;
