import React from "react";
import Chart from "react-apexcharts";

const PurchasedVsRedeemed = () => {
  const redeemed = 186758;
  const issued = 232389;
  const liability = issued - redeemed;

  const series = [
    45, // Redeemed %
    55, // Issued %
  ];
  const options = {
    chart: {
      type: "radialBar",
      height: 350,
      toolbar: {
        show: false,
      },
    },
    colors: ["#6366F1", "#FF5A29"], // Redeemed = Blue, Purchased = Orange
    plotOptions: {
      radialBar: {
        hollow: {
          margin: 0,
          size: "65%",
        },
        track: {
          background: "#f2f2f2",
          strokeWidth: "100%",
        },
        dataLabels: {
          show: true,
          name: { show: true, fontSize: "20px" },
          value: { show: true, fontSize: "20px" },
          total: {
            show: true,
            label: "Points Liability",
            fontSize: "14px",
            fontWeight: 500,
            color: "#111827",
            formatter: () => liability.toLocaleString(),
          },
        },
      },
    },
    labels: ["Purchased", "Redeemed"],
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 py-5 sm:px-6 sm:pt-6 shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Purchased vs Redeemed
      </h3>
      <div className="flex justify-center">
        <Chart
          options={options}
          series={series}
          type="radialBar"
          height={300}
        />
      </div>
      <div className="flex justify-around mt-4 text-center">
        <div>
          <span className="flex items-center justify-center text-sm text-gray-600">
            <span className="w-2 h-2 rounded-full bg-indigo-500 mr-2"></span>
            Purchased
          </span>
          <p className="font-semibold text-gray-800">186,758</p>
        </div>
        <div>
          <span className="flex items-center justify-center text-sm text-gray-600">
            <span className="w-2 h-2 rounded-full bg-orange-500 mr-2"></span>
            Redeemed
          </span>
          <p className="font-semibold text-gray-800">232,389</p>
        </div>
      </div>
    </div>
  );
};

export default PurchasedVsRedeemed;
