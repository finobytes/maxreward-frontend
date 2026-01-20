import React, { useState } from "react";
import { useGetMyOrdersQuery } from "../../../redux/features/member/orders/memberOrderApi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import StatusBadge from "../../../components/table/StatusBadge";
import Pagination from "../../../components/table/Pagination";

const CancleOrder = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useGetMyOrdersQuery({
    page,
    status: "cancelled",
    per_page: 10,
  });

  const orders = data?.data?.data || [];
  const meta = data?.data || {};

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Cancelled Orders</h1>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-4">
        <div className="relative overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Merchant</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Refunded Points</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-red-500"
                  >
                    Failed to load orders.
                  </TableCell>
                </TableRow>
              ) : orders.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-gray-500"
                  >
                    No cancelled orders found.
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order.id} className="opacity-75">
                    <TableCell className="font-medium">
                      {order.order_number}
                    </TableCell>
                    <TableCell>
                      {new Date(order.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{order.merchant?.name || "N/A"}</TableCell>
                    <TableCell>
                      <span className="font-semibold">
                        {order.total_amount_display ||
                          `${order.total_points} pts`}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-green-600 font-medium">
                        +{order.total_points} pts
                      </span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={order.status} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-end">
          <Pagination
            currentPage={meta.current_page || 1}
            totalPages={meta.last_page || 1}
            onPageChange={setPage}
          />
        </div>
      </div>
    </div>
  );
};

export default CancleOrder;
