import React, { useState } from "react";
import { Link } from "react-router";
import { Eye } from "lucide-react";
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
import {
  formatDate,
  getItemsLabel,
  getMerchantName,
  getOrderShippingDisplay,
  getOrderTotalDisplay,
} from "./orderUtils";

const TableStateRow = ({ colSpan, className = "", children }) => (
  <TableRow>
    <TableCell
      colSpan={colSpan}
      className={`text-center py-8 ${className}`}
    >
      {children}
    </TableCell>
  </TableRow>
);

const OrderRow = ({ order }) => {
  const shippingDisplay = getOrderShippingDisplay(order);
  const orderNumber = order?.order_number || "";
  const viewPath = orderNumber
    ? `/member/orders/${encodeURIComponent(orderNumber)}`
    : null;
  const viewActionClass =
    "p-2 hover:bg-gray-50 text-gray-600 rounded-md transition-colors flex items-center gap-1 text-xs font-medium border border-gray-200";

  return (
    <TableRow>
      <TableCell className="font-medium">
        <span
          className="font-mono text-xs sm:text-sm"
          title={orderNumber ? orderNumber : "Order number unavailable"}
        >
          {orderNumber || "-"}
        </span>
      </TableCell>
      <TableCell>{formatDate(order?.created_at)}</TableCell>
      <TableCell>{getMerchantName(order?.merchant)}</TableCell>
      <TableCell className="text-sm">{getItemsLabel(order)}</TableCell>
      <TableCell>
        <div className="flex flex-col">
          <span className="font-semibold">{getOrderTotalDisplay(order)}</span>
          {shippingDisplay && (
            <span className="text-xs text-gray-500">
              Shipping: {shippingDisplay}
            </span>
          )}
        </div>
      </TableCell>
      <TableCell>
        <StatusBadge status={order?.status} />
      </TableCell>
      <TableCell className="text-right">
        {viewPath ? (
          <Link to={viewPath} className={viewActionClass} title="View Details">
            <Eye size={14} /> View
          </Link>
        ) : (
          <span
            className={`${viewActionClass} cursor-not-allowed text-gray-400 bg-gray-50`}
            title="Order number unavailable"
            aria-disabled="true"
          >
            <Eye size={14} /> View
          </span>
        )}
      </TableCell>
    </TableRow>
  );
};

const OrdersTable = ({ orders, isLoading, error }) => {
  const renderRows = () => {
    if (isLoading) {
      return <TableStateRow colSpan={7}>Loading...</TableStateRow>;
    }

    if (error) {
      return (
        <TableStateRow colSpan={7} className="text-red-500">
          Failed to load orders.
        </TableStateRow>
      );
    }

    if (!orders.length) {
      return (
        <TableStateRow colSpan={7} className="text-gray-500">
          No returned orders found.
        </TableStateRow>
      );
    }

    return orders.map((order, index) => (
      <OrderRow key={order?.id || order?.order_number || index} order={order} />
    ));
  };

  return (
    <div className="relative overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order Number</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Merchant</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Total Points</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>{renderRows()}</TableBody>
      </Table>
    </div>
  );
};

const ReturnOrder = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useGetMyOrdersQuery({
    page,
    status: "returned",
    per_page: 10,
  });

  const orders = data?.data?.data || [];
  const meta = data?.data || {};

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Returned Orders</h1>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-4">
        <OrdersTable orders={orders} isLoading={isLoading} error={error} />

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

export default ReturnOrder;
