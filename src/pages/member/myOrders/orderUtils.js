const dateFormatter = new Intl.DateTimeFormat(undefined, {
  year: "numeric",
  month: "short",
  day: "numeric",
});
const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});
const numberFormatter = new Intl.NumberFormat();

const toNumber = (value) => {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
};

const formatAddress = (parts) => {
  const filtered = parts
    .map((part) => (typeof part === "string" ? part.trim() : part))
    .filter(Boolean);
  return filtered.length ? filtered.join(", ") : "-";
};

export const formatValue = (value) =>
  value === null || value === undefined || value === "" ? "-" : value;

export const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return dateFormatter.format(date);
};

export const formatDateTime = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return dateTimeFormatter.format(date);
};

export const formatPoints = (value) => {
  const numeric = toNumber(value);
  if (numeric === null) return "-";
  return `${numberFormatter.format(numeric)} pts`;
};

export const formatReasonType = (value) => {
  if (!value) return "-";
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export const getCustomerAddress = (order) =>
  formatAddress([
    order?.customer_address,
    order?.customer_city,
    order?.customer_state,
    order?.customer_postcode,
    order?.customer_country,
  ]);

export const getMerchantName = (merchant) =>
  merchant?.business_name || merchant?.name || merchant?.businessName || "N/A";

export const getItemsCount = (order) => {
  const count = order?.items_count ?? order?.items?.length;
  return typeof count === "number" ? count : null;
};

export const getItemsLabel = (order) => {
  const count = getItemsCount(order);
  if (count === null) return "-";
  return `${count} ${count === 1 ? "item" : "items"}`;
};

export const getOrderTotalDisplay = (order) => {
  if (order?.total_amount_display) return order.total_amount_display;
  const totalPoints = toNumber(
    order?.total_points ?? order?.totalPoints ?? order?.total
  );
  return totalPoints !== null ? formatPoints(totalPoints) : "-";
};

export const getOrderShippingDisplay = (order) => {
  const shippingPoints = toNumber(order?.shipping_points ?? order?.shippingPoints);
  if (shippingPoints === null || shippingPoints === 0) return null;
  return formatPoints(shippingPoints);
};

export const getOrderShippingPointsDisplay = (order) => {
  const shippingPoints = toNumber(order?.shipping_points ?? order?.shippingPoints);
  if (shippingPoints === null) return "-";
  return formatPoints(shippingPoints);
};

export const normalizeStatus = (status) =>
  typeof status === "string" ? status.toLowerCase() : "";

export const getItemName = (item) =>
  item?.product?.name || item?.product_name || item?.name || "Item";

export const getItemSkuOrVariant = (item) =>
  item?.sku ||
  item?.product_variation?.sku ||
  item?.productVariation?.sku ||
  item?.product_variation?.name ||
  item?.productVariation?.name ||
  item?.variation?.name ||
  "-";

export const getLineItemPoints = (item) => {
  const lineTotal = toNumber(item?.total_points ?? item?.totalPoints);
  if (lineTotal !== null) return lineTotal;
  const pointsEach = toNumber(item?.points ?? item?.point);
  const quantity = toNumber(item?.quantity ?? item?.qty);
  if (pointsEach !== null && quantity !== null) {
    return pointsEach * quantity;
  }
  return pointsEach;
};

export const getCancelReason = (order) =>
  order?.cancel_reason ||
  order?.cancelReason ||
  order?.return_reason ||
  order?.returnReason ||
  null;
