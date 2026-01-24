import React, { useEffect, useMemo, useState } from "react";
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
  useCreateShippingZoneMutation,
  useDeleteShippingZoneMutation,
  useGetShippingZoneRegionsQuery,
  useGetShippingZonesQuery,
  useToggleShippingZoneStatusMutation,
  useUpdateShippingZoneMutation,
} from "../../../redux/features/admin/shippingZone/shippingZoneApi";

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
  zone_code: "",
  region: "",
  description: "",
  postcodesText: "",
  is_active: true,
};

const fallbackRegions = [
  { value: "west_malaysia", label: "West Malaysia" },
  { value: "east_malaysia", label: "East Malaysia" },
  { value: "remote", label: "Remote Areas" },
];

const parsePostcodes = (value) =>
  value
    .split(/[\s,]+/)
    .map((item) => item.trim())
    .filter(Boolean);

const ShippingZone = () => {
  const [localSearch, setLocalSearch] = useState("");
  const debouncedSearch = useDebounced(localSearch, 450);

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [regionFilter, setRegionFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [formData, setFormData] = useState(initialFormState);
  const [editId, setEditId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, regionFilter, statusFilter, perPage]);

  const {
    data: shippingZonesResponse,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetShippingZonesQuery({
    page,
    per_page: perPage,
    search: debouncedSearch,
    region: regionFilter,
    is_active: statusFilter,
  });

  const { data: regionsResponse } = useGetShippingZoneRegionsQuery();

  const [createShippingZone, { isLoading: isCreating }] =
    useCreateShippingZoneMutation();
  const [updateShippingZone, { isLoading: isUpdating }] =
    useUpdateShippingZoneMutation();
  const [deleteShippingZone, { isLoading: isDeleting }] =
    useDeleteShippingZoneMutation();
  const [toggleShippingZoneStatus] = useToggleShippingZoneStatusMutation();

  const regionOptions = useMemo(() => {
    const fromApi = regionsResponse?.data;
    return Array.isArray(fromApi) && fromApi.length ? fromApi : fallbackRegions;
  }, [regionsResponse]);

  const zones =
    shippingZonesResponse?.data?.data || shippingZonesResponse?.data || [];
  const meta =
    shippingZonesResponse?.meta || shippingZonesResponse?.data || {};
  const currentPage = meta?.current_page || page;
  const currentPerPage = meta?.per_page || perPage;
  const totalPages =
    meta?.last_page ||
    Math.max(1, Math.ceil((meta?.total || zones.length) / currentPerPage));

  const openCreateModal = () => {
    setEditId(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const openEditModal = (zone) => {
    setEditId(zone.id);
    setFormData({
      name: zone?.name || "",
      zone_code: zone?.zone_code || "",
      region: zone?.region || "",
      description: zone?.description || "",
      postcodesText: (zone?.areas || [])
        .map((area) => area?.postcode_prefix)
        .filter(Boolean)
        .join(", "),
      is_active: zone?.is_active === 1 || zone?.is_active === true,
    });
    setIsModalOpen(true);
  };

  const submitForm = async (e) => {
    e.preventDefault();
    const postcodes = parsePostcodes(formData.postcodesText);

    if (!postcodes.length) {
      toast.error("Please enter at least one postcode prefix.");
      return;
    }

    const payload = {
      name: formData.name.trim(),
      zone_code: formData.zone_code.trim().toUpperCase(),
      region: formData.region,
      description: formData.description?.trim() || null,
      is_active: formData.is_active,
      postcodes,
    };

    try {
      if (editId) {
        await updateShippingZone({ id: editId, data: payload }).unwrap();
      } else {
        await createShippingZone(payload).unwrap();
      }

      toast.success(
        editId
          ? "Shipping zone updated successfully!"
          : "Shipping zone created successfully!"
      );
      setIsModalOpen(false);
      setFormData(initialFormState);
      setEditId(null);
      refetch();
    } catch (error) {
      toast.error(
        error?.data?.message || "Failed to save shipping zone. Try again."
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
      await deleteShippingZone(deleteId).unwrap();
      toast.success("Shipping zone deleted successfully!");
      setIsDeleteModalOpen(false);
      setDeleteId(null);
      refetch();
    } catch (error) {
      toast.error(
        error?.data?.message || "Failed to delete shipping zone."
      );
    }
  };

  const handleToggleStatus = async (zone) => {
    if (!zone?.id) return;
    setTogglingId(zone.id);
    try {
      await toggleShippingZoneStatus(zone.id).unwrap();
      toast.success("Zone status updated successfully!");
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update zone status.");
    } finally {
      setTogglingId(null);
    }
  };

  const getRegionLabel = (value) => {
    if (!value) return "N/A";
    const found = regionOptions.find((r) => r.value === value);
    if (found) return found.label;
    return value
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const resetFilters = () => {
    setLocalSearch("");
    setRegionFilter("");
    setStatusFilter("");
    setPerPage(10);
    setPage(1);
  };

  return (
    <div>
      <PageBreadcrumb
        items={[{ label: "Home", to: "/" }, { label: "Shipping Zones" }]}
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
            placeholder="Search by name or zone code..."
          />

          <div className="flex flex-wrap items-center gap-3">
            <PrimaryButton variant="primary" onClick={openCreateModal}>
              <Plus size={16} /> Create
            </PrimaryButton>

            <DropdownSelect
              value={regionFilter}
              onChange={(val) => setRegionFilter(val)}
              options={[
                { label: "All Regions", value: "" },
                ...regionOptions.map((region) => ({
                  label: region.label,
                  value: region.value,
                })),
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

        {/* Table */}
        <div className="mt-4 overflow-x-auto">
          {isLoading ? (
            <MerchantStaffSkeleton rows={8} cols={6} />
          ) : isError ? (
            <div className="p-6 text-center text-red-500">
              Failed to load shipping zones.
            </div>
          ) : !zones.length ? (
            <div className="p-6 text-center text-gray-500">
              No shipping zones found.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>S/N</TableHead>
                  <TableHead>Zone Name</TableHead>
                  <TableHead>Zone Code</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead className="min-w-[220px]">Postcodes</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {zones.map((zone, idx) => {
                  const isActive =
                    zone?.is_active === 1 || zone?.is_active === true;
                  const areas = zone?.areas || [];

                  return (
                    <TableRow key={zone.id}>
                      <TableCell>
                        {(currentPage - 1) * currentPerPage + (idx + 1)}
                      </TableCell>
                      <TableCell className="font-medium">
                        {zone.name}
                      </TableCell>
                      <TableCell className="text-xs text-gray-600">
                        {zone.zone_code}
                      </TableCell>
                      <TableCell>{getRegionLabel(zone.region)}</TableCell>
                      <TableCell className="whitespace-normal break-words">
                        {areas.length ? (
                          <div className="flex flex-wrap gap-1">
                            {areas.map((area) => (
                              <span
                                key={`${zone.id}-${area.id || area.postcode_prefix}`}
                                className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                              >
                                {area.postcode_prefix}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-500">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(zone)}
                          disabled={togglingId === zone.id}
                          className={`px-2 py-1 rounded-full text-xs font-medium transition ${
                            isActive
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-red-100 text-red-700 hover:bg-red-200"
                          } ${
                            togglingId === zone.id
                              ? "opacity-70 cursor-not-allowed"
                              : ""
                          }`}
                          title="Toggle status"
                        >
                          {togglingId === zone.id ? (
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
                            onClick={() => openEditModal(zone)}
                            className="p-2 rounded-md bg-blue-100 text-blue-600 hover:bg-blue-200"
                          >
                            <PencilLine size={16} />
                          </button>
                          <button
                            onClick={() => openDeleteModal(zone.id)}
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editId ? "Edit Shipping Zone" : "Create Shipping Zone"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={submitForm} className="space-y-4 mt-3">
            <div>
              <label className="text-sm font-medium">Zone Name</label>
              <InputField
                type="text"
                value={formData.name}
                required
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter zone name"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Zone Code</label>
              <InputField
                type="text"
                value={formData.zone_code}
                required
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    zone_code: e.target.value.toUpperCase(),
                  })
                }
                placeholder="e.g. WM_CENTRAL"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Region</label>
              <select
                value={formData.region}
                onChange={(e) =>
                  setFormData({ ...formData, region: e.target.value })
                }
                className="mt-1 w-full border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              >
                <option value="">Select region</option>
                {regionOptions.map((region) => (
                  <option key={region.value} value={region.value}>
                    {region.label}
                  </option>
                ))}
              </select>
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

            <div>
              <label className="text-sm font-medium">
                Postcode Prefixes
              </label>
              <textarea
                value={formData.postcodesText}
                onChange={(e) =>
                  setFormData({ ...formData, postcodesText: e.target.value })
                }
                className="mt-1 w-full border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="e.g. 40, 41, 50, 51"
                rows={3}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Separate postcodes with commas, spaces, or new lines.
              </p>
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
                Delete Shipping Zone
              </DialogTitle>
              <DialogDescription className="text-center mt-2">
                Are you sure you want to delete this shipping zone? This action
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
    </div>
  );
};

export default ShippingZone;
