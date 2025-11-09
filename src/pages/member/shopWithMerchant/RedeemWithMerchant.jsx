import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import PageBreadcrumb from "../../../components/common/PageBreadcrumb";
import PrimaryButton from "./../../../components/ui/PrimaryButton";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import { ArrowRight } from "lucide-react";
import ComponentCard from "./../../../components/common/ComponentCard";
import { toast } from "sonner";
import { useCheckMemberRedeemAmountMutation } from "../../../redux/features/member/shopWithMerchant/shopWihtMerchantApi";

const RedeemWithMerchant = () => {
  const [verified, setVerified] = useState(false);
  const [transactionAmount, setTransactionAmount] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const merchant = location.state?.merchant;

  const [checkRedeemAmount, { isLoading }] =
    useCheckMemberRedeemAmountMutation();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      redeem_amount: "",
    },
  });

  // 🛑 Prevent direct access without merchant data
  if (!merchant) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          No Merchant Selected
        </h2>
        <PrimaryButton
          variant="primary"
          size="md"
          onClick={() => navigate("/member/shop-with-merchant")}
        >
          Go Back to Search
        </PrimaryButton>
      </div>
    );
  }

  const onVerify = async (data) => {
    const { redeem_amount } = data;

    if (!redeem_amount) {
      setError("redeem_amount", {
        type: "manual",
        message: "Please enter redeem amount",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("redeem_amount", redeem_amount);

      const res = await checkRedeemAmount(formData).unwrap();

      if (!res.success) {
        // show error under input field
        setError("redeem_amount", {
          type: "manual",
          message: res.message || "Insufficient points for redemption",
        });
      } else {
        toast.success("You have sufficient points!");
        setVerified(true);
      }
    } catch (err) {
      setError("redeem_amount", {
        type: "manual",
        message: err?.data?.message || "Insufficient points for redemption",
      });
    }
  };

  return (
    <div>
      <PageBreadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: "Shop With Merchants", to: "/member/shop-with-merchant" },
          { label: "Redeem With Registered Merchants" },
        ]}
      />

      <ComponentCard title="Merchant Details" className="mt-6">
        <div className="w-full block md:flex justify-center items-start gap-8">
          {/* ✅ Redeem Form */}
          <div className="w-full md:w-1/2">
            <form className="max-w-[343px]" onSubmit={handleSubmit(onVerify)}>
              <div>
                <Label htmlFor="merchant-name">Merchant Name</Label>
                <Input
                  id="merchant-name"
                  value={merchant.business_name}
                  disabled
                />
              </div>

              <div className="mt-6">
                <Label htmlFor="transaction-amount">Transaction Amount</Label>
                <Input
                  id="transaction-amount"
                  type="number"
                  value={transactionAmount}
                  onChange={(e) => setTransactionAmount(e.target.value)}
                  placeholder="Enter amount"
                />
              </div>

              <div className="mt-6">
                <Label htmlFor="redeem-amount">Redeem Amount</Label>
                <Input
                  id="redeem-amount"
                  type="number"
                  placeholder="Enter amount"
                  {...register("redeem_amount")}
                  error={!!errors.redeem_amount}
                  hint={errors.redeem_amount?.message}
                />
              </div>

              {verified && (
                <div className="mt-6">
                  <Label htmlFor="balance-to-pay">Balance to Pay</Label>
                  <Input
                    id="balance-to-pay"
                    value={`RM ${
                      transactionAmount -
                      (Number(errors.redeem_amount?.message) || 0)
                    }`}
                    disabled
                  />
                </div>
              )}

              <div className="mt-8">
                <PrimaryButton
                  variant="primary"
                  size="md"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading
                    ? "Checking..."
                    : verified
                    ? "Continue"
                    : "Verify Purchase"}
                </PrimaryButton>
              </div>
            </form>
          </div>

          {/* ✅ Merchant Info Card */}
          <div className="w-full md:w-1/2">
            <div className="p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white">
              {merchant.business_logo ? (
                <img
                  src={merchant.business_logo}
                  alt={merchant.business_name}
                  className="w-full h-52 object-cover rounded-lg mb-4"
                />
              ) : (
                <div className="w-full h-52 bg-gray-100 rounded-lg mb-4 flex items-center justify-center text-gray-400">
                  No Logo
                </div>
              )}
              <h4 className="text-2xl lg:text-3xl font-semibold text-gray-800 mb-2">
                {merchant.business_name}
              </h4>
            </div>
          </div>
        </div>
      </ComponentCard>
    </div>
  );
};

export default RedeemWithMerchant;
