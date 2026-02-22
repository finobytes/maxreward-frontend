import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useSelector } from "react-redux";
import { useVerifyPaymentMutation } from "../redux/features/member/voucherPurchase/voucherApi";
import { toast } from "sonner";
import { CheckCircle2, XCircle } from "lucide-react";
import ComponentCard from "../components/common/ComponentCard";

const VoucherPaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [verifyPayment, { isLoading }] = useVerifyPaymentMutation();
  const [status, setStatus] = useState("verifying"); // verifying, success, error

  // Prevent double execution in React Strict Mode
  const hasVerified = useRef(false);

  const redirectPath =
    user?.role === "merchant"
      ? "/merchant/voucher-purchase"
      : "/member/purchase-voucher";

  useEffect(() => {
    if (!sessionId) {
      toast.error("Invalid session.");
      navigate("/");
      return;
    }

    if (hasVerified.current) return;
    hasVerified.current = true;

    const verify = async () => {
      try {
        const res = await verifyPayment({ session_id: sessionId }).unwrap();
        if (res?.success) {
          setStatus("success");
          toast.success("Payment verified successfully!");
        } else {
          setStatus("error");
          toast.error(res?.message || "Payment verification failed.");
        }
      } catch {
        setStatus("error");
        toast.error("An error occurred while verifying payment.");
      }
    };

    verify();
  }, [sessionId, verifyPayment, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <ComponentCard className="max-w-md w-full text-center p-8">
        {isLoading || status === "verifying" ? (
          <div>
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500 mx-auto mb-6"></div>
            <h2 className="text-2xl font-semibold mb-2">
              Verifying Payment...
            </h2>
            <p className="text-gray-500 mb-6">
              Please do not close this window.
            </p>
          </div>
        ) : status === "success" ? (
          <div>
            <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold mb-2">Payment Successful!</h2>
            <p className="text-gray-500 mb-6">
              Your voucher has been generated successfully.
            </p>
            <button
              onClick={() => navigate(redirectPath)}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Go to Voucher List
            </button>
          </div>
        ) : (
          <div>
            <XCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold mb-2">Verification Failed</h2>
            <p className="text-gray-500 mb-6">
              We could not verify your payment.
            </p>
            <button
              onClick={() => navigate(redirectPath)}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Back to Voucher List
            </button>
          </div>
        )}
      </ComponentCard>
    </div>
  );
};

export default VoucherPaymentSuccess;
