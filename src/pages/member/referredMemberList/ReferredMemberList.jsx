import React, { useMemo, useState } from "react";
import SearchInput from "../../../components/form/form-elements/SearchInput";
import PrimaryButton from "../../../components/ui/PrimaryButton";
import DropdownSelect from "../../../components/ui/dropdown/DropdownSelect";
import StatusBadge from "../../../components/table/StatusBadge";
import { Eye, Plus } from "lucide-react";
import Pagination from "../../../components/table/Pagination";
import PageBreadcrumb from "../../../components/common/PageBreadcrumb";
import { Link } from "react-router";
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
  status: ["Active", "Suspended", "Inactive"][Math.floor(Math.random() * 3)],
  purchased: Math.floor(Math.random() * 5000),
  created: `Oct ${Math.floor(Math.random() * 28) + 1} 2024`,
}));

const ReferredMemberList = () => {
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

  return (
    <div>
      <PageBreadcrumb
        items={[{ label: "Home", to: "/" }, { label: "Referred Member List" }]}
      />
      <div>
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white p-4">
          <div className="max-w-full overflow-x-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h3 className="text-lg font-semibold text-gray-800">
                My Referred Member List
              </h3>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                {/* Search */}
                <SearchInput
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search here..."
                />
                {/* Add Member Button */}
                <PrimaryButton variant="secondary" size="md">
                  Date Range
                </PrimaryButton>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-4">
                  <DropdownSelect
                    value={statusFilter}
                    onChange={setStatusFilter}
                    options={[
                      { label: "All", value: "All" },
                      { label: "Active", value: "Active" },
                      { label: "Suspended", value: "Suspended" },
                      { label: "Inactive", value: "Inactive" },
                    ]}
                  />
                  <PrimaryButton variant="secondary" size="md">
                    Clear
                  </PrimaryButton>
                </div>
              </div>
            </div>

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
                      Join Date
                    </TableHead>
                    <TableHead className="text-gray-700 font-medium">
                      Status
                    </TableHead>
                    <TableHead className="text-gray-700 font-medium text-center">
                      Available Points
                    </TableHead>
                    <TableHead className="text-gray-700 font-medium text-center">
                      Lifetime Purchases
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {paginatedData.map((member) => (
                    <TableRow
                      key={member.id}
                      className="hover:bg-gray-50 transition py-5"
                    >
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selected.includes(member.id)}
                          onChange={() => toggleSelect(member.id)}
                          className="w-4 h-4 rounded"
                        />
                      </TableCell>
                      <TableCell className="py-5">{member.memberId}</TableCell>
                      <TableCell className="py-5">{member.fullName}</TableCell>
                      <TableCell className="py-5">{member.phone}</TableCell>
                      <TableCell className="py-5">{member.created}</TableCell>
                      <TableCell className="py-5">
                        <StatusBadge status={member.status} />
                      </TableCell>
                      <TableCell className="py-5 text-center">3425</TableCell>
                      <TableCell className="py-5 text-center">425</TableCell>
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

export default ReferredMemberList;
