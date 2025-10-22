import React, { useEffect, useState } from "react";
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
import BulkActionBar from "./components/BulkActionBar";

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
  const dispatch = useDispatch();
  const { search, status, page, perPage, memberType } = useSelector(
    (s) => s.memberManagement
  );

  const [localSearch, setLocalSearch] = useState(search || "");
  const debouncedSearch = useDebounced(localSearch, 450);

  useEffect(() => {
    dispatch(setSearch(debouncedSearch));
  }, [debouncedSearch, dispatch]);

  const { members, meta, isLoading, isFetching, isError } = useMembers();

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
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const bulkUpdateStatus = (newStatus) => {
    toast.warning(`Bulk update to ${newStatus} (not implemented yet)`);
  };

  const bulkDelete = () => {
    toast("Bulk delete (not implemented yet)");
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
            placeholder="Search by name, phone, username..."
          />

          <div className="flex flex-wrap items-center gap-3">
            <PrimaryButton to="/admin/member-registration" variant="primary">
              <Plus size={16} /> Register Member
            </PrimaryButton>
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
                setSelected("");
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
            onSetActive={() => bulkUpdateStatus("Active")}
            onSetBlocked={() => bulkUpdateStatus("Blocked")}
            onSetSuspended={() => bulkUpdateStatus("Suspended")}
            onDelete={bulkDelete}
          />
        )}

        <div className="mt-4 relative overflow-x-auto w-full">
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
                  <TableHead>Member ID</TableHead>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Total Referrals</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead>Lifetime Purchase</TableHead>
                  <TableHead>Date Registered</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selected.includes(m.id)}
                        onChange={() => toggleSelect(m.id)}
                        className="w-4 h-4 rounded"
                      />
                    </TableCell>
                    <TableCell>{m.user_name}</TableCell>
                    <TableCell>{m.name}</TableCell>
                    <TableCell>{m.phone}</TableCell>
                    <TableCell>{m.wallet?.total_referrals ?? "N/A"}</TableCell>
                    <TableCell>{m.wallet?.available_points ?? "N/A"}</TableCell>
                    <TableCell>
                      {m.wallet?.lifetime_purchase_amount ?? "N/A"}
                    </TableCell>
                    <TableCell>
                      {new Date(m.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Link
                          to={`/admin/member-manage/details/${m.id}`}
                          className="p-2 rounded-md bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
                        >
                          <Eye size={16} />
                        </Link>
                        <Link
                          to={`/admin/member-manage/edit/${m.id}`}
                          className="p-2 rounded-md bg-blue-100 text-blue-600 hover:bg-blue-200"
                        >
                          <PencilLine size={16} />
                        </Link>
                        <div className="flex gap-1.5">
                          <button className="px-2 rounded-md bg-red-600 text-white hover:bg-red-500 focus:ring-red-600">
                            Block
                          </button>
                          <button className="px-2 rounded-md bg-yellow-500 text-black hover:bg-yellow-400 focus:ring-yellow-500">
                            Suspend
                          </button>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
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
    </div>
  );
};

export default MemberManage;
