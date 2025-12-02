import React from "react";
import { useParams, Link } from "react-router";
import PageBreadcrumb from "../../../components/common/PageBreadcrumb";
import { useGetAdminCpTransactionDetailsQuery } from "../../../redux/features/admin/cpTransaction/cpTransactionAdminApi";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  FileText,
  TrendingUp,
  TrendingDown,
  User,
  Users,
  Info,
  Lock,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

const transactionTypeMapping = {
  earned: "Earned",
  spent: "Spent",
  transferred: "Transferred",
  refunded: "Refunded",
};

const statusIcons = {
  available: <CheckCircle className="text-green-600" />,
  locked: <Lock className="text-yellow-600" />,
  released: <CheckCircle className="text-blue-600" />,
  expired: <XCircle className="text-red-600" />,
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

const CpTransactionDetails = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useGetAdminCpTransactionDetailsQuery(id);

  if (isLoading) {
    return (
      <div>
        <PageBreadcrumb
          items={[
            { label: "Home", to: "/admin" },
            { label: "CP Distribution Report", to: "/admin/cp-transaction" },
            { label: "CP Distribution Report Details" },
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
            { label: "Home", to: "/admin" },
            { label: "CP Transaction", to: "/admin/cp-transaction" },
            { label: "Transaction Details" },
          ]}
        />
        <div className="text-center text-red-500 py-10 bg-white rounded-xl border border-red-200">
          <p className="text-lg font-semibold">
            Failed to load transaction details.
          </p>
          <Link
            to="/admin/cp-transaction"
            className="mt-4 inline-flex items-center gap-2 text-brand-600 hover:text-brand-700"
          >
            <ArrowLeft size={18} />
            Back to CP Transactions
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
            { label: "Home", to: "/admin" },
            { label: "CP Transaction", to: "/admin/cp-transaction" },
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
  const isNegative =
    transaction.transaction_type === "spent" ||
    transaction.transaction_type === "transferred";

  return (
    <div>
      <PageBreadcrumb
        items={[
          { label: "Home", to: "/admin" },
          { label: "CP Transaction", to: "/admin/cp-transaction" },
          { label: "Transaction Details" },
        ]}
      />

      {/* Back Button */}
      <div className="mb-4">
        <Link
          to="/admin/cp-transaction"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-brand-600 transition-colors"
        >
          <ArrowLeft size={18} />
          <span className="font-medium">Back to CP Transactions</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ---------------- Transaction Overview ---------------- */}
        <section className="lg:col-span-2 bg-white shadow-md border border-gray-100 rounded-2xl overflow-hidden">
          <div
            className={`bg-gradient-to-r ${
              isNegative
                ? "from-red-500 to-red-600"
                : "from-brand-500 to-purple-600"
            } p-6 text-white`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-3xl font-bold flex items-center gap-3">
                  <FileText className="w-8 h-8" />
                  CP Transaction #{transaction.id}
                </h2>
                <p className="text-sm opacity-90 mt-2 flex items-center gap-2">
                  <Calendar size={16} />
                  {formatDateTime(transaction.created_at)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-90 mb-1">CP Amount</p>
                <div className="flex items-center gap-2">
                  {isNegative ? (
                    <TrendingDown className="w-6 h-6" />
                  ) : (
                    <TrendingUp className="w-6 h-6" />
                  )}
                  <span className="text-4xl font-bold">
                    {isNegative ? "-" : "+"}
                    {parseFloat(transaction.cp_amount).toFixed(2)}
                  </span>
                </div>
                <p className="text-sm opacity-90 mt-1">CP</p>
              </div>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <InfoCard
              icon={<DollarSign className="text-brand-600" />}
              label="Transaction Type"
              value={
                transactionTypeMapping[transaction.transaction_type] ||
                transaction.transaction_type
              }
            />
            <InfoCard
              icon={
                statusIcons[transaction.status] || (
                  <Info className="text-gray-600" />
                )
              }
              label="Status"
              value={
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                    transaction.status === "available"
                      ? "bg-green-100 text-green-600"
                      : transaction.status === "locked"
                      ? "bg-yellow-100 text-yellow-600"
                      : transaction.status === "released"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {transaction.status.charAt(0).toUpperCase() +
                    transaction.status.slice(1)}
                </span>
              }
            />
            <InfoCard
              icon={<TrendingUp className="text-purple-600" />}
              label="CP Percentage"
              value={
                transaction.cp_percentage
                  ? `${transaction.cp_percentage}%`
                  : "-"
              }
            />
            <InfoCard
              icon={<Users className="text-indigo-600" />}
              label="Level"
              value={
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-600 font-semibold">
                  {transaction.level ?? "-"}
                </span>
              }
            />
          </div>
        </section>

        {/* ---------------- Recipient Member Information ---------------- */}
        {transaction.recipient_member && (
          <section className="bg-white shadow-md border border-gray-100 rounded-2xl p-6">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <User className="text-brand-600" /> Recipient Member
            </h2>
            <ul className="divide-y divide-gray-200 space-y-3">
              <InfoRow
                label="Member ID"
                value={`#${transaction.recipient_member.id}`}
              />
              <InfoRow label="Name" value={transaction.recipient_member.name} />
              <InfoRow
                label="Username"
                value={transaction.recipient_member.user_name}
              />
              <InfoRow
                label="Phone"
                value={transaction.recipient_member.phone}
              />
              <InfoRow
                label="Email"
                value={transaction.recipient_member.email}
              />
              <InfoRow
                label="Member Type"
                value={
                  <span className="inline-flex rounded-full px-2 py-1 text-xs font-medium bg-blue-100 text-blue-600 capitalize">
                    {transaction.recipient_member.member_type}
                  </span>
                }
              />
              <InfoRow
                label="Status"
                value={
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium capitalize ${
                      transaction.recipient_member.status === "active"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {transaction.recipient_member.status}
                  </span>
                }
              />
              <InfoRow
                label="Referral Code"
                value={transaction.recipient_member.referral_code}
              />
            </ul>
          </section>
        )}

        {/* ---------------- Source Member Information ---------------- */}
        {transaction.source_member && (
          <section className="bg-white shadow-md border border-gray-100 rounded-2xl p-6">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <Users className="text-green-600" /> Source Member
            </h2>
            <ul className="divide-y divide-gray-200 space-y-3">
              <InfoRow
                label="Member ID"
                value={`#${transaction.source_member.id}`}
              />
              <InfoRow label="Name" value={transaction.source_member.name} />
              <InfoRow
                label="Username"
                value={transaction.source_member.user_name}
              />
              <InfoRow label="Phone" value={transaction.source_member.phone} />
              <InfoRow label="Email" value={transaction.source_member.email} />
              <InfoRow
                label="Member Type"
                value={
                  <span className="inline-flex rounded-full px-2 py-1 text-xs font-medium bg-blue-100 text-blue-600 capitalize">
                    {transaction.source_member.member_type}
                  </span>
                }
              />
              <InfoRow
                label="Status"
                value={
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium capitalize ${
                      transaction.source_member.status === "active"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {transaction.source_member.status}
                  </span>
                }
              />
              <InfoRow
                label="Referral Code"
                value={transaction.source_member.referral_code}
              />
            </ul>
          </section>
        )}

        {/* ---------------- Additional Information ---------------- */}
        <section className="lg:col-span-2 bg-white shadow-md border border-gray-100 rounded-2xl p-6">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <Info className="text-brand-600" /> Additional Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-xs text-gray-500 mb-1 flex items-center gap-2">
                <Calendar size={14} />
                Created At
              </p>
              <p className="text-sm font-semibold text-gray-800">
                {formatDateTime(transaction.created_at)}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-xs text-gray-500 mb-1 flex items-center gap-2">
                <Calendar size={14} />
                Updated At
              </p>
              <p className="text-sm font-semibold text-gray-800">
                {formatDateTime(transaction.updated_at)}
              </p>
            </div>
            {transaction.locked_until && (
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <p className="text-xs text-yellow-600 mb-1 flex items-center gap-2">
                  <Lock size={14} />
                  Locked Until
                </p>
                <p className="text-sm font-semibold text-yellow-800">
                  {formatDateTime(transaction.locked_until)}
                </p>
              </div>
            )}
            {transaction.released_at && (
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-xs text-blue-600 mb-1 flex items-center gap-2">
                  <CheckCircle size={14} />
                  Released At
                </p>
                <p className="text-sm font-semibold text-blue-800">
                  {formatDateTime(transaction.released_at)}
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default CpTransactionDetails;

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
