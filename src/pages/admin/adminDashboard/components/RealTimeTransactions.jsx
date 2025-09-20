import Chart from "react-apexcharts";

const RealTimeTransactions = () => {
  const options = {
    colors: ["#FF5A29", "#6366F1"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "line",
      height: 400,
      stacked: false,
      toolbar: {
        show: false,
      },
    },
    stroke: {
      width: [0, 3],
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
    xaxis: {
      categories: [
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
      ],
      axisBorder: { show: false },
      axisTicks: { show: false },
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
      data: [30, 20, 30, 40, 20, 30, 15, 30, 55, 30, 20, 25],
    },
    {
      name: "Purchased",
      type: "line",
      data: [28, 25, 35, 32, 38, 33, 20, 50, 60, 35, 40, 50],
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 sm:px-6 sm:pt-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800">
          Real-Time Transactions
        </h3>
      </div>
      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[640px] xl:min-w-full pl-2">
          <Chart options={options} series={series} type="line" height={400} />
        </div>
      </div>
    </div>
  );
};

export default RealTimeTransactions;
