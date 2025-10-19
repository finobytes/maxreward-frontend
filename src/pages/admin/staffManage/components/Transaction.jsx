import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  Hand,
  Users,
  UserCheck,
  ChevronDown,
  Search,
} from "lucide-react";

import Pagination from "./../../../../components/table/Pagination";
import PrimaryButton from "../../../../components/ui/PrimaryButton";
import SearchInput from "../../../../components/form/form-elements/SearchInput";

const mockData = [
  {
    date: "01-Sept-25",
    method: "Bank",
    description: "Voucher Purchase (RM-10)",
    status: "Approved",
    points: "+1,000",
  },
  {
    date: "02-Sept-25",
    method: "QR",
    description: "Referral Bonus",
    status: "Pending",
    points: "+250",
  },
  {
    date: "03-Sept-25",
    method: "QR",
    description: "Product Purchase-ID72364",
    status: "Approved",
    points: "-950",
  },
  {
    date: "04-Sept-25",
    method: "QR",
    description: "Referral Bonus",
    status: "Approved",
    points: "+250",
  },
  {
    date: "05-Sept-25",
    method: "Online",
    description: "Voucher Purchase (RM-10)",
    status: "Approved",
    points: "+1,000",
  },
  {
    date: "06-Sept-25",
    method: "Bank",
    description: "Product Purchase-ID72366",
    status: "Pending",
    points: "-1,000",
  },
  {
    date: "07-Sept-25",
    method: "QR",
    description: "Referral Bonus",
    status: "Approved",
    points: "+250",
  },
  {
    date: "08-Sept-25",
    method: "Bank",
    description: "Withdrawal (RM-10)",
    status: "Approved",
    points: "-1000",
  },
  {
    date: "09-Sept-25",
    method: "QR",
    description: "Product Purchase-ID72364",
    status: "Approved",
    points: "-500",
  },
  {
    date: "10-Sept-25",
    method: "Bank",
    description: "Referral Bonus",
    status: "Approved",
    points: "+250",
  },
];

const Transaction = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState("10");
  const [search, setSearch] = useState("");

  const totalPages = 5;
  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
        <div className="bg-white border-0 shadow-sm p-2 rounded-b-sm">
          <div className="">
            <div className="flex justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-1">Salary / Month</p>
                <p className="text-xl font-semibold text-gray-900">12,432</p>
              </div>
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border-0 shadow-sm p-2 rounded-b-sm">
          <div className="">
            <div className="flex justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-1">Received</p>
                <p className="text-xl font-semibold text-gray-900">12,432</p>
              </div>
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <Hand className="w-4 h-4 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border-0 shadow-sm p-2 rounded-b-sm">
          <div className="">
            <div className="flex justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-1">Loan Taken</p>
                <p className="text-xl font-semibold text-gray-900">12,432</p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border-0 shadow-sm p-2 rounded-b-sm">
          <div className="">
            <div className="flex justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-1">Loan Paid</p>
                <p className="text-xl font-semibold text-gray-900">45</p>
                <p className="text-xs text-green-500 mt-1">+0.892 Increased</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <UserCheck className="w-4 h-4 text-blue-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Statement Section */}
      <div className="mt-6 p-4">
        <div className="lg:flex lg:items-center lg:justify-between">
          <h2 className="font-semibold text-gray-900">User Statement</h2>
          <div className="flex gap-2 mt-2 lg:mt-0">
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
            {/* <span className="text-sm text-gray-600">entries</span> */}
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
                  <div className="">Date</div>
                </th>
                <th className="text-left py-3 px-4 text-gray-700 text-sm">
                  Method
                </th>
                <th className="text-left py-3 px-4 text-gray-700 text-sm">
                  Description
                </th>
                <th className="text-left py-3 px-4 text-gray-700 text-sm">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-gray-700 text-sm">
                  Points
                </th>
              </tr>
            </thead>
            <tbody>
              {mockData.map((transaction, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 text-xs px-4 text-gray-900">
                    {transaction.date}
                  </td>
                  <td className="py-3 px-4 text-xs text-gray-900">
                    {transaction.method}
                  </td>
                  <td className="py-3 px-4 text-xs text-gray-900">
                    {transaction.description}
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      variant={
                        transaction.status === "Approved"
                          ? "default"
                          : "secondary"
                      }
                      className={
                        transaction.status === "Approved"
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                      }
                    >
                      {transaction.status}
                    </Badge>
                  </td>
                  <td
                    className={`py-3 px-4 text-xs ${
                      transaction.points.startsWith("+")
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.points}
                  </td>
                </tr>
              ))}
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

export default Transaction;
