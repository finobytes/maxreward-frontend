const dateFormatter = new Intl.DateTimeFormat(undefined, {
  year: "numeric",
  month: "short",
  day: "numeric",
});
const numberFormatter = new Intl.NumberFormat();

const normalizeText = (value) =>
  value === null || value === undefined ? "" : String(value).toLowerCase();

const toNumber = (value) => {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
};

const parseDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const getOrderSearchText = (order) =>
  [
    order?.order_number,
    order?.tracking_number,
    order?.member?.name,
    order?.member?.phone,
    order?.member?.email,
    order?.total_amount_display,
    order?.total_points,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

const isWithinDateFilter = (value, filter) => {
  if (!filter || filter === "all") return true;
  const date = parseDate(value);
  if (!date) return false;

  const now = new Date();
  const start = new Date(now);

  switch (filter) {
    case "today":
      start.setHours(0, 0, 0, 0);
      return date >= start && date <= now;
    case "last_7":
      start.setDate(start.getDate() - 7);
      return date >= start && date <= now;
    case "last_30":
      start.setDate(start.getDate() - 30);
      return date >= start && date <= now;
    default:
      return true;
  }
};

export const PER_PAGE_OPTIONS = [
  { label: "10", value: 10 },
  { label: "20", value: 20 },
  { label: "50", value: 50 },
];

export const DATE_FILTER_OPTIONS = [
  { label: "All time", value: "all" },
  { label: "Today", value: "today" },
  { label: "Last 7 days", value: "last_7" },
  { label: "Last 30 days", value: "last_30" },
];

export const SORT_OPTIONS = [
  { label: "Newest first", value: "newest" },
  { label: "Oldest first", value: "oldest" },
  { label: "Points high to low", value: "points_desc" },
  { label: "Points low to high", value: "points_asc" },
];

export const formatDate = (value) => {
  if (!value) return "-";
  const date = parseDate(value);
  if (!date) return "-";
  return dateFormatter.format(date);
};

export const formatPoints = (value, { prefix = "" } = {}) => {
  const numeric = toNumber(value);
  if (numeric === null) return "-";
  const sign = prefix && numeric > 0 ? prefix : "";
  return `${sign}${numberFormatter.format(numeric)} pts`;
};

export const getOrderTotalDisplay = (order) => {
  if (order?.total_amount_display) return order.total_amount_display;
  const totalPoints = toNumber(
    order?.total_points ?? order?.totalPoints ?? order?.total
  );
  return totalPoints !== null ? formatPoints(totalPoints) : "-";
};

export const filterOrders = (orders = [], { search, dateFilter } = {}) => {
  const normalizedSearch = normalizeText(search).trim();

  return orders.filter((order) => {
    if (normalizedSearch) {
      const haystack = getOrderSearchText(order);
      if (!haystack.includes(normalizedSearch)) return false;
    }

    if (!isWithinDateFilter(order?.created_at, dateFilter)) return false;

    return true;
  });
};

export const sortOrders = (orders = [], sortBy = "newest") => {
  const sorted = [...orders];

  switch (sortBy) {
    case "oldest":
      sorted.sort((a, b) => {
        const aDate = parseDate(a?.created_at)?.getTime() ?? 0;
        const bDate = parseDate(b?.created_at)?.getTime() ?? 0;
        return aDate - bDate;
      });
      break;
    case "points_desc":
      sorted.sort(
        (a, b) =>
          (toNumber(b?.total_points) ?? 0) - (toNumber(a?.total_points) ?? 0)
      );
      break;
    case "points_asc":
      sorted.sort(
        (a, b) =>
          (toNumber(a?.total_points) ?? 0) - (toNumber(b?.total_points) ?? 0)
      );
      break;
    case "newest":
    default:
      sorted.sort((a, b) => {
        const aDate = parseDate(a?.created_at)?.getTime() ?? 0;
        const bDate = parseDate(b?.created_at)?.getTime() ?? 0;
        return bDate - aDate;
      });
      break;
  }

  return sorted;
};
