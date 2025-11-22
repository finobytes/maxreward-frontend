import { useState, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PrimaryButton from "../../../../components/ui/PrimaryButton";
import SearchInput from "../../../../components/form/form-elements/SearchInput";
import Pagination from "./../../../../components/table/Pagination";
import { UserSquare2 } from "lucide-react";

const Staff = ({ staffData }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState("10");
  const [search, setSearch] = useState("");

  // staff list
  const staffList = staffData?.data || [];

  // 🔍 Filter by search
  const filteredStaff = useMemo(() => {
    return staffList.filter((item) => {
      const s = search.toLowerCase();
      return (
        item.name.toLowerCase().includes(s) ||
        item.email?.toLowerCase().includes(s) ||
        item.phone?.toLowerCase().includes(s) ||
        item.user_name?.toLowerCase().includes(s)
      );
    });
  }, [staffList, search]);

  const totalPages = 1;
  const startIndex = (currentPage - 1) * Number(entriesPerPage);

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
        <div className="bg-white border-0 shadow-sm p-2 rounded-b-sm">
          <div className="flex justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">Total Staff</p>
              <p className="text-xl font-semibold text-gray-900">
                {filteredStaff.length}
              </p>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <UserSquare2 className="w-4 h-4 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* User Statement Section */}
      <div className="mt-6 p-4">
        <div className="lg:flex lg:items-center lg:justify-between">
          <h2 className="font-semibold text-gray-900">All Staff List</h2>
          <div className="flex gap-2 mt-2 lg:mt-0">
            <PrimaryButton variant="secondary">Add New Staff</PrimaryButton>
            <PrimaryButton>Export as CSV</PrimaryButton>
            <PrimaryButton variant="secondary">Export as PDF</PrimaryButton>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-10 lg:flex lg:items-center lg:justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Show</span>
            <Select value={entriesPerPage} onValueChange={setEntriesPerPage}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="relative mt-4 lg:mt-0">
            <SearchInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search here..."
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-gray-700 text-sm">
                  S/N
                </th>
                <th className="text-left py-3 px-4 text-gray-700 text-sm">
                  Name
                </th>
                <th className="text-left py-3 px-4 text-gray-700 text-sm">
                  Username
                </th>
                <th className="text-left py-3 px-4 text-gray-700 text-sm">
                  Email
                </th>
                <th className="text-left py-3 px-4 text-gray-700 text-sm">
                  Phone
                </th>
                <th className="text-left py-3 px-4 text-gray-700 text-sm">
                  Type
                </th>
                <th className="text-left py-3 px-4 text-gray-700 text-sm">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-gray-500">
                    No staff found
                  </td>
                </tr>
              ) : (
                filteredStaff
                  .slice(startIndex, startIndex + Number(entriesPerPage))
                  .map((item, index) => (
                    <tr
                      key={item.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {startIndex + index + 1}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {item.name}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {item.user_name}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {item.email}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {item.phone}
                      </td>
                      <td className="py-3 px-4 text-sm capitalize text-gray-900">
                        {item.type}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <span
                          className={`px-2 py-1 text-xs rounded ${
                            item.status === "active"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default Staff;
