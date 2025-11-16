import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PageBreadcrumb from "../../../components/common/PageBreadcrumb";
import SearchInput from "../../../components/form/form-elements/SearchInput";
import DropdownSelect from "../../../components/ui/dropdown/DropdownSelect";
import PrimaryButton from "../../../components/ui/PrimaryButton";
import Pagination from "../../../components/table/Pagination";
import StatusBadge from "../../../components/table/StatusBadge";
import { useGetSponsoredMembersQuery } from "../../../redux/features/member/referNewMember/referNewMemberApi";
import { toast } from "sonner";
import BulkActionBar from "../../../components/table/BulkActionBar";
import { Link } from "react-router";
import { Eye } from "lucide-react";

const ReferredMemberList = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  // ✅ Fetch data from backend with pagination params
  const { data, isLoading, isError } = useGetSponsoredMembersQuery({
    page: currentPage,
    search: search,
    status: statusFilter === "All" ? "" : statusFilter,
  });

  const members = data?.data?.sponsored?.data || [];
  const pagination = data?.data?.sponsored;

  const [selected, setSelected] = useState([]);

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

  const handleSearchClear = () => {
    setSearch("");
    setStatusFilter("All");
    setSelected([]);
    setCurrentPage(1);
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p className="text-red-500">Error fetching data</p>;

  return (
    <div>
      <PageBreadcrumb
        items={[{ label: "Home", to: "/" }, { label: "Referred Member List" }]}
      />

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white p-4">
        {/* 🔍 Filters */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <SearchInput
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search..."
          />
          <div className="flex gap-3 items-center">
            <DropdownSelect
              value={statusFilter}
              onChange={(value) => {
                setStatusFilter(value);
                setCurrentPage(1);
              }}
              options={[
                { label: "All", value: "All" },
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
                { label: "Suspend", value: "suspend" },
              ]}
            />
            <PrimaryButton
              variant="secondary"
              size="md"
              onClick={handleSearchClear}
            >
              Clear
            </PrimaryButton>
          </div>
        </div>

        {/* ⚙️ Bulk Actions */}
        {selected.length > 0 && (
          <BulkActionBar
            selectedCount={selected.length}
            actions={[
              {
                label: "Active",
                variant: "success",
                onClick: () => bulkUpdateStatus("active"),
              },
              {
                label: "Inactive",
                variant: "warning",
                onClick: () => bulkUpdateStatus("inactive"),
              },
              {
                label: "Suspend",
                variant: "danger",
                onClick: () => bulkUpdateStatus("suspend"),
              },
            ]}
          />
        )}

        {/* 📋 Table */}
        <div className="mt-4 overflow-x-auto">
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
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-center">Available Points</TableHead>
                <TableHead className="text-center">
                  LifeTime Purchases
                </TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {members.length > 0 ? (
                members.map((member, idx) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selected.includes(member.id)}
                        onChange={() => toggleSelect(member.id)}
                        className="w-4 h-4 rounded"
                      />
                    </TableCell>
                    <TableCell>
                      {(pagination?.current_page - 1) *
                        (pagination?.per_page || 0) +
                        idx +
                        1}
                    </TableCell>
                    <TableCell>{member.name}</TableCell>
                    <TableCell>{member.phone}</TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>
                      <StatusBadge status={member.status} />
                    </TableCell>
                    <TableCell>
                      {new Date(member.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-center">
                      {member.wallet?.available_points ?? "N/A"}
                    </TableCell>
                    <TableCell className="text-center">
                      {member.wallet?.life_time_purchase ?? "N/A"}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center items-center">
                        <Link
                          to="#"
                          className="p-2 rounded-md bg-indigo-100 hover:bg-indigo-200 text-indigo-500"
                        >
                          <Eye size={18} />
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan="10" className="text-center py-6">
                    No members found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* 🧭 Pagination */}
          <Pagination
            currentPage={pagination?.current_page || 1}
            totalPages={pagination?.last_page || 1}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default ReferredMemberList;
