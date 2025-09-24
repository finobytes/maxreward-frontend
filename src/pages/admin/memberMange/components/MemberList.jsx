import {
  ChevronDown,
  Eye,
  PencilLine,
  Plus,
  Trash2Icon,
  X,
} from "lucide-react";
import React, { useState, useMemo } from "react";
import { Link } from "react-router";
import { userImage } from "../../../../assets/assets";
import StatusBadge from "../../../../components/table/StatusBadge";
import SearchInput from "../../../../components/form/SearchInput";
import DropdownSelect from "../../../../components/ui/dropdown/DropdownSelect";
import PrimaryButton from "../../../../components/ui/PrimaryButton";

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

const MemberList = () => {
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
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white p-4">
      <div className="max-w-full overflow-x-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h3 className="text-lg font-semibold text-gray-800">
            All Member List
          </h3>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            {/* Search */}
            <SearchInput />
            {/* <form className="relative flex-1 sm:flex-none">
              <button
                type="button"
                className="absolute -translate-y-1/2 left-4 top-1/2 text-gray-500"
              >
                {" "}
                <svg
                  className="fill-gray-500"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {" "}
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
                  />{" "}
                </svg>{" "}
              </button>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Here ..."
                className="w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-10 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  <X size={16} />
                </button>
              )}
            </form> */}
            {/* Add Member Button */}
            <PrimaryButton variant="primary" size="md" to="/members/register">
              <Plus size={18} />
              Register New Member
            </PrimaryButton>

            {/* Sort Dropdown */}
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
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {selected.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2 bg-gray-50 p-3 rounded-md border">
            <p className="text-sm text-gray-700">{selected.length} selected</p>
            <button
              onClick={() => bulkUpdateStatus("Active")}
              className="px-3 py-1 text-sm rounded-md bg-green-600 text-white hover:bg-green-500"
            >
              Set Active
            </button>
            <button
              onClick={() => bulkUpdateStatus("Blocked")}
              className="px-3 py-1 text-sm rounded-md bg-red-600 text-white hover:bg-red-500"
            >
              Set Blocked
            </button>
            <button
              onClick={() => bulkUpdateStatus("Suspended")}
              className="px-3 py-1 text-sm rounded-md bg-yellow-600 text-white hover:bg-yellow-500"
            >
              Set Suspended
            </button>
            <button
              onClick={bulkDelete}
              className="px-3 py-1 text-sm rounded-md bg-gray-700 text-white hover:bg-gray-600"
            >
              Delete Selected
            </button>
          </div>
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
                    <button className="p-2 rounded-md bg-indigo-100 hover:bg-indigo-200 text-indigo-500">
                      <Eye size={16} />
                    </button>
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
          <nav
            className="flex items-center flex-column flex-wrap md:flex-row justify-between pt-4"
            aria-label="Table navigation"
          >
            <span className="text-sm font-normal text-gray-500 mb-4 md:mb-0 block w-full md:inline md:w-auto">
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {(currentPage - 1) * rowsPerPage + 1}-
                {Math.min(currentPage * rowsPerPage, filteredData.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900">
                {filteredData.length}
              </span>
            </span>
            <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
              <li>
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
                >
                  Previous
                </button>
              </li>
              {Array.from({ length: totalPages }).map((_, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`flex items-center justify-center px-3 h-8 border border-gray-300 ${
                      currentPage === idx + 1
                        ? "text-white bg-brand-600"
                        : "text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700"
                    }`}
                  >
                    {idx + 1}
                  </button>
                </li>
              ))}
              <li>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default MemberList;
