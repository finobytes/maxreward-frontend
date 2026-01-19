import React from "react";
import { useParams, Link } from "react-router";
import PageBreadcrumb from "../../../components/common/PageBreadcrumb";
import { useGetTransactionDetailsQuery } from "../../../redux/features/member/pointStatement/pointStatementMemberApi";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  FileText,
  TrendingUp,
  TrendingDown,
  User,
  Building2,
  Users,
  Info,
} from "lucide-react";

const typeMapping = {
  pp: "Personal Points",
  rp: "Referral Points",
  cp: "Community Points",
  cr: "Company Reserve",
  dp: "Deducted Points",
  ap: "Added Points",
  vrp: "Voucher Referral Points",
  vap: "Voucher Available Points",
};

const formatDateTime = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "-";

  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const TransactionDetails = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useGetTransactionDetailsQuery(id);

  // console.log("id-------------", id);
  // const data = [];
  // const isLoading = false;
  // const isError = false;

  if (isLoading) {
    return (
      <div>
        <PageBreadcrumb
          items={[
            { label: "Home", to: "/member" },
            { label: "CP Transaction", to: "/member/cp-transaction" },
            { label: "Transaction Details" },
          ]}
        />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <PageBreadcrumb
          items={[
            { label: "Home", to: "/member" },
            { label: "CP Transaction", to: "/member/point-statement" },
            { label: "Transaction Details" },
          ]}
        />
        <div className="text-center text-red-500 py-10 bg-white rounded-xl border border-red-200">
          <p className="text-lg font-semibold">
            Failed to load transaction details.
          </p>
          <Link
            to="/member/point-statement"
            className="mt-4 inline-flex items-center gap-2 text-brand-600 hover:text-brand-700"
          >
            <ArrowLeft size={18} />
            Back to CP Transaction
          </Link>
        </div>
      </div>
    );
  }

  if (!data?.data) {
    return (
      <div>
        <PageBreadcrumb
          items={[
            { label: "Home", to: "/member" },
            { label: "CP Transaction", to: "/member/cp-transaction" },
            { label: "Transaction Details" },
          ]}
        />
        <div className="text-center text-gray-500 py-10 bg-white rounded-xl">
          No transaction data found.
        </div>
      </div>
    );
  }

  const transaction = data.data;
  const isDebit = transaction.points_type === "debited";

  return (
    <div>
      <PageBreadcrumb
        items={[
          { label: "Home", to: "/member" },
          { label: "CP Transaction", to: "/member/cp-transaction" },
          { label: "Transaction Details" },
        ]}
      />

      {/* Back Button */}
      <div className="mb-4">
        <Link
          to="/member/cp-transaction"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-brand-600 transition-colors"
        >
          <ArrowLeft size={18} />
          <span className="font-medium">Back to CP Transaction</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ---------------- Transaction Overview ---------------- */}
        <section className="lg:col-span-3 bg-white shadow-md border border-gray-100 rounded-2xl overflow-hidden">
          <div
            className={`bg-gradient-to-r ${
              isDebit
                ? "from-red-500 to-red-600"
                : "from-brand-500 to-purple-600"
            } p-6 text-white`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-3xl font-bold flex items-center gap-3">
                  <FileText className="w-8 h-8" />
                  Transaction #{transaction.id}
                </h2>
                <p className="text-sm opacity-90 mt-2 flex items-center gap-2">
                  <Calendar size={16} />
                  {formatDateTime(transaction.created_at)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-90 mb-1">Transaction Points</p>
                <div className="flex items-center gap-2">
                  {isDebit ? (
                    <TrendingDown className="w-6 h-6" />
                  ) : (
                    <TrendingUp className="w-6 h-6" />
                  )}
                  <span className="text-4xl font-bold">
                    {isDebit ? "-" : "+"}
                    {parseFloat(transaction.transaction_points).toFixed(2)}
                  </span>
                </div>
                <p className="text-sm opacity-90 mt-1">Points</p>
              </div>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <InfoCard
              icon={<DollarSign className="text-brand-600" />}
              label="Transaction Type"
              value={
                typeMapping[transaction.transaction_type] ||
                transaction.transaction_type
              }
            />
            <InfoCard
              icon={
                isDebit ? (
                  <TrendingDown className="text-red-600" />
                ) : (
                  <TrendingUp className="text-green-600" />
                )
              }
              label="Points Type"
              value={
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                    isDebit
                      ? "bg-red-100 text-red-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {transaction.points_type.charAt(0).toUpperCase() +
                    transaction.points_type.slice(1)}
                </span>
              }
            />
            <InfoCard
              icon={<Calendar className="text-purple-600" />}
              label="Created At"
              value={formatDateTime(transaction.created_at)}
            />
            <InfoCard
              icon={<Calendar className="text-indigo-600" />}
              label="Updated At"
              value={formatDateTime(transaction.updated_at)}
            />
          </div>
        </section>

        {/* ---------------- Transaction Reason ---------------- */}
        <section className="lg:col-span-3 bg-white shadow-md border border-gray-100 rounded-2xl p-6">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <Info className="text-brand-600" /> Transaction Reason
          </h2>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-gray-800 text-base leading-relaxed">
              {transaction.transaction_reason || "No reason provided"}
            </p>
          </div>
        </section>

        {/* ---------------- Member Information ---------------- */}
        {transaction.member && (
          <section className="bg-white shadow-md border border-gray-100 rounded-2xl p-6">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <User className="text-brand-600" /> Member Information
            </h2>
            <ul className="divide-y divide-gray-200 space-y-3">
              <InfoRow label="Member ID" value={`#${transaction.member.id}`} />
              <InfoRow label="Name" value={transaction.member.name} />
              <InfoRow label="Username" value={transaction.member.user_name} />
              <InfoRow label="Phone" value={transaction.member.phone} />
              <InfoRow label="Email" value={transaction.member.email} />
              <InfoRow label="Address" value={transaction.member.address} />
              <InfoRow
                label="Member Type"
                value={
                  <span className="inline-flex rounded-full px-2 py-1 text-xs font-medium bg-blue-100 text-blue-600 capitalize">
                    {transaction.member.member_type}
                  </span>
                }
              />
              <InfoRow label="Gender" value={transaction.member.gender_type} />
              <InfoRow
                label="Status"
                value={
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium capitalize ${
                      transaction.member.status === "active"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {transaction.member.status}
                  </span>
                }
              />
              <InfoRow
                label="Referral Code"
                value={transaction.member.referral_code}
              />
              <InfoRow
                label="Created By"
                value={transaction.member.member_created_by}
              />
            </ul>
          </section>
        )}
      </div>
    </div>
  );
};

export default TransactionDetails;

// ---------------- Small Reusable Components ----------------
const InfoRow = ({ label, value }) => (
  <li className="flex justify-between items-start py-3 first:pt-0">
    <span className="text-gray-500 text-sm font-medium">{label}</span>
    <span className="text-gray-800 font-medium text-sm text-right ml-4">
      {value || "-"}
    </span>
  </li>
);

const InfoCard = ({ icon, label, value }) => (
  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
    <div className="flex items-center gap-2 mb-2">{icon}</div>
    <p className="text-xs text-gray-500 mb-1">{label}</p>
    <p className="text-sm font-semibold text-gray-800">{value}</p>
  </div>
);
