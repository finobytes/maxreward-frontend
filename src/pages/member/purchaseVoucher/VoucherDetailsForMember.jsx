import React from "react";
import { useParams } from "react-router";
import PageBreadcrumb from "../../../components/common/PageBreadcrumb";
import { useGetVoucherByIdForMemberQuery } from "../../../redux/features/member/voucherPurchase/voucherApi";
import {
  BadgeCheck,
  CreditCard,
  DollarSign,
  FileText,
  User,
} from "lucide-react";
import VoucherDetailsSkeleton from "../../../components/skeleton/VoucherDetailsSkeleton";

const VoucherDetailsForMember = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useGetVoucherByIdForMemberQuery(id);

  if (isLoading) return <VoucherDetailsSkeleton />;
  if (isError)
    return (
      <div className="text-center text-red-500 py-10">
        Failed to load voucher details.
      </div>
    );
  if (!data)
    return (
      <div className="text-center text-gray-500 py-10">
        No voucher data found.
      </div>
    );

  return (
    <div>
      <PageBreadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: "Voucher Purchase", to: "/admin/voucher-manage" },
          { label: "Voucher Details" },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* ---------------- Voucher Overview ---------------- */}
        <section className="bg-white shadow-md border border-gray-100 rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-brand-500 to-purple-600 p-5 text-white">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <FileText className="w-6 h-6 " /> Voucher ID#{data.id}
            </h2>
            <p className="text-sm opacity-90 mt-1">
              Purchase Date {new Date(data.created_at).toLocaleString()}
            </p>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Voucher Type</span>
              <span className="font-medium capitalize">
                {data.voucher_type} voucher
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-500">Payment Method</span>
              <span className="font-medium capitalize">
                {data.payment_method}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-500">Quantity</span>
              <span className="font-medium">{data.quantity}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-500">Total Amount</span>
              <span className="font-bold text-lg text-green-600">
                RM {data.total_amount}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-500">Status</span>
              <span
                className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  data.status === "success"
                    ? "bg-green-100 text-green-700"
                    : data.status === "failed"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {data.status}
              </span>
            </div>
          </div>
        </section>

        {/* ---------------- Member Information ---------------- */}
        <section className="bg-white shadow-md border border-gray-100 rounded-2xl p-6">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <User className="text-brand-600" /> Member Information
          </h2>
          <ul className="divide-y divide-gray-200">
            <InfoRow label="Name" value={data.member?.name} />
            <InfoRow label="Phone" value={data.member?.phone} />
            <InfoRow label="Email" value={data.member?.email} />
            <InfoRow label="Address" value={data.member?.address} />
            <InfoRow label="Member Type" value={data.member?.member_type} />
            <InfoRow label="Referral Code" value={data.member?.referral_code} />
            <InfoRow label="Status" value={data.member?.status} />
          </ul>
        </section>

        {/* ---------------- Payment & Denomination Info ---------------- */}
        <section className="bg-white shadow-md border border-gray-100 rounded-2xl p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <CreditCard className="text-brand-600" /> Payment & Denomination
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 2xl:gap-20">
            <div className="space-y-3">
              <InfoRow label="Payment Method" value={data.payment_method} />
              <InfoRow
                label="Created At"
                value={new Date(data.created_at).toLocaleString()}
              />
              <div>
                {/* Denomination Table */}
                <h3 className="text-lg font-semibold mt-8 mb-3">
                  Denomination History
                </h3>

                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-3 text-left">Denomination ID</th>
                        <th className="p-3 text-left">Value (RM)</th>
                        <th className="p-3 text-left">Quantity</th>
                        <th className="p-3 text-left">Total Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.denomination_history?.map((item, index) => (
                        <tr key={index} className="border-t">
                          <td className="p-3">{item.denomination_id}</td>
                          <td className="p-3">{item.value}</td>
                          <td className="p-3">{item.quantity}</td>
                          <td className="p-3 font-semibold text-green-700">
                            RM {item.totalAmount}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-gray-600 font-medium mb-2">
                Manual Payment Proof
              </p>
              {data.manual_payment_docs_url ? (
                <a
                  href={data.manual_payment_docs_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={data.manual_payment_docs_url}
                    alt="Payment Proof"
                    className="w-full max-w-sm rounded-lg border hover:scale-105 transition-transform"
                  />
                </a>
              ) : (
                <p className="text-gray-400 italic">No document uploaded</p>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default VoucherDetailsForMember;

// ---------------- Small Reusable Row Component ----------------
const InfoRow = ({ label, value }) => (
  <li className="flex justify-between py-2">
    <span className="text-gray-500 text-sm">{label}</span>
    <span className="text-gray-800 font-medium text-sm text-right">
      {value || "-"}
    </span>
  </li>
);
