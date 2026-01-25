import Chart from "react-apexcharts";

const PointsIssuedRedeemed = ({ issued = 0, redeemed = 0, liability }) => {
  const issuedValue = Number.isFinite(Number(issued)) ? Number(issued) : 0;
  const redeemedValue = Number.isFinite(Number(redeemed)) ? Number(redeemed) : 0;
  const liabilityValue = Number.isFinite(Number(liability))
    ? Number(liability)
    : Math.max(0, issuedValue - redeemedValue);
  const total = issuedValue + redeemedValue;
  const series =
    total > 0
      ? [(redeemedValue / total) * 100, (issuedValue / total) * 100]
      : [0, 0];

  const options = {
    chart: {
      type: "radialBar",
      height: 350,
      toolbar: {
        show: false,
      },
    },
    colors: ["#6366F1", "#FF5A29"], // Redeemed = Blue, Issued = Orange
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
            formatter: () => liabilityValue.toLocaleString(),
          },
        },
      },
    },
    labels: ["Points Redeemed", "Points Issued"],
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 py-5 sm:px-6 sm:pt-6 shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Points Issued vs Redeemed
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
            Points Redeemed
          </span>
          <p className="font-semibold text-gray-800">
            {redeemedValue.toLocaleString()}
          </p>
        </div>
        <div>
          <span className="flex items-center justify-center text-sm text-gray-600">
            <span className="w-2 h-2 rounded-full bg-orange-500 mr-2"></span>
            Points Issued
          </span>
          <p className="font-semibold text-gray-800">
            {issuedValue.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PointsIssuedRedeemed;
