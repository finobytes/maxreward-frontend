import React, { useMemo, useState } from "react";
import SearchInput from "../../../components/form/form-elements/SearchInput";
import PrimaryButton from "../../../components/ui/PrimaryButton";
import DropdownSelect from "../../../components/ui/dropdown/DropdownSelect";
import BulkActionBar from "./components/BulkActionBar";
import { userImage } from "../../../assets/assets";
import StatusBadge from "../../../components/table/StatusBadge";
import { Eye, PencilLine, Trash2Icon, Plus } from "lucide-react";
import Pagination from "../../../components/table/Pagination";
import PageBreadcrumb from "../../../components/common/PageBreadcrumb";
import { Link } from "react-router";

const dummyMembers = Array.from({ length: 55 }).map((_, i) => ({
  id: i + 1,
  fullName: `Member ${i + 1}`,
  memberId: `MAX-${4325000 + i}`,
  phone: `+60 12-345 ${6780 + i}`,
  referrals: Math.floor(Math.random() * 100),
  points: Math.floor(Math.random() * 90000),
  status: ["Active", "Blocked", "Suspended"][Math.floor(Math.random() * 3)],
  purchased: Math.floor(Math.random() * 5000),
  created: `Oct ${Math.floor(Math.random() * 28) + 1} 2024`,
}));

const MemberManage = () => {
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
        items={[{ label: "Home", to: "/" }, { label: "Member Manage" }]}
      />
      <div>
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white p-4">
          <div className="max-w-full overflow-x-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h3 className="text-lg font-semibold text-gray-800">
                All Member List
              </h3>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                {/* Search */}
                <SearchInput
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search here..."
                />
                {/* Add Member Button */}
                <PrimaryButton
                  variant="primary"
                  size="md"
                  to="/admin/member-registration"
                >
                  <Plus size={18} />
                  Register New Member
                </PrimaryButton>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-4">
                  <DropdownSelect
                    value={statusFilter}
                    onChange={setStatusFilter}
                    options={[
                      { label: "All", value: "All" },
                      { label: "Active", value: "Active" },
                      { label: "Blocked", value: "Blocked" },
                      { label: "Suspended", value: "Suspended" },
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
            <div className="mt-4 relative overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th className="p-4">
                      <input
                        type="checkbox"
                        checked={
                          paginatedData.length > 0 &&
                          selected.length === paginatedData.length
                        }
                        onChange={(e) => toggleSelectAll(e.target.checked)}
                        className="w-4 h-4 rounded"
                      />
                    </th>
                    <th className="py-3">Full Name</th>
                    <th className="py-3">Member ID</th>
                    <th className="py-3">Phone</th>
                    <th className="py-3">Referrals</th>
                    <th className="py-3">Points</th>
                    <th className="py-3">Status</th>
                    <th className="py-3">Purchased (RM)</th>
                    <th className="py-3">Created</th>
                    <th className="py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((member) => (
                    <tr
                      key={member.id}
                      className="bg-white border-b hover:bg-gray-50 transition"
                    >
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selected.includes(member.id)}
                          onChange={() => toggleSelect(member.id)}
                          className="w-4 h-4 rounded"
                        />
                      </td>
                      <td className="py-4 flex items-center gap-3">
                        <img
                          src={userImage}
                          alt="user"
                          className="w-10 h-10 rounded-full object-cover border"
                        />
                        <div>
                          <p className="font-medium text-gray-900">
                            {member.fullName}
                          </p>
                          <p className="text-xs text-gray-500">4 Star Member</p>
                        </div>
                      </td>
                      <td className="py-4">{member.memberId}</td>
                      <td className="py-4">{member.phone}</td>
                      <td className="py-4 text-center">{member.referrals}</td>
                      <td className="py-4">{member.points}</td>
                      <td className="py-4">
                        <StatusBadge status={member.status} />
                      </td>
                      <td className="py-4">{member.purchased}</td>
                      <td className="py-4">{member.created}</td>
                      <td className="py-4 flex gap-2">
                        <Link
                          to="/admin/member-details"
                          className="p-2 rounded-md bg-indigo-100 hover:bg-indigo-200 text-indigo-500"
                        >
                          <Eye size={16} />
                        </Link>
                        <button className="p-2 rounded-md bg-blue-100 hover:bg-blue-200 text-blue-500">
                          <PencilLine size={16} />
                        </button>
                        <button className="p-2 rounded-md bg-red-100 hover:bg-red-200 text-red-500">
                          <Trash2Icon size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

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

export default MemberManage;
