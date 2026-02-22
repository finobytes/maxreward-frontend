import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useSelector } from "react-redux";
import { useCancelPaymentMutation } from "../redux/features/member/voucherPurchase/voucherApi";
import { XCircle } from "lucide-react";
import ComponentCard from "../components/common/ComponentCard";

const VoucherPaymentCancel = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [cancelPayment, { isLoading }] = useCancelPaymentMutation();

  const redirectPath =
    user?.role === "merchant"
      ? "/merchant/voucher-purchase"
      : "/member/purchase-voucher";

  useEffect(() => {
    if (sessionId) {
      cancelPayment({ session_id: sessionId })
        .unwrap()
        .catch((err) => console.error("Cancel failed:", err));
    }
  }, [sessionId, cancelPayment]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <ComponentCard className="max-w-md w-full text-center p-8">
        <XCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
        <h2 className="text-2xl font-semibold mb-2">Payment Cancelled</h2>
        <p className="text-gray-500 mb-6">
          Your payment process has been cancelled.
        </p>
        <button
          onClick={() => navigate(redirectPath)}
          className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors"
        >
          Back to Voucher List
        </button>
      </ComponentCard>
    </div>
  );
};

export default VoucherPaymentCancel;
