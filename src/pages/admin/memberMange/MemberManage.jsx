import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Eye,
  PencilLine,
  Trash2Icon,
  Plus,
  ChevronUp,
  ChevronDown,
  Loader,
} from "lucide-react";
import { Link } from "react-router";
import {
  setSearch,
  setStatus,
  setMemberType,
  setPage,
  setPerPage,
  setSort,
  resetFilters,
} from "../../../redux/features/admin/memberManagement/memberManagementSlice";
import { useMembers } from "../../../redux/features/admin/memberManagement/useMembers";
import SearchInput from "../../../components/form/form-elements/SearchInput";
import DropdownSelect from "../../../components/ui/dropdown/DropdownSelect";
import PrimaryButton from "../../../components/ui/PrimaryButton";
import Pagination from "../../../components/table/Pagination";
import StatusBadge from "../../../components/table/StatusBadge";
import PageBreadcrumb from "../../../components/common/PageBreadcrumb";
import { memberQR, userImage } from "../../../assets/assets";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import MerchantStaffSkeleton from "../../../components/skeleton/MerchantStaffSkeleton";

const useDebounced = (value, delay = 400) => {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
};

const SortIcon = ({ active, order }) => {
  if (!active) return <span className="opacity-30">↕</span>;
  return order === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
};

const MemberManage = () => {
  const dispatch = useDispatch();
  const { search, status, page, perPage, sortBy, sortOrder, memberType } =
    useSelector((s) => s.memberManagement);

  // local input for immediate typing (debounced into redux search)
  const [localSearch, setLocalSearch] = useState(search || "");
  const debouncedSearch = useDebounced(localSearch, 450);

  useEffect(() => {
    // update redux search only when debounced value changes
    dispatch(setSearch(debouncedSearch));
  }, [debouncedSearch, dispatch]);

  const { members, meta, isLoading, isError } = useMembers();

  // sync page change events coming from Pagination component
  const handlePageChange = (p) => dispatch(setPage(p));
  const handlePerPageChange = (n) => dispatch(setPerPage(n));

  const handleSort = (column) => {
    // toggle sort order when clicking same column
    if (sortBy === column) {
      dispatch(
        setSort({
          sortBy: column,
          sortOrder: sortOrder === "asc" ? "desc" : "asc",
        })
      );
    } else {
      dispatch(setSort({ sortBy: column, sortOrder: "desc" }));
    }
  };

  console.log("Members:", members, "Meta:", meta);

  return (
    <div>
      <PageBreadcrumb
        items={[{ label: "Home", to: "/" }, { label: "Member Management" }]}
      />

      <div className="rounded-xl border bg-white p-4">
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
                { label: "All", value: "all" },
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
              onClick={() => dispatch(resetFilters())}
            >
              Clear
            </PrimaryButton>
          </div>
        </div>

        {/* Table */}
        <div className="mt-4 relative overflow-x-auto">
          {/* Overlay spinner on interactions */}
          {/* {isLoading && (
            <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-sm flex items-center justify-center">
              <Loader className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          )} */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="p-4">
                  <input type="checkbox" className="w-4 h-4 rounded" />
                </TableHead>

                <TableHead>Member ID</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead className="hidden md:table-cell">
                  Total Referrals
                </TableHead>
                <TableHead className="hidden lg:table-cell">
                  Available Points
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  Lifetime Purchase
                </TableHead>
                <TableHead>Date Registered</TableHead>
                <TableHead>QR</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {/* Skeleton Loading */}
              {isLoading && !members?.length ? (
                <MerchantStaffSkeleton rows={8} cols={7} />
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center text-red-500">
                    Failed to load members.
                  </TableCell>
                </TableRow>
              ) : members?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center text-gray-500">
                    No members found.
                  </TableCell>
                </TableRow>
              ) : (
                members.map((m) => (
                  <TableRow
                    key={m.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <TableCell className="p-4">
                      <input type="checkbox" className="w-4 h-4 rounded" />
                    </TableCell>
                    <TableCell>{m?.user_name}</TableCell>
                    {/* Name + Avatar */}
                    <TableCell className="py-3">
                      {/* <div className="flex items-center gap-3"> */}
                      {/* <img
                          src={userImage}
                          alt="user"
                          className="w-10 h-10 rounded-full border"
                        /> */}
                      <div>
                        <div className="font-medium text-gray-900">
                          {m?.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {m?.wallet?.unlocked_level} Star Member
                        </div>
                      </div>
                      {/* </div> */}
                    </TableCell>

                    <TableCell>{m?.phone}</TableCell>
                    <TableCell>{m?.wallet?.total_referrals ?? "N/A"}</TableCell>
                    <TableCell>
                      {m?.wallet?.available_points ?? "N/A"}
                    </TableCell>
                    <TableCell>
                      {m?.wallet?.lifetime_purchase_amount ?? "N/A"}
                    </TableCell>
                    <TableCell>
                      {new Date(m?.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <img
                        src={memberQR}
                        alt="Member QR Code"
                        className="w-7 h-7"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Link
                          to={`/admin/member-manage/${m?.id}`}
                          className="p-2 rounded-md bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
                        >
                          <Eye size={16} />
                        </Link>
                        <button className="p-2 rounded-md bg-blue-100 text-blue-600 hover:bg-blue-200">
                          <PencilLine size={16} />
                        </button>
                        <button className="p-2 rounded-md bg-red-100 text-red-600 hover:bg-red-200">
                          <Trash2Icon size={16} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination (server) */}
        <div className="mt-4">
          <Pagination
            currentPage={meta.current_page}
            totalPages={meta.last_page}
            onPageChange={(p) => dispatch(setPage(p))}
          />
        </div>
      </div>
    </div>
  );
};

export default MemberManage;
