import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { Eye, PencilLine, Plus, Trash2Icon } from "lucide-react";
import SearchInput from "../../../../components/form/form-elements/SearchInput";
import PrimaryButton from "../../../../components/ui/PrimaryButton";
import DropdownSelect from "../../../../components/ui/dropdown/DropdownSelect";
import StatusBadge from "../../../../components/table/StatusBadge";
import Pagination from "../../../../components/table/Pagination";
import ProductTableSkeleton from "../../../../components/skeleton/ProductTableSkeleton";
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
import { useProduct } from "../../../../redux/features/merchant/product/useProduct";
import {
  useDeleteProductMutation,
  useUpdateProductStatusMutation,
} from "../../../../redux/features/merchant/product/productApi";
import { useVerifyMeQuery } from "../../../../redux/features/auth/authApi";
// Pick Member ID
const pickMemberId = (profile) =>
  profile?.merchant?.corporate_member?.id ||
  profile?.merchant?.corporate_member_id ||
  null;

const ProductList = ({ statusFilter = "", title = "Products" }) => {
  const { data: memberProfile, isLoading: memberLoading } =
    useVerifyMeQuery("merchant");
  // Derive Merchant ID from profile
  // The structure depends on the API response for 'merchant' role
  // Typically: profile.id or profile.merchant.id
  const merchantId =
    memberProfile?.merchant?.id ||
    memberProfile?.id ||
    pickMemberId(memberProfile);

  const {
    products,
    pagination,
    isLoading,
    actions: {
      setSearch,
      setStatus,
      resetFilters,
      setCurrentPage,
      setMerchantId,
    },
    filters: { search, status },
  } = useProduct();

  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
  const [updateProductStatus, { isLoading: isUpdatingStatus }] =
    useUpdateProductStatusMutation();
  const [selected, setSelected] = useState([]);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [itemToUpdate, setItemToUpdate] = useState(null);

  // Set initial status filter and merchant ID on mount/change
  useEffect(() => {
    if (statusFilter !== undefined) {
      setStatus(statusFilter);
    }
  }, [statusFilter]);

  useEffect(() => {
    if (merchantId) {
      setMerchantId(merchantId);
    }
  }, [merchantId, setMerchantId]);
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

  const handleStatusUpdate = (product, newStatus) => {
    setItemToUpdate({ ...product, newStatus });
    setStatusModalOpen(true);
  };

  const confirmStatusChange = async () => {
    if (!itemToUpdate) return;
    try {
      await updateProductStatus({
        id: itemToUpdate.id,
        status: itemToUpdate.newStatus,
      }).unwrap();
      setStatusModalOpen(false);
      setItemToUpdate(null);
    } catch (err) {
      console.error("Failed to update status", err);
      // Optional: add toast error here
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
                <TableHead className="text-gray-700 font-medium w-[50px]">
                  S/N
                </TableHead>
                <TableHead className="text-gray-700 font-medium">
                  Image
                </TableHead>
                <TableHead className="text-gray-700 font-medium">
                  Product Name
                </TableHead>
                <TableHead className="text-gray-700 font-medium">
                  Brand
                </TableHead>
                <TableHead className="text-gray-700 font-medium">
                  Category
                </TableHead>
                <TableHead className="text-gray-700 font-medium">
                  Sub Category
                </TableHead>
                <TableHead className="text-gray-700 font-medium">
                  Model
                </TableHead>
                <TableHead className="text-gray-700 font-medium">
                  Price / Points
                </TableHead>
                <TableHead className="text-gray-700 font-medium">
                  Product Type
                </TableHead>
                <TableHead className="text-gray-700 font-medium text-center">
                  Status
                </TableHead>
                <TableHead className="text-gray-700 font-medium text-center">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <ProductTableSkeleton rows={8} />
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6">
                    No products found
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product, idx) => {
                  const image =
                    product.images && product.images.length > 0
                      ? product.images[0].url
                      : null;

                  // Calculate range for variable products if needed,
                  // but data provides root level price/point which is usually the min/display price.
                  // We will use root level values as they are populated.

                  return (
                    <TableRow
                      key={product.id}
                      className="transition hover:bg-gray-50 align-top"
                    >
                      <TableCell className="align-middle">
                        {(pagination?.currentPage - 1) * pagination?.perPage +
                          (idx + 1)}
                      </TableCell>
                      <TableCell className="align-middle">
                        <div className="h-12 w-12 rounded-lg border border-gray-100 bg-gray-50 flex items-center justify-center overflow-hidden">
                          {image ? (
                            <img
                              src={image}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="align-middle">
                        <div className="flex flex-col gap-1">
                          <span className="font-semibold text-gray-900 line-clamp-2">
                            {product.name}
                          </span>
                          <div className="flex flex-col text-xs text-gray-500 gap-0.5">
                            {product.type === "variable" && (
                              <span className="text-blue-600">
                                {product.variations?.length || 0} variations
                              </span>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="align-middle">
                        <span className="text-sm font-medium text-gray-700">
                          {product.brand?.name || "-"}
                        </span>
                      </TableCell>
                      <TableCell className="align-middle">
                        <span className="text-sm text-gray-700">
                          {product.category?.name || "-"}
                        </span>
                      </TableCell>
                      <TableCell className="align-middle">
                        <span className="text-sm text-gray-700">
                          {product.sub_category?.name ||
                            product.subcategory?.name ||
                            "-"}
                        </span>
                      </TableCell>
                      <TableCell className="align-middle">
                        <span className="text-sm text-gray-700">
                          {product.model?.name || "-"}
                        </span>
                      </TableCell>
                      <TableCell className="align-middle">
                        <div className="flex flex-col gap-1 text-sm">
                          <div className="flex items-center gap-1">
                            <span className="text-gray-500 text-xs w-10">
                              Price:
                            </span>
                            <span className="font-medium text-green-600">
                              {product.sale_price > 0
                                ? product.sale_price
                                : product.regular_price}
                            </span>
                            {product.sale_price > 0 &&
                              product.sale_price < product.regular_price && (
                                <span className="text-xs text-gray-400 line-through">
                                  {product.regular_price}
                                </span>
                              )}
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-gray-500 text-xs w-10">
                              Points:
                            </span>
                            <span className="font-medium text-brand-600">
                              {product.sale_point > 0
                                ? product.sale_point
                                : product.regular_point}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="align-middle">
                        <div className="flex flex-col gap-1 text-xs">
                          <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full w-fit capitalize border border-purple-100">
                            {product.type}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center align-middle">
                        <StatusBadge status={product.status} />
                      </TableCell>
                      <TableCell className="align-middle">
                        <div className="flex gap-2 justify-center">
                          <Link
                            to={`/merchant/product/view/${product.id}`}
                            className="p-2 rounded-md bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors border border-gray-200"
                            title="View"
                          >
                            <Eye size={16} />
                          </Link>

                          <Link
                            to={`/merchant/product/edit/${product.id}`}
                            className="p-2 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors border border-blue-200"
                            title="Edit"
                          >
                            <PencilLine size={16} />
                          </Link>

                          {product.status === "draft" && (
                            <button
                              onClick={() =>
                                handleStatusUpdate(product, "active")
                              }
                              className="p-2 rounded-md bg-green-50 hover:bg-green-100 text-green-600 transition-colors border border-green-200"
                              title="Publish (Set to Active)"
                            >
                              <span className="font-bold text-xs">PUB</span>
                            </button>
                          )}

                          {product.status === "active" && (
                            <button
                              onClick={() =>
                                handleStatusUpdate(product, "inactive")
                              }
                              className="p-2 rounded-md bg-yellow-50 hover:bg-yellow-100 text-yellow-600 transition-colors border border-yellow-200"
                              title="Deactivate"
                            >
                              <span className="font-bold text-xs">DEACT</span>
                            </button>
                          )}

                          {product.status === "inactive" && (
                            <button
                              onClick={() =>
                                handleStatusUpdate(product, "active")
                              }
                              className="p-2 rounded-md bg-green-50 hover:bg-green-100 text-green-600 transition-colors border border-green-200"
                              title="Activate"
                            >
                              <span className="font-bold text-xs">ACT</span>
                            </button>
                          )}

                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 rounded-md bg-red-50 hover:bg-red-100 text-red-600 transition-colors border border-red-200"
                            title="Delete"
                          >
                            <Trash2Icon size={16} />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
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
      {/* Status Update Modal */}
      <Dialog open={statusModalOpen} onOpenChange={setStatusModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {itemToUpdate?.newStatus === "active"
                ? "Publish Product"
                : itemToUpdate?.newStatus === "inactive"
                ? "Deactivate Product"
                : "Update Status"}
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to change the status of{" "}
              <span className="font-semibold text-gray-900">
                "{itemToUpdate?.name}"
              </span>{" "}
              to{" "}
              <span className="font-semibold uppercase">
                {itemToUpdate?.newStatus}
              </span>
              ?
              {itemToUpdate?.newStatus === "active" && (
                <span className="block mt-2 text-green-600">
                  This product will be visible to all members.
                </span>
              )}
              {itemToUpdate?.newStatus === "inactive" && (
                <span className="block mt-2 text-yellow-600">
                  This product will be hidden from members.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <div className="mr-2">
              <PrimaryButton
                variant="secondary"
                onClick={() => setStatusModalOpen(false)}
                disabled={isUpdatingStatus}
              >
                Cancel
              </PrimaryButton>
            </div>
            <PrimaryButton
              variant={
                itemToUpdate?.newStatus === "inactive" ? "danger" : "primary"
              }
              onClick={confirmStatusChange}
              loading={isUpdatingStatus}
            >
              {itemToUpdate?.newStatus === "active" ? "Publish" : "Confirm"}
            </PrimaryButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductList;
