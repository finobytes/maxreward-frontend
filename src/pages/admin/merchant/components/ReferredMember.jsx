import { useState, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SearchInput from "@/components/form/form-elements/SearchInput";
import Pagination from "@/components/table/Pagination";
import PrimaryButton from "@/components/ui/PrimaryButton";

const ReferredMembers = ({ referredMemberData }) => {
  const referred = referredMemberData;

  console.log("referred members data", referred);

  const [search, setSearch] = useState("");

  // Laravel API data
  const currentPage = referred?.current_page || 1;
  const perPage = referred?.per_page || 20;
  const total = referred?.total || 0;
  const members = referred?.data || [];

  // 🔢 Absolute Serial Number
  const startIndex = (currentPage - 1) * perPage;

  // 🔍 Search filtering
  const filteredMembers = useMemo(() => {
    const s = search.toLowerCase();
    return members.filter(
      (item) =>
        item.name?.toLowerCase().includes(s) ||
        item.phone?.toLowerCase().includes(s) ||
        item.email?.toLowerCase().includes(s) ||
        item.user_name?.toLowerCase().includes(s)
    );
  }, [search, members]);

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between mb-4">
        <h2 className="font-semibold text-gray-800">Referred Members</h2>
        <PrimaryButton variant="secondary">Export CSV</PrimaryButton>
      </div>

      {/* Search */}
      <div className="flex justify-between mb-6">
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search members..."
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="py-2 px-4 text-left text-sm text-gray-700">S/N</th>
              <th className="py-2 px-4 text-left text-sm text-gray-700">
                Name
              </th>
              <th className="py-2 px-4 text-left text-sm text-gray-700">
                Phone
              </th>
              <th className="py-2 px-4 text-left text-sm text-gray-700">
                Email
              </th>
              <th className="py-2 px-4 text-left text-sm text-gray-700">
                Type
              </th>
              <th className="py-2 px-4 text-left text-sm text-gray-700">
                Points
              </th>
              <th className="py-2 px-4 text-left text-sm text-gray-700">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredMembers.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  No referred members found
                </td>
              </tr>
            ) : (
              filteredMembers.map((item, index) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-2 px-4 text-sm text-gray-900">
                    {startIndex + index + 1}
                  </td>

                  <td className="py-2 px-4 text-sm text-gray-900">
                    {item.name}
                  </td>

                  <td className="py-2 px-4 text-sm text-gray-900">
                    {item.phone}
                  </td>

                  <td className="py-2 px-4 text-sm text-gray-900">
                    {item.email}
                  </td>

                  <td className="py-2 px-4 text-sm capitalize text-gray-900">
                    {item.member_type}
                  </td>

                  <td className="py-2 px-4 text-sm text-gray-900">
                    {item.wallet?.total_points}
                  </td>

                  <td className="py-2 px-4 text-sm">
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
      <div className="mt-4">
        <Pagination
          currentPage={referred?.current_page}
          totalPages={referred?.last_page}
          onPageChange={(page) => console.log("Change page:", page)}
        />
      </div>
    </div>
  );
};

export default ReferredMembers;
