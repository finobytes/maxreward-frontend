import React, { useMemo, useState } from "react";
import SearchInput from "../../../components/form/form-elements/SearchInput";
import PrimaryButton from "../../../components/ui/PrimaryButton";
import DropdownSelect from "../../../components/ui/dropdown/DropdownSelect";
import StatusBadge from "../../../components/table/StatusBadge";
import { Eye, Plus } from "lucide-react";
import Pagination from "../../../components/table/Pagination";
import PageBreadcrumb from "../../../components/common/PageBreadcrumb";
import { Link } from "react-router";
import BulkActionBar from "./components/BulkActionBar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const dummyMembers = Array.from({ length: 30 }).map((_, i) => ({
  id: i + 1,
  fullName: `Member ${i + 1}`,
  memberId: `MAX-${4325000 + i}`,
  phone: `+60 12-345 ${6780 + i}`,
  referrals: Math.floor(Math.random() * 100),
  points: Math.floor(Math.random() * 90000),
  status: ["Registered", "Pending", "Rejected"][Math.floor(Math.random() * 3)],
  purchased: Math.floor(Math.random() * 5000),
  created: `Oct ${Math.floor(Math.random() * 28) + 1} 2024`,
}));

const ReferNewMember = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selected, setSelected] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [members, setMembers] = useState(dummyMembers);

  const rowsPerPage = 10;

  const filteredData = useMemo(() => {
    return members.filter((m) => {
      const matchesSearch =
        m.fullName.toLowerCase().includes(search.toLowerCase()) ||
        m.memberId.toLowerCase().includes(search.toLowerCase()) ||
        m.phone.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "All" ? true : m.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter, members]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const toggleSelectAll = (checked) => {
    if (checked) {
      setSelected(paginatedData.map((m) => m.id));
    } else {
      setSelected([]);
    }
  };

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Bulk Actions
  const bulkUpdateStatus = (newStatus) => {
    setMembers((prev) =>
      prev.map((m) =>
        selected.includes(m.id) ? { ...m, status: newStatus } : m
      )
    );
    setSelected([]);
  };

  const bulkDelete = () => {
    setMembers((prev) => prev.filter((m) => !selected.includes(m.id)));
    setSelected([]);
  };

  return (
    <div>
      <PageBreadcrumb
        items={[{ label: "Home", to: "/" }, { label: "Refer New Member" }]}
      />
      <div>
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white p-4">
          <div className="max-w-full overflow-x-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Search */}
              <SearchInput
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search here..."
              />

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                {/* Add Member Button */}
                <PrimaryButton
                  variant="primary"
                  size="md"
                  to="/member/refer-new-member"
                >
                  <Plus size={18} />
                  Refer New Member
                </PrimaryButton>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-4">
                  <DropdownSelect
                    value={statusFilter}
                    onChange={setStatusFilter}
                    options={[
                      { label: "All", value: "All" },
                      { label: "Registered", value: "Registered" },
                      { label: "Rejected", value: "Rejected" },
                      { label: "Pending", value: "Pending" },
                    ]}
                  />
                  <PrimaryButton variant="secondary" size="md">
                    Clear
                  </PrimaryButton>
                </div>
              </div>
            </div>

            {/* Bulk Actions Bar */}
            {selected.length > 0 && (
              <BulkActionBar
                selectedCount={selected.length}
                onSetActive={() => bulkUpdateStatus("Active")}
                onSetBlocked={() => bulkUpdateStatus("Blocked")}
                onSetSuspended={() => bulkUpdateStatus("Suspended")}
                onDelete={bulkDelete}
              />
            )}

            {/* Table */}
            <div className="mt-4 relative overflow-x-auto w-full">
              <Table className="w-full table-auto border-collapse">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40px]">
                      <input
                        type="checkbox"
                        checked={
                          paginatedData.length > 0 &&
                          selected.length === paginatedData.length
                        }
                        onChange={(e) => toggleSelectAll(e.target.checked)}
                        className="w-4 h-4 rounded"
                      />
                    </TableHead>
                    <TableHead className="text-gray-700 font-medium">
                      Member ID
                    </TableHead>
                    <TableHead className="text-gray-700 font-medium">
                      Full Name
                    </TableHead>
                    <TableHead className="text-gray-700 font-medium">
                      Phone Number
                    </TableHead>
                    <TableHead className="text-gray-700 font-medium">
                      Status
                    </TableHead>
                    <TableHead className="text-gray-700 font-medium">
                      Refer Date
                    </TableHead>
                    <TableHead className="text-gray-700 font-medium text-center">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {paginatedData.map((member) => (
                    <TableRow
                      key={member.id}
                      className="hover:bg-gray-50 transition"
                    >
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selected.includes(member.id)}
                          onChange={() => toggleSelect(member.id)}
                          className="w-4 h-4 rounded"
                        />
                      </TableCell>
                      <TableCell>{member.memberId}</TableCell>
                      <TableCell>{member.fullName}</TableCell>
                      <TableCell>{member.phone}</TableCell>
                      <TableCell>
                        <StatusBadge status={member.status} />
                      </TableCell>
                      <TableCell>{member.created}</TableCell>
                      <TableCell>
                        <div className="flex gap-2 justify-center">
                          <Link
                            to=""
                            className="p-2 rounded-md bg-indigo-100 hover:bg-indigo-200 text-indigo-500"
                          >
                            <Eye size={20} />
                          </Link>
                          <button className="p-2 rounded-md bg-blue-100 hover:bg-blue-200 text-blue-500">
                            Re-send
                          </button>
                          <button className="p-2 rounded-md bg-red-100 hover:bg-red-200 text-red-500">
                            Cancel
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferNewMember;
