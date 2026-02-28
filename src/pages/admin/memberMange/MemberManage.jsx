import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { useDispatch, useSelector } from "react-redux";
import { Eye, PencilLine, Trash2Icon, Plus, Loader } from "lucide-react";
import { Link } from "react-router";
import {
  setSearch,
  setStatus,
  setMemberType,
  setPage,
  setPerPage,
  resetFilters,
} from "../../../redux/features/admin/memberManagement/memberManagementSlice";
import { useMembers } from "../../../redux/features/admin/memberManagement/useMembers";
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
import { toast } from "sonner";
import BulkActionBar from "../../../components/table/BulkActionBar";
import { memberQR } from "../../../assets/assets";
import {
  useUpdateStatusMutation,
  useBlockOrSuspendMemberMutation,
} from "../../../redux/features/admin/memberManagement/memberManagementApi";
import StatusBadge from "../../../components/table/StatusBadge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "../../../components/ui/dialog";
import HasPermission from "@/components/common/HasPermission";

const useDebounced = (value, delay = 400) => {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
};

const MemberManage = () => {
  const [selected, setSelected] = useState([]);
  const [updatingId, setUpdatingId] = useState(null);
  const [actionDialog, setActionDialog] = useState({
    open: false,
    action: null,
    member: null,
    reason: "",
    error: "",
  });
  const [qrModal, setQrModal] = useState({ open: false, data: null });

  const dispatch = useDispatch();
  const { search, status, perPage, memberType } = useSelector(
    (s) => s.memberManagement,
  );

  const { members, meta, isLoading, isFetching, isError } = useMembers();

  const backendCurrentPage = meta?.current_page ?? 1;
  const backendPerPage = meta?.per_page ?? members.length;

  const [localSearch, setLocalSearch] = useState(search || "");
  const debouncedSearch = useDebounced(localSearch, 450);

  useEffect(() => {
    dispatch(setSearch(debouncedSearch));
  }, [debouncedSearch, dispatch]);

  const [updateStatus] = useUpdateStatusMutation();
  const [blockOrSuspendMember] = useBlockOrSuspendMemberMutation();

  const handlePageChange = (p) => dispatch(setPage(p));
  const handlePerPageChange = (n) => dispatch(setPerPage(n));

  const toggleSelectAll = (checked) => {
    if (checked) {
      setSelected(members.map((m) => m.id));
    } else {
      setSelected([]);
    }
  };

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const bulkUpdateStatus = (newStatus) => {
    toast.warning(`Bulk update to ${newStatus} (not implemented yet)`);
  };

  const handleStatusChange = async (id, newStatus, reasonText = "") => {
    try {
      setUpdatingId(id);

      const normalizedStatus = (newStatus || "").toLowerCase();
      const trimmedReason =
        typeof reasonText === "string" ? reasonText.trim() : "";

      if (
        ["blocked", "suspended"].includes(normalizedStatus) &&
        !trimmedReason
      ) {
        toast.error("Reason is required to update member status.");
        return false;
      }

      if (["blocked", "suspended"].includes(normalizedStatus)) {
        await blockOrSuspendMember({
          memberId: id,
          status: normalizedStatus,
          reason: trimmedReason,
        }).unwrap();
      } else {
        await updateStatus({
          id,
          formData: { status: normalizedStatus },
        }).unwrap();
      }

      toast.success(`Member status updated to ${normalizedStatus}`);
      return true;
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update member status");
      return false;
    } finally {
      setUpdatingId(null);
    }
  };

  const openActionDialog = (member, action) => {
    setActionDialog({
      open: true,
      action,
      member,
      reason: "",
      error: "",
    });
  };

  const closeActionDialog = () =>
    setActionDialog({
      open: false,
      action: null,
      member: null,
      reason: "",
      error: "",
    });

  const submitActionDialog = async () => {
    if (!actionDialog.member || !actionDialog.action) return;
    const trimmedReason = actionDialog.reason.trim();

    if (!trimmedReason) {
      setActionDialog((prev) => ({
        ...prev,
        error: "Reason is required.",
      }));
      return;
    }

    const targetStatus =
      actionDialog.action === "block" ? "blocked" : "suspended";

    const success = await handleStatusChange(
      actionDialog.member.id,
      targetStatus,
      trimmedReason,
    );

    if (success) {
      closeActionDialog();
    }
  };

  return (
    <div>
      <PageBreadcrumb
        items={[{ label: "Home", to: "/" }, { label: "Member Management" }]}
      />
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <SearchInput
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search by name, phone"
          />

          <div className="flex flex-wrap items-center gap-3">
            <HasPermission required="admin.member manage.member manage.create">
              <PrimaryButton to="/admin/member-registration" variant="primary">
                <Plus size={16} /> Register Member
              </PrimaryButton>
            </HasPermission>
            <DropdownSelect
              value={memberType}
              onChange={(val) => dispatch(setMemberType(val))}
              options={[
                { label: "All Members", value: "all" },
                { label: "General", value: "general" },
                { label: "Corporate", value: "corporate" },
              ]}
            />
            <DropdownSelect
              value={status}
              onChange={(val) => dispatch(setStatus(val))}
              options={[
                { label: "All", value: "all" },
                { label: "Active", value: "active" },
                { label: "Blocked", value: "blocked" },
                { label: "Suspended", value: "suspended" },
              ]}
            />

            <DropdownSelect
              value={perPage}
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
                dispatch(resetFilters());
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
              // {
              //   label: "Activate",
              //   variant: "success",
              //   onClick: () => bulkUpdateStatus("active"),
              // },
              {
                label: "Block",
                variant: "danger",
                onClick: () => bulkUpdateStatus("blocked"),
              },
              {
                label: "Suspend",
                variant: "warning",
                onClick: () => bulkUpdateStatus("suspended"),
              },
              // { label: "Delete", variant: "danger", onClick: bulkDelete },
            ]}
          />
        )}

        <div className="mt-4 relative overflow-x-auto w-full custom-scrollbar ">
          {isFetching && !isLoading && (
            <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-sm flex items-center justify-center rounded-xl">
              <Loader className="w-6 h-6 animate-spin text-gray-500" />
            </div>
          )}

          {isLoading ? (
            <MerchantStaffSkeleton rows={8} cols={8} />
          ) : isError ? (
            <div className="p-6 text-center text-red-500">
              Failed to load members.
            </div>
          ) : members.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No members found.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <input
                      type="checkbox"
                      checked={
                        members.length > 0 && selected.length === members.length
                      }
                      onChange={(e) => toggleSelectAll(e.target.checked)}
                      className="w-4 h-4 rounded"
                    />
                  </TableHead>
                  <TableHead>S/N</TableHead>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Total Referrals</TableHead>
                  <TableHead>Available Points</TableHead>
                  <TableHead>Lifetime Purchase</TableHead>
                  <TableHead>Date Registered</TableHead>
                  <TableHead>QR</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((m, idx) => {
                  const normalizedStatus = (m.status || "").toLowerCase();
                  const isBlocked = normalizedStatus === "blocked";
                  const isSuspended = normalizedStatus === "suspended";

                  return (
                    <TableRow key={m.id}>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selected.includes(m.id)}
                          onChange={() => toggleSelect(m.id)}
                          className="w-4 h-4 rounded"
                        />
                      </TableCell>
                      <TableCell>
                        {(backendCurrentPage - 1) * backendPerPage + (idx + 1)}
                      </TableCell>
                      <TableCell className="whitespace-normal break-words">
                        {m.name}
                      </TableCell>
                      <TableCell>{m.member_type}</TableCell>
                      <TableCell>{m.phone}</TableCell>
                      <TableCell>
                        {m.wallet?.total_referrals ?? "N/A"}
                      </TableCell>
                      <TableCell>
                        {m.wallet?.available_points ?? "N/A"}
                      </TableCell>
                      <TableCell>
                        {m.wallet?.lifetime_purchase_amount ?? "N/A"}
                      </TableCell>
                      <TableCell>
                        {new Date(m.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div
                          className="cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => setQrModal({ open: true, data: m })}
                        >
                          <img
                            src={memberQR}
                            alt="QR Code"
                            className="w-12 h-12 object-contain"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={m.status} />
                      </TableCell>
                      <TableCell className="whitespace-normal break-words">
                        <div className="flex gap-2">
                          <HasPermission required="admin.member manage.member manage.view">
                            <Link
                              to={`/admin/member-manage/details/${m.id}`}
                              className="p-2 rounded-md bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
                            >
                              <Eye size={16} />
                            </Link>
                          </HasPermission>
                          <HasPermission required="admin.member manage.member manage.edit">
                            <Link
                              to={`/admin/member-manage/edit/${m.id}`}
                              className="p-2 rounded-md bg-blue-100 text-blue-600 hover:bg-blue-200"
                            >
                              <PencilLine size={16} />
                            </Link>
                          </HasPermission>
                          {isBlocked ? (
                            <button
                              onClick={() => handleStatusChange(m.id, "active")}
                              disabled={updatingId === m.id}
                              className="px-2 rounded-md bg-green-100 text-green-700 hover:bg-green-200 disabled:opacity-50"
                            >
                              {updatingId === m.id ? "Updating..." : "Unblock"}
                            </button>
                          ) : (
                            <button
                              onClick={() => openActionDialog(m, "block")}
                              disabled={updatingId === m.id}
                              className="px-2 rounded-md bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50"
                            >
                              {updatingId === m.id ? "Updating..." : "Block"}
                            </button>
                          )}

                          {isSuspended ? (
                            <button
                              onClick={() => handleStatusChange(m.id, "active")}
                              disabled={updatingId === m.id}
                              className="px-2 rounded-md bg-green-100 text-green-700 hover:bg-green-200 disabled:opacity-50"
                            >
                              {updatingId === m.id
                                ? "Updating..."
                                : "Unsuspend"}
                            </button>
                          ) : (
                            <button
                              onClick={() => openActionDialog(m, "suspend")}
                              disabled={updatingId === m.id}
                              className="px-2 rounded-md bg-yellow-100 text-gray-700 hover:bg-yellow-200 disabled:opacity-50"
                            >
                              {updatingId === m.id ? "Updating..." : "Suspend"}
                            </button>
                          )}
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
          currentPage={meta.current_page}
          totalPages={meta.last_page}
          onPageChange={handlePageChange}
        />
      </div>

      <Dialog
        open={actionDialog.open}
        onOpenChange={(open) => {
          if (!open) closeActionDialog();
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {actionDialog.action === "suspend"
                ? "Suspend Member"
                : "Block Member"}
            </DialogTitle>
            <DialogDescription>
              {actionDialog.action === "suspend"
                ? `Provide a reason for suspending ${
                    actionDialog.member?.name || "this member"
                  }.`
                : `Provide a reason for blocking ${
                    actionDialog.member?.name || "this member"
                  }.`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <label
              htmlFor="member-action-reason"
              className="text-sm font-medium text-gray-700"
            >
              Reason
            </label>
            <textarea
              id="member-action-reason"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              rows={4}
              placeholder="Add a brief justification..."
              value={actionDialog.reason}
              onChange={(e) =>
                setActionDialog((prev) => ({
                  ...prev,
                  reason: e.target.value,
                  error: "",
                }))
              }
            />
            {actionDialog.error && (
              <p className="text-sm text-red-500">{actionDialog.error}</p>
            )}
          </div>

          <DialogFooter className="gap-3">
            <button
              type="button"
              onClick={closeActionDialog}
              className="px-4 py-2 text-sm rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              disabled={updatingId === actionDialog.member?.id}
            >
              Cancel
            </button>
            <PrimaryButton
              variant={actionDialog.action === "block" ? "danger" : "warning"}
              size="md"
              onClick={submitActionDialog}
              disabled={updatingId === actionDialog.member?.id}
            >
              {updatingId === actionDialog.member?.id
                ? "Submitting..."
                : "Submit"}
            </PrimaryButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog
        open={qrModal.open}
        onOpenChange={(open) => {
          if (!open) setQrModal({ open: false, data: null });
        }}
      >
        <DialogContent className="sm:max-w-sm flex flex-col items-center">
          <DialogHeader>
            <DialogTitle className="text-center">
              {qrModal.data?.name}'s QR Code
            </DialogTitle>
            <DialogDescription className="text-center">
              Scan to view details
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100">
            {qrModal.data?.user_name ? (
              <QRCode
                value={qrModal.data.user_name}
                size={200}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                viewBox={`0 0 256 256`}
              />
            ) : (
              <div className="w-[200px] h-[200px] flex items-center justify-center bg-gray-50 text-gray-400 text-sm">
                No user_name found
              </div>
            )}
          </div>
          <p className="text-sm font-medium text-gray-500 mt-2">
            {qrModal.data?.user_name}
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MemberManage;
