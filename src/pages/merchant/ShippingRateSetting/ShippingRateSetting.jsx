import React, { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Loader,
  PencilLine,
  Plus,
  Trash2Icon,
} from "lucide-react";
import PageBreadcrumb from "../../../components/common/PageBreadcrumb";
import InputField from "../../../components/form/input/InputField";
import DropdownSelect from "../../../components/ui/dropdown/DropdownSelect";
import PrimaryButton from "../../../components/ui/PrimaryButton";
import Pagination from "../../../components/table/Pagination";
import MerchantStaffSkeleton from "../../../components/skeleton/MerchantStaffSkeleton";
import BulkActionBar from "../../../components/table/BulkActionBar";
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
  useBulkCreateShippingRatesMutation,
  useCreateShippingRateMutation,
  useDeleteShippingRateMutation,
  useGetShippingRateOptionsQuery,
  useGetShippingRatesQuery,
  useToggleShippingRateStatusMutation,
  useUpdateShippingRateMutation,
} from "../../../redux/features/merchant/shippingRate/shippingRateApi";

const initialFormState = {
  zone_id: "",
  method_id: "",
  weight_from: "",
  weight_to: "",
  base_points: "",
  per_kg_points: "",
  free_shipping_min_order: "",
  is_active: true,
};

const createBulkCreateState = () => ({
  method_id: "",
  apply_to_all: false,
  selectedZones: [],
  weight_ranges: [{ from: "", to: "", base: "", per_kg: "" }],
  free_shipping_min_order: "",
});

const toInputValue = (value) =>
  value === null || value === undefined ? "" : String(value);

const ShippingRateSetting = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState("");
  const [zoneFilter, setZoneFilter] = useState("");
  const [methodFilter, setMethodFilter] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [formData, setFormData] = useState(initialFormState);
  const [editId, setEditId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  const [selectedRates, setSelectedRates] = useState([]);
  const [isBulkCreateOpen, setIsBulkCreateOpen] = useState(false);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);
  const [isBulkDeleteProcessing, setIsBulkDeleteProcessing] = useState(false);
  const [bulkCreateData, setBulkCreateData] = useState(createBulkCreateState());

  useEffect(() => {
    setPage(1);
    setSelectedRates([]);
  }, [zoneFilter, methodFilter, statusFilter, perPage]);

  const {
    data: ratesResponse,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetShippingRatesQuery({
    page,
    per_page: perPage,
    zone_id: zoneFilter,
    method_id: methodFilter,
    is_active: statusFilter,
  });

  const { data: optionsResponse, isLoading: isOptionsLoading } =
    useGetShippingRateOptionsQuery();

  const [createShippingRate, { isLoading: isCreating }] =
    useCreateShippingRateMutation();
  const [updateShippingRate, { isLoading: isUpdating }] =
    useUpdateShippingRateMutation();
  const [deleteShippingRate, { isLoading: isDeleting }] =
    useDeleteShippingRateMutation();
  const [toggleShippingRateStatus] = useToggleShippingRateStatusMutation();
  const [bulkCreateShippingRates, { isLoading: isBulkCreating }] =
    useBulkCreateShippingRatesMutation();

  const zones = optionsResponse?.data?.zones || [];
  const methods = optionsResponse?.data?.methods || [];

  const zoneOptions = useMemo(
    () =>
      zones.map((zone) => ({
        label: zone.name,
        value: String(zone.id),
      })),
    [zones]
  );

  const methodOptions = useMemo(
    () =>
      methods.map((method) => ({
        label: method.name,
        value: String(method.id),
      })),
    [methods]
  );

  const rates = ratesResponse?.data?.data || ratesResponse?.data || [];
  const meta = ratesResponse?.meta || ratesResponse?.data || {};
  const currentPage = meta?.current_page || page;
  const currentPerPage = meta?.per_page || perPage;
  const totalPages =
    meta?.last_page ||
    Math.max(1, Math.ceil((meta?.total || rates.length) / currentPerPage));

  const openCreateModal = () => {
    setEditId(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const openEditModal = (rate) => {
    setEditId(rate.id);
    setFormData({
      zone_id: toInputValue(rate?.zone?.id ?? rate?.zone_id),
      method_id: toInputValue(rate?.method?.id ?? rate?.method_id),
      weight_from: toInputValue(rate?.weight_from),
      weight_to: toInputValue(rate?.weight_to),
      base_points: toInputValue(rate?.base_points),
      per_kg_points: toInputValue(rate?.per_kg_points),
      free_shipping_min_order: toInputValue(rate?.free_shipping_min_order),
      is_active: rate?.is_active === 1 || rate?.is_active === true,
    });
    setIsModalOpen(true);
  };

  const submitForm = async (e) => {
    e.preventDefault();

    if (!editId && !formData.zone_id) {
      toast.error("Please select a shipping zone.");
      return;
    }
    if (!editId && !formData.method_id) {
      toast.error("Please select a shipping method.");
      return;
    }

    const weightFrom = Number(formData.weight_from);
    const weightTo = Number(formData.weight_to);
    const basePoints = Number(formData.base_points);
    const perKgPoints = Number(formData.per_kg_points);
    const freeShippingMinOrder =
      formData.free_shipping_min_order === ""
        ? null
        : Number(formData.free_shipping_min_order);

    if (
      Number.isNaN(weightFrom) ||
      Number.isNaN(weightTo) ||
      Number.isNaN(basePoints) ||
      Number.isNaN(perKgPoints) ||
      (freeShippingMinOrder !== null &&
        Number.isNaN(freeShippingMinOrder))
    ) {
      toast.error("Please enter valid numeric values.");
      return;
    }

    if (weightTo <= weightFrom) {
      toast.error("Weight to must be greater than weight from.");
      return;
    }

    const payload = {
      weight_from: weightFrom,
      weight_to: weightTo,
      base_points: basePoints,
      per_kg_points: perKgPoints,
      free_shipping_min_order: freeShippingMinOrder,
      is_active: formData.is_active,
    };

    try {
      if (editId) {
        await updateShippingRate({ id: editId, data: payload }).unwrap();
      } else {
        await createShippingRate({
          ...payload,
          zone_id: Number(formData.zone_id),
          method_id: Number(formData.method_id),
        }).unwrap();
      }

      toast.success(
        editId
          ? "Shipping rate updated successfully!"
          : "Shipping rate created successfully!"
      );
      setIsModalOpen(false);
      setFormData(initialFormState);
      setEditId(null);
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to save shipping rate.");
    }
  };

  const openDeleteModal = (id) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteShippingRate(deleteId).unwrap();
      toast.success("Shipping rate deleted successfully!");
      setIsDeleteModalOpen(false);
      setDeleteId(null);
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete shipping rate.");
    }
  };

  const handleToggleStatus = async (rate) => {
    if (!rate?.id) return;
    setTogglingId(rate.id);
    try {
      await toggleShippingRateStatus(rate.id).unwrap();
      toast.success("Rate status updated successfully!");
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update rate status.");
    } finally {
      setTogglingId(null);
    }
  };

  const resetFilters = () => {
    setZoneFilter("");
    setMethodFilter("");
    setStatusFilter("");
    setPerPage(10);
    setPage(1);
    setSelectedRates([]);
  };

  const handlePageChange = (nextPage) => {
    setPage(nextPage);
    setSelectedRates([]);
  };

  const toggleSelectAll = (checked) => {
    if (checked) {
      setSelectedRates(rates.map((rate) => rate.id));
    } else {
      setSelectedRates([]);
    }
  };

  const toggleSelect = (id) => {
    setSelectedRates((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const openBulkCreateModal = () => {
    setBulkCreateData(createBulkCreateState());
    setIsBulkCreateOpen(true);
  };

  const openBulkDeleteModal = () => {
    if (!selectedRates.length) {
      toast.error("Please select at least one shipping rate.");
      return;
    }
    setIsBulkDeleteOpen(true);
  };

  const toggleZoneSelection = (zoneId) => {
    setBulkCreateData((prev) => {
      const selected = new Set(prev.selectedZones);
      if (selected.has(zoneId)) {
        selected.delete(zoneId);
      } else {
        selected.add(zoneId);
      }
      return { ...prev, selectedZones: Array.from(selected) };
    });
  };

  const updateWeightRange = (index, field, value) => {
    setBulkCreateData((prev) => ({
      ...prev,
      weight_ranges: prev.weight_ranges.map((range, idx) =>
        idx === index ? { ...range, [field]: value } : range
      ),
    }));
  };

  const addWeightRange = () => {
    setBulkCreateData((prev) => ({
      ...prev,
      weight_ranges: [
        ...prev.weight_ranges,
        { from: "", to: "", base: "", per_kg: "" },
      ],
    }));
  };

  const removeWeightRange = (index) => {
    setBulkCreateData((prev) => {
      if (prev.weight_ranges.length === 1) return prev;
      return {
        ...prev,
        weight_ranges: prev.weight_ranges.filter((_, idx) => idx !== index),
      };
    });
  };

  const submitBulkCreate = async (e) => {
    e.preventDefault();

    if (!bulkCreateData.method_id) {
      toast.error("Please select a shipping method.");
      return;
    }

    if (!bulkCreateData.apply_to_all && !bulkCreateData.selectedZones.length) {
      toast.error("Please select at least one zone.");
      return;
    }

    const ranges = bulkCreateData.weight_ranges.map((range) => ({
      from: Number(range.from),
      to: Number(range.to),
      base: Number(range.base),
      per_kg: Number(range.per_kg),
    }));

    for (const range of ranges) {
      if (
        Number.isNaN(range.from) ||
        Number.isNaN(range.to) ||
        Number.isNaN(range.base) ||
        Number.isNaN(range.per_kg)
      ) {
        toast.error("Please enter valid values for all weight ranges.");
        return;
      }
      if (range.to <= range.from) {
        toast.error("Each weight range must have a valid 'to' value.");
        return;
      }
    }

    const freeShippingMinOrder =
      bulkCreateData.free_shipping_min_order === ""
        ? null
        : Number(bulkCreateData.free_shipping_min_order);

    if (
      freeShippingMinOrder !== null &&
      Number.isNaN(freeShippingMinOrder)
    ) {
      toast.error("Free shipping minimum must be a valid number.");
      return;
    }

    const payload = {
      method_id: Number(bulkCreateData.method_id),
      apply_to_zones: bulkCreateData.apply_to_all
        ? "all"
        : bulkCreateData.selectedZones.map((id) => Number(id)),
      weight_ranges: ranges,
      free_shipping_min_order: freeShippingMinOrder,
    };

    try {
      const response = await bulkCreateShippingRates(payload).unwrap();
      const created = response?.data?.created;
      const skipped = response?.data?.skipped;
      let message = response?.message || "Bulk creation completed";
      if (typeof created === "number") {
        message += ` (${created} created`;
        if (typeof skipped === "number") message += `, ${skipped} skipped`;
        message += ")";
      }
      toast.success(message);
      setIsBulkCreateOpen(false);
      setBulkCreateData(createBulkCreateState());
      refetch();
    } catch (error) {
      toast.error(
        error?.data?.message || "Failed to bulk create shipping rates."
      );
    }
  };

  const submitBulkDelete = async (e) => {
    e.preventDefault();

    if (!selectedRates.length) {
      toast.error("Please select at least one shipping rate.");
      return;
    }

    try {
      setIsBulkDeleteProcessing(true);
      const results = await Promise.allSettled(
        selectedRates.map((id) => deleteShippingRate(id).unwrap())
      );
      const successCount = results.filter(
        (result) => result.status === "fulfilled"
      ).length;
      const failureCount = results.length - successCount;

      if (successCount > 0) {
        toast.success(`${successCount} shipping rate(s) deleted successfully.`);
      }
      if (failureCount > 0) {
        toast.error(`${failureCount} shipping rate(s) failed to delete.`);
      }
      setIsBulkDeleteOpen(false);
      setSelectedRates([]);
      refetch();
    } catch (error) {
      toast.error(
        error?.data?.message || "Failed to delete shipping rates."
      );
    } finally {
      setIsBulkDeleteProcessing(false);
    }
  };

  return (
    <div>
      <PageBreadcrumb
        items={[{ label: "Home", to: "/" }, { label: "Shipping Rate Settings" }]}
      />

      <div className="rounded-xl border bg-white p-4 relative">
        {isFetching && !isLoading && (
          <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-sm flex items-center justify-center rounded-xl">
            <Loader className="w-6 h-6 animate-spin text-gray-500" />
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <PrimaryButton variant="primary" onClick={openCreateModal}>
              <Plus size={16} /> Create
            </PrimaryButton>

            <PrimaryButton
              variant="secondary"
              onClick={openBulkCreateModal}
              disabled={isOptionsLoading}
            >
              <Plus size={16} /> Bulk Create
            </PrimaryButton>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <DropdownSelect
              value={zoneFilter}
              onChange={(val) => setZoneFilter(val)}
              options={[
                { label: "All Zones", value: "" },
                ...zoneOptions,
              ]}
            />

            <DropdownSelect
              value={methodFilter}
              onChange={(val) => setMethodFilter(val)}
              options={[
                { label: "All Methods", value: "" },
                ...methodOptions,
              ]}
            />

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

        {/* Bulk Actions */}
        {selectedRates.length > 0 && (
          <BulkActionBar
            selectedCount={selectedRates.length}
            actions={[
              {
                label: "Delete",
                variant: "danger",
                icon: "delete",
                onClick: openBulkDeleteModal,
              },
            ]}
          />
        )}

        {/* Table */}
        <div className="mt-4 overflow-x-auto">
          {isLoading ? (
            <MerchantStaffSkeleton rows={8} cols={9} />
          ) : isError ? (
            <div className="p-6 text-center text-red-500">
              Failed to load shipping rates.
            </div>
          ) : !rates.length ? (
            <div className="p-6 text-center text-gray-500">
              No shipping rates found.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <input
                      type="checkbox"
                      checked={
                        rates.length > 0 &&
                        selectedRates.length === rates.length
                      }
                      onChange={(e) => toggleSelectAll(e.target.checked)}
                      className="w-4 h-4 rounded"
                    />
                  </TableHead>
                  <TableHead>S/N</TableHead>
                  <TableHead>Zone</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Weight Range</TableHead>
                  <TableHead>Base Points</TableHead>
                  <TableHead>Per Kg Points</TableHead>
                  <TableHead>Free Shipping Min</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {rates.map((rate, idx) => {
                  const isActive =
                    rate?.is_active === 1 || rate?.is_active === true;
                  const zoneName =
                    rate?.zone?.name || rate?.zone_name || "N/A";
                  const methodName =
                    rate?.method?.name || rate?.method_name || "N/A";

                  return (
                    <TableRow key={rate.id}>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedRates.includes(rate.id)}
                          onChange={() => toggleSelect(rate.id)}
                          className="w-4 h-4 rounded"
                        />
                      </TableCell>
                      <TableCell>
                        {(currentPage - 1) * currentPerPage + (idx + 1)}
                      </TableCell>
                      <TableCell className="font-medium">{zoneName}</TableCell>
                      <TableCell>{methodName}</TableCell>
                      <TableCell>
                        {rate.weight_from} - {rate.weight_to}
                      </TableCell>
                      <TableCell>{rate.base_points}</TableCell>
                      <TableCell>{rate.per_kg_points}</TableCell>
                      <TableCell>
                        {rate.free_shipping_min_order ?? "N/A"}
                      </TableCell>
                      <TableCell>
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(rate)}
                          disabled={togglingId === rate.id}
                          className={`px-2 py-1 rounded-full text-xs font-medium transition ${
                            isActive
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-red-100 text-red-700 hover:bg-red-200"
                          } ${
                            togglingId === rate.id
                              ? "opacity-70 cursor-not-allowed"
                              : ""
                          }`}
                          title="Toggle status"
                        >
                          {togglingId === rate.id ? (
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
                            onClick={() => openEditModal(rate)}
                            className="p-2 rounded-md bg-blue-100 text-blue-600 hover:bg-blue-200"
                          >
                            <PencilLine size={16} />
                          </button>
                          <button
                            onClick={() => openDeleteModal(rate.id)}
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
          onPageChange={handlePageChange}
        />
      </div>

      {/* Create / Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editId ? "Edit Shipping Rate" : "Create Shipping Rate"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={submitForm} className="space-y-4 mt-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Zone</label>
                <select
                  value={formData.zone_id}
                  onChange={(e) =>
                    setFormData({ ...formData, zone_id: e.target.value })
                  }
                  className="mt-1 w-full border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  disabled={!!editId || isOptionsLoading}
                  required={!editId}
                >
                  <option value="">Select zone</option>
                  {zoneOptions.map((zone) => (
                    <option key={zone.value} value={zone.value}>
                      {zone.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Method</label>
                <select
                  value={formData.method_id}
                  onChange={(e) =>
                    setFormData({ ...formData, method_id: e.target.value })
                  }
                  className="mt-1 w-full border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  disabled={!!editId || isOptionsLoading}
                  required={!editId}
                >
                  <option value="">Select method</option>
                  {methodOptions.map((method) => (
                    <option key={method.value} value={method.value}>
                      {method.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Weight From</label>
                <InputField
                  type="number"
                  min="0"
                  value={formData.weight_from}
                  required
                  onChange={(e) =>
                    setFormData({ ...formData, weight_from: e.target.value })
                  }
                  placeholder="0"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Weight To</label>
                <InputField
                  type="number"
                  min="0"
                  value={formData.weight_to}
                  required
                  onChange={(e) =>
                    setFormData({ ...formData, weight_to: e.target.value })
                  }
                  placeholder="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Base Points</label>
                <InputField
                  type="number"
                  min="0"
                  value={formData.base_points}
                  required
                  onChange={(e) =>
                    setFormData({ ...formData, base_points: e.target.value })
                  }
                  placeholder="0"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Per Kg Points</label>
                <InputField
                  type="number"
                  min="0"
                  value={formData.per_kg_points}
                  required
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      per_kg_points: e.target.value,
                    })
                  }
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">
                Free Shipping Minimum Order (optional)
              </label>
              <InputField
                type="number"
                min="0"
                value={formData.free_shipping_min_order}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    free_shipping_min_order: e.target.value,
                  })
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

            <div className="flex justify-end gap-3">
              <PrimaryButton
                type="button"
                variant="secondary"
                onClick={() => !isCreating && !isUpdating && setIsModalOpen(false)}
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
                Delete Shipping Rate
              </DialogTitle>
              <DialogDescription className="text-center mt-2">
                Are you sure you want to delete this shipping rate? This action
                is permanent and cannot be undone.
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

      {/* Bulk Create Modal */}
      <Dialog open={isBulkCreateOpen} onOpenChange={setIsBulkCreateOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Bulk Create Shipping Rates</DialogTitle>
            <DialogDescription>
              Apply multiple weight ranges to selected zones for a method.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={submitBulkCreate} className="space-y-4 mt-3">
            <div>
              <label className="text-sm font-medium">Method</label>
              <select
                value={bulkCreateData.method_id}
                onChange={(e) =>
                  setBulkCreateData({
                    ...bulkCreateData,
                    method_id: e.target.value,
                  })
                }
                className="mt-1 w-full border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
                disabled={isOptionsLoading}
              >
                <option value="">Select method</option>
                {methodOptions.map((method) => (
                  <option key={method.value} value={method.value}>
                    {method.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={bulkCreateData.apply_to_all}
                onChange={(e) =>
                  setBulkCreateData({
                    ...bulkCreateData,
                    apply_to_all: e.target.checked,
                  })
                }
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium">Apply to all zones</span>
            </div>

            {!bulkCreateData.apply_to_all && (
              <div>
                <label className="text-sm font-medium">Zones</label>
                <div className="mt-2 border rounded-md p-3 max-h-48 overflow-y-auto space-y-2">
                  {zoneOptions.length ? (
                    zoneOptions.map((zone) => (
                      <label
                        key={zone.value}
                        className="flex items-center gap-2 text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={bulkCreateData.selectedZones.includes(
                            zone.value
                          )}
                          onChange={() => toggleZoneSelection(zone.value)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span>{zone.label}</span>
                      </label>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">
                      No zones available.
                    </p>
                  )}
                </div>
              </div>
            )}

            <div>
              <label className="text-sm font-medium">Weight Ranges</label>
              <div className="mt-2 space-y-3">
                {bulkCreateData.weight_ranges.map((range, idx) => (
                  <div
                    key={`range-${idx}`}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end"
                  >
                    <div className="min-w-0">
                      <InputField
                        type="number"
                        min="0"
                        value={range.from}
                        onChange={(e) =>
                          updateWeightRange(idx, "from", e.target.value)
                        }
                        placeholder="From"
                        aria-label={`Weight from for range ${idx + 1}`}
                      />
                    </div>
                    <div className="min-w-0">
                      <InputField
                        type="number"
                        min="0"
                        value={range.to}
                        onChange={(e) =>
                          updateWeightRange(idx, "to", e.target.value)
                        }
                        placeholder="To"
                        aria-label={`Weight to for range ${idx + 1}`}
                      />
                    </div>
                    <div className="min-w-0">
                      <InputField
                        type="number"
                        min="0"
                        value={range.base}
                        onChange={(e) =>
                          updateWeightRange(idx, "base", e.target.value)
                        }
                        placeholder="Base"
                        aria-label={`Base points for range ${idx + 1}`}
                      />
                    </div>
                    <div className="min-w-0">
                      <InputField
                        type="number"
                        min="0"
                        value={range.per_kg}
                        onChange={(e) =>
                          updateWeightRange(idx, "per_kg", e.target.value)
                        }
                        placeholder="Per Kg"
                        aria-label={`Per kilogram points for range ${
                          idx + 1
                        }`}
                      />
                    </div>
                    <div className="flex gap-2 sm:col-span-2 lg:col-span-1">
                      <PrimaryButton
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => removeWeightRange(idx)}
                        disabled={bulkCreateData.weight_ranges.length === 1}
                      >
                        Remove
                      </PrimaryButton>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3">
                <PrimaryButton
                  type="button"
                  variant="secondary"
                  onClick={addWeightRange}
                >
                  <Plus size={14} /> Add Range
                </PrimaryButton>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">
                Free Shipping Minimum Order (optional)
              </label>
              <InputField
                type="number"
                min="0"
                value={bulkCreateData.free_shipping_min_order}
                onChange={(e) =>
                  setBulkCreateData({
                    ...bulkCreateData,
                    free_shipping_min_order: e.target.value,
                  })
                }
                placeholder="0"
              />
            </div>

            <div className="flex justify-end gap-3">
              <PrimaryButton
                type="button"
                variant="secondary"
                onClick={() =>
                  !isBulkCreating && setIsBulkCreateOpen(false)
                }
                disabled={isBulkCreating}
              >
                Cancel
              </PrimaryButton>

              <PrimaryButton
                type="submit"
                variant="primary"
                disabled={isBulkCreating}
              >
                {isBulkCreating ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  "Bulk Create"
                )}
              </PrimaryButton>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Bulk Delete Modal */}
      <Dialog open={isBulkDeleteOpen} onOpenChange={setIsBulkDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Selected Shipping Rates</DialogTitle>
            <DialogDescription>
              {`You are about to delete ${selectedRates.length} shipping rate(s). This action cannot be undone.`}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={submitBulkDelete} className="space-y-4 mt-3">
            <div className="flex justify-end gap-3">
              <PrimaryButton
                type="button"
                variant="secondary"
                onClick={() =>
                  !isBulkDeleteProcessing && setIsBulkDeleteOpen(false)
                }
                disabled={isBulkDeleteProcessing}
              >
                Cancel
              </PrimaryButton>

              <PrimaryButton
                type="submit"
                variant="danger"
                disabled={isBulkDeleteProcessing}
              >
                {isBulkDeleteProcessing ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  "Delete Selected"
                )}
              </PrimaryButton>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShippingRateSetting;
