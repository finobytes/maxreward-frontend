import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import PageBreadcrumb from "../../../components/common/PageBreadcrumb";
import PrimaryButton from "../../../components/ui/PrimaryButton";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import ComponentCard from "../../../components/common/ComponentCard";
import { useShopWithMerchant } from "../../../redux/features/member/shopWithMerchant/useShopWithMerchant";

const RedeemWithMerchant = () => {
  const [fieldErrors, setFieldErrors] = useState({});
  const location = useLocation();
  const navigate = useNavigate();
  const merchantFromRoute = location.state?.merchant;
  const selectionType = location.state?.selectionType || "merchant_name";

  const {
    merchant,
    transactionAmount,
    transactionAmountValue,
    redeemAmount,
    redeemAmountValue,
    redeemPoints,
    balanceToPay,
    rmPoints,
    submittingPurchase,
    setMerchantContext,
    setTransactionAmount,
    setRedeemAmount,
    submitRedemption,
    resetShopWithMerchant,
    verifyData,
  } = useShopWithMerchant();

  const activeMerchant = merchant || merchantFromRoute;
  const availablePoints = verifyData?.wallet?.available_points ?? 0;

  useEffect(() => {
    if (merchantFromRoute) {
      setMerchantContext(merchantFromRoute, selectionType);
    }
  }, [merchantFromRoute, selectionType, setMerchantContext]);

  useEffect(() => {
    return () => {
      resetShopWithMerchant();
    };
  }, [resetShopWithMerchant]);

  if (!activeMerchant) {
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

  const validateInputs = () => {
    const nextErrors = {};

    if (!transactionAmountValue) {
      nextErrors.transactionAmount = "Transaction amount is required";
    }

    if (!redeemAmountValue) {
      nextErrors.redeemAmount = "Points to redeem is required";
    } else if (redeemAmountValue > availablePoints) {
      nextErrors.redeemAmount =
        "Points to Redeem cannot exceed Available Points";
    }

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handlePrimaryAction = async () => {
    if (!validateInputs()) return;

    const success = await submitRedemption({
      merchantId: activeMerchant?.id,
      merchantSelectionType: selectionType,
    });

    if (success) {
      navigate("/member/redeem-transactions");
    }
  };

  const primaryLabel = submittingPurchase
    ? "Submitting..."
    : "Submit Redemption";

  const formatCurrency = (value) => `RM ${Number(value ?? 0).toFixed(2)}`;

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
          {/* Redeem Form */}
          <div className="w-full md:w-1/2">
            <form
              className="max-w-[360px]"
              onSubmit={(e) => {
                e.preventDefault();
                handlePrimaryAction();
              }}
            >
              <div>
                <Label htmlFor="merchant-name">Merchant Name</Label>
                <Input
                  id="merchant-name"
                  value={activeMerchant?.business_name || ""}
                  disabled
                />
              </div>

              <div className="mt-6">
                <Label htmlFor="transaction-amount">
                  Transaction Amount (RM)
                </Label>
                <Input
                  id="transaction-amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={transactionAmount}
                  onChange={(e) => setTransactionAmount(e.target.value)}
                  placeholder="0.00"
                  error={!!fieldErrors.transactionAmount}
                  hint={fieldErrors.transactionAmount}
                />
              </div>

              {/* NEW FIELD — Available Points */}
              <div className="mt-6">
                <Label>Available Points</Label>
                <Input value={availablePoints} disabled />
              </div>

              {/* Updated Field — Points to Redeem */}
              <div className="mt-6">
                <Label htmlFor="redeem-amount">Points to Redeem</Label>
                <Input
                  id="redeem-amount"
                  type="number"
                  min="0"
                  value={redeemAmount}
                  onChange={(e) => {
                    const value = Number(e.target.value);

                    if (value > availablePoints) {
                      setFieldErrors((prev) => ({
                        ...prev,
                        redeemAmount: "Points cannot exceed available balance",
                      }));
                    } else {
                      setFieldErrors((prev) => ({
                        ...prev,
                        redeemAmount: null,
                      }));
                    }

                    setRedeemAmount(value);
                  }}
                  placeholder="0"
                  error={!!fieldErrors.redeemAmount}
                  hint={fieldErrors.redeemAmount}
                />
                {redeemAmountValue > 0 && (
                  <p className="mt-2 text-sm text-gray-500">
                    ≈{" "}
                    {redeemPoints.toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}{" "}
                    pts · 1 RM = {rmPoints} pts
                  </p>
                )}
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <Label htmlFor="balance-to-pay">Balance to Pay</Label>
                  <Input
                    id="balance-to-pay"
                    value={formatCurrency(balanceToPay)}
                    disabled
                  />
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3">
                <PrimaryButton
                  variant="primary"
                  size="md"
                  type="submit"
                  disabled={submittingPurchase}
                >
                  {primaryLabel}
                </PrimaryButton>
              </div>
            </form>
          </div>

          {/* Merchant Info Card */}
          <div className="w-full md:w-1/2">
            <div className="p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white">
              {activeMerchant?.business_logo ? (
                <img
                  src={activeMerchant.business_logo}
                  alt={activeMerchant.business_name}
                  className="w-full h-52 object-cover rounded-lg mb-4"
                />
              ) : (
                <div className="w-full h-52 bg-gray-100 rounded-lg mb-4 flex items-center justify-center text-gray-400">
                  No Logo
                </div>
              )}
              <h4 className="text-2xl lg:text-3xl font-semibold text-gray-800 mb-2">
                {activeMerchant.business_name}
              </h4>
              {activeMerchant?.category && (
                <p className="text-sm text-gray-500">
                  Category: {activeMerchant.category}
                </p>
              )}
              {activeMerchant?.address && (
                <p className="text-sm text-gray-500 mt-1">
                  Address: {activeMerchant.address}
                </p>
              )}
            </div>
          </div>
        </div>
      </ComponentCard>
    </div>
  );
};

export default RedeemWithMerchant;
