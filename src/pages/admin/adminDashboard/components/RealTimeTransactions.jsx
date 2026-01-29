import Chart from "react-apexcharts";

const defaultLabels = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const normalizeSeries = (values, count) => {
  const safeValues = Array.isArray(values)
    ? values.map((value) => (Number.isFinite(Number(value)) ? Number(value) : 0))
    : [];
  if (!count) return safeValues;
  if (safeValues.length >= count) return safeValues.slice(0, count);
  return safeValues.concat(Array.from({ length: count - safeValues.length }, () => 0));
};

const RealTimeTransactions = ({
  labels,
  purchased,
  redeemed,
  isLoading = false,
  isError = false,
}) => {
  const chartLabels =
    Array.isArray(labels) && labels.length > 0 ? labels : defaultLabels;
  const purchasedSeries = normalizeSeries(purchased, chartLabels.length);
  const redeemedSeries = normalizeSeries(redeemed, chartLabels.length);
  const options = {
    colors: ["#FF5A29", "#6366F1"], // Redeemed = orange, Purchased = purple
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "line",
      height: 388,
      stacked: false,
      toolbar: {
        show: false,
      },
    },
    stroke: {
      width: [0, 3], // Bar = 0, Line = 3
      curve: "smooth",
    },
    plotOptions: {
      bar: {
        columnWidth: "40%",
        borderRadius: 4,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: false,
    },
    labels: chartLabels,
    markers: {
      size: 4,
    },
    xaxis: {
      categories: chartLabels,
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      title: {
        text: undefined,
      },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
    },
    grid: {
      yaxis: {
        lines: { show: true },
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
    },
  };

  const series = [
    {
      name: "Redeemed",
      type: "column",
      data: redeemedSeries,
    },
    {
      name: "Purchased",
      type: "line",
      data: purchasedSeries,
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 sm:px-6 sm:pt-6 shadow-md">
      <div>
        <h3 className="text-lg font-semibold text-gray-800">
          Real-Time Transactions
        </h3>
      </div>
      <div className="w-full">
        {isLoading ? (
          <div className="min-h-[388px] flex items-center justify-center text-sm text-gray-500">
            Loading transactions...
          </div>
        ) : isError ? (
          <div className="min-h-[388px] flex items-center justify-center text-sm text-red-500">
            Failed to load real-time transactions.
          </div>
        ) : (
          <Chart options={options} series={series} type="line" height={388} />
        )}
      </div>
    </div>
  );
};

export default RealTimeTransactions;
