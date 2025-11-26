import React from "react";
import { useParams, Link } from "react-router";
import PageBreadcrumb from "../../../components/common/PageBreadcrumb";
import { useGetAdminCpUnlockHistoryDetailsQuery } from "../../../redux/features/admin/cpUnlockHistory/cpUnlockHistoryAdminApi";
import {
  ArrowLeft,
  Calendar,
  FileText,
  TrendingUp,
  User,
  Users,
  Info,
  Unlock,
} from "lucide-react";

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

const CpUnlockHistoryDetails = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useGetAdminCpUnlockHistoryDetailsQuery(id);

  if (isLoading) {
    return (
      <div>
        <PageBreadcrumb
          items={[
            { label: "Home", to: "/admin" },
            { label: "CP Unlock History", to: "/admin/cp-unlock-history" },
            { label: "Unlock History Details" },
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
            { label: "CP Unlock History", to: "/admin/cp-unlock-history" },
            { label: "Unlock History Details" },
          ]}
        />
        <div className="text-center text-red-500 py-10 bg-white rounded-xl border border-red-200">
          <p className="text-lg font-semibold">Failed to load unlock history details.</p>
          <Link
            to="/admin/cp-unlock-history"
            className="mt-4 inline-flex items-center gap-2 text-brand-600 hover:text-brand-700"
          >
            <ArrowLeft size={18} />
            Back to CP Unlock History
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
            { label: "CP Unlock History", to: "/admin/cp-unlock-history" },
            { label: "Unlock History Details" },
          ]}
        />
        <div className="text-center text-gray-500 py-10 bg-white rounded-xl">
          No unlock history data found.
        </div>
      </div>
    );
  }

  const history = data.data;

  return (
    <div>
      <PageBreadcrumb
        items={[
          { label: "Home", to: "/admin" },
          { label: "CP Unlock History", to: "/admin/cp-unlock-history" },
          { label: "Unlock History Details" },
        ]}
      />

      {/* Back Button */}
      <div className="mb-4">
        <Link
          to="/admin/cp-unlock-history"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-brand-600 transition-colors"
        >
          <ArrowLeft size={18} />
          <span className="font-medium">Back to CP Unlock History</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ---------------- Unlock History Overview ---------------- */}
        <section className="lg:col-span-2 bg-white shadow-md border border-gray-100 rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-brand-500 to-purple-600 p-6 text-white">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-3xl font-bold flex items-center gap-3">
                  <Unlock className="w-8 h-8" />
                  CP Unlock History #{history.id}
                </h2>
                <p className="text-sm opacity-90 mt-2 flex items-center gap-2">
                  <Calendar size={16} />
                  {formatDateTime(history.created_at)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-90 mb-1">Released CP Amount</p>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-6 h-6" />
                  <span className="text-4xl font-bold">
                    +{parseFloat(history.released_cp_amount).toFixed(2)}
                  </span>
                </div>
                <p className="text-sm opacity-90 mt-1">CP</p>
              </div>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <InfoCard
              icon={<Users className="text-blue-600" />}
              label="Previous Referrals"
              value={history.previous_referrals ?? "-"}
            />
            <InfoCard
              icon={<Users className="text-green-600" />}
              label="New Referrals"
              value={history.new_referrals ?? "-"}
            />
            <InfoCard
              icon={<TrendingUp className="text-gray-600" />}
              label="Previous Level"
              value={
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 font-semibold">
                  {history.previous_unlocked_level ?? "-"}
                </span>
              }
            />
            <InfoCard
              icon={<TrendingUp className="text-purple-600" />}
              label="New Level"
              value={
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-600 font-semibold">
                  {history.new_unlocked_level ?? "-"}
                </span>
              }
            />
          </div>
        </section>

        {/* ---------------- Member Information ---------------- */}
        {history.member && (
          <section className="lg:col-span-2 bg-white shadow-md border border-gray-100 rounded-2xl p-6">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <User className="text-brand-600" /> Member Information
            </h2>
            <ul className="divide-y divide-gray-200 space-y-3">
              <InfoRow label="Member ID" value={`#${history.member.id}`} />
              <InfoRow label="Name" value={history.member.name} />
              <InfoRow label="Username" value={history.member.user_name} />
              <InfoRow label="Phone" value={history.member.phone} />
              <InfoRow label="Email" value={history.member.email} />
              <InfoRow
                label="Member Type"
                value={
                  <span className="inline-flex rounded-full px-2 py-1 text-xs font-medium bg-blue-100 text-blue-600 capitalize">
                    {history.member.member_type}
                  </span>
                }
              />
              <InfoRow
                label="Status"
                value={
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium capitalize ${
                      history.member.status === "active"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {history.member.status}
                  </span>
                }
              />
              <InfoRow
                label="Referral Code"
                value={history.member.referral_code}
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
                {formatDateTime(history.created_at)}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-xs text-gray-500 mb-1 flex items-center gap-2">
                <Calendar size={14} />
                Updated At
              </p>
              <p className="text-sm font-semibold text-gray-800">
                {formatDateTime(history.updated_at)}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CpUnlockHistoryDetails;

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
