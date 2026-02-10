import React from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PageBreadcrumb from "../../../components/common/PageBreadcrumb";
import StatusBadge from "../../../components/table/StatusBadge";
import { useGetMerchantOrderDetailsQuery } from "../../../redux/features/merchant/orders/merchantOrderApi";
import {
  formatDateTime,
  formatReasonType,
  formatValue,
  getCancelReason,
  getCustomerAddress,
  getItemName,
  getItemSkuOrVariant,
  getItemsLabel,
  getLineItemPoints,
  getMemberName,
  getOrderShippingPointsDisplay,
  getOrderTotalDisplay,
  formatPoints,
} from "./orderTableUtils";

const DetailItem = ({ label, value, mono = false, span = 1 }) => (
  <div
    className={`rounded-lg border border-gray-200 bg-gray-50 p-3 ${
      span === 2 ? "sm:col-span-2" : ""
    }`}
  >
    <p className="text-xs text-gray-500">{label}</p>
    <div
      className={
        mono ? "font-mono text-sm text-gray-900" : "text-sm text-gray-900"
      }
    >
      {value ?? "-"}
    </div>
  </div>
);

const DetailGrid = ({ items, columns = "sm:grid-cols-2" }) => (
  <div className={`grid grid-cols-1 ${columns} gap-4`}>
    {items.map((item, index) => (
      <DetailItem
        key={`${item.label}-${index}`}
        label={item.label}
        value={item.value}
        mono={item.mono}
        span={item.span}
      />
    ))}
  </div>
);

const DetailsSection = ({ title, children }) => (
  <div className="space-y-2">
    <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
    {children}
  </div>
);

const OrderItemsTable = ({ items }) => {
  if (!items?.length) {
    return <div className="text-sm text-gray-500">No items found.</div>;
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>SKU / Variant</TableHead>
            <TableHead>Qty</TableHead>
            <TableHead>Points</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, index) => {
            const skuOrVariant = getItemSkuOrVariant(item);
            const skuClassName =
              item?.sku ||
              item?.product_variation?.sku ||
              item?.productVariation?.sku
                ? "text-xs font-mono text-gray-700"
                : "text-sm text-gray-700";
            const quantity = item?.quantity ?? item?.qty ?? "-";
            const linePoints = getLineItemPoints(item);

            return (
              <TableRow key={item?.id || index}>
                <TableCell className="font-medium">
                  {getItemName(item)}
                </TableCell>
                <TableCell className={skuClassName}>{skuOrVariant}</TableCell>
                <TableCell>{quantity}</TableCell>
                <TableCell>
                  {linePoints !== null ? formatPoints(linePoints) : "-"}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

const getBackLink = (status) => {
  const s = status?.toLowerCase();
  if (s === "pending") return "/merchant/orders/pending-order";
  if (s === "shipped") return "/merchant/orders/shipped-order";
  if (s === "completed") return "/merchant/orders/complete-order";
  if (s === "cancelled") return "/merchant/orders/cancel-order";
  if (s === "returned" || s === "exchanged")
    return "/merchant/orders/exchanged-order";
  return "/merchant/orders/pending-order";
};

const MerchantOrderDetails = () => {
  const { orderNumber } = useParams();
  const {
    data: detailsData,
    isLoading,
    error,
  } = useGetMerchantOrderDetailsQuery(orderNumber, {
    skip: !orderNumber,
  });

  const order = detailsData?.data;
  const member = order?.member;
  const cancelReason = getCancelReason(order);
  const reasonDetailsFallback = order?.cancelled_reason;
  const reasonDetailsValue =
    cancelReason?.reason_details || reasonDetailsFallback || "";

  const backLink = getBackLink(order?.status);

  const breadcrumbItems = [
    { label: "Dashboard", to: "/merchant" },
    { label: "Orders", to: backLink },
    { label: "Order Details" },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageBreadcrumb items={breadcrumbItems} />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageBreadcrumb items={breadcrumbItems} />
        <div className="text-center text-red-500 py-10 bg-white rounded-xl border border-red-200">
          <p className="text-lg font-semibold">Failed to load order details.</p>
          <Link
            to={backLink}
            className="mt-4 inline-flex items-center gap-2 text-brand-600 hover:text-brand-700"
          >
            <ArrowLeft size={18} />
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="space-y-6">
        <PageBreadcrumb items={breadcrumbItems} />
        <div className="text-center text-gray-500 py-10 bg-white rounded-xl border border-gray-200">
          No order details found.
        </div>
      </div>
    );
  }

  const summaryItems = [
    {
      label: "Order Number",
      value: formatValue(order.order_number),
      mono: true,
    },
    {
      label: "Status",
      value: order.status ? <StatusBadge status={order.status} /> : "-",
    },
    { label: "Placed On", value: formatDateTime(order.created_at) },
    { label: "Updated On", value: formatDateTime(order.updated_at) },
    order.completed_at && {
      label: "Completed On",
      value: formatDateTime(order.completed_at),
    },
    {
      label: "Tracking Number",
      value: formatValue(order.tracking_number),
      mono: true,
    },
    { label: "Items", value: getItemsLabel(order) },
    { label: "Total Points", value: getOrderTotalDisplay(order) },
    {
      label: "Shipping Points",
      value: getOrderShippingPointsDisplay(order),
    },
    order.total_weight && {
      label: "Total Weight",
      value: formatValue(order.total_weight),
    },
  ].filter(Boolean);

  const customerItems = [
    { label: "Name", value: getMemberName(member) },
    { label: "Email", value: formatValue(member?.email), mono: true },
    { label: "Phone", value: formatValue(member?.phone), mono: true },
    { label: "Address", value: getCustomerAddress(order), span: 2 },
  ];

  const reasonItems = [
    cancelReason?.reason_type && {
      label: "Type",
      value: formatReasonType(cancelReason.reason_type),
    },
    reasonDetailsValue && {
      label: "Details",
      value: formatValue(reasonDetailsValue),
      span: 2,
    },
    cancelReason?.cancelled_by_type && {
      label: "Cancelled By",
      value: formatReasonType(cancelReason.cancelled_by_type),
    },
    cancelReason?.created_at && {
      label: "Logged At",
      value: formatDateTime(cancelReason.created_at),
    },
  ].filter(Boolean);

  return (
    <div className="space-y-6">
      <PageBreadcrumb items={breadcrumbItems} />

      <div className="flex items-center justify-between">
        <Link
          to={backLink}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-brand-600 transition-colors"
        >
          <ArrowLeft size={18} />
          <span className="font-medium">Back to Orders</span>
        </Link>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-6">
        <DetailsSection title="Order Summary">
          <DetailGrid items={summaryItems} />
        </DetailsSection>

        <DetailsSection title="Customer Details">
          <DetailGrid items={customerItems} />
        </DetailsSection>

        <DetailsSection title="Items">
          <OrderItemsTable items={order.items} />
        </DetailsSection>

        {reasonItems.length > 0 && (
          <DetailsSection title="Return/Cancellation Reason">
            <DetailGrid items={reasonItems} />
          </DetailsSection>
        )}
      </div>
    </div>
  );
};

export default MerchantOrderDetails;
