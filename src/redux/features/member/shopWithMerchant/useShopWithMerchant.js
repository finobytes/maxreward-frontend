import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { useGetCurrentSettingsQuery } from "../../admin/settings/settingsApi";
import {
  resetShopWithMerchant,
  setMerchant,
  setMerchantSelectionType,
  setPaymentMethod,
  setRedeemAmount,
  setSettings,
  setTransactionAmount,
  setVerified,
} from "./shopWithMerchantSlice";
import {
  useCheckMemberRedeemAmountMutation,
  useMakePurchaseForMemberMutation,
} from "./shopWihtMerchantApi";
import { useVerifyMeQuery } from "../../auth/authApi";

const normalizeSettings = (rawSettings) => {
  if (!rawSettings) return null;
  return (
    rawSettings?.setting_attribute?.maxreward ||
    rawSettings?.setting_attribute ||
    rawSettings ||
    null
  );
};

export const useShopWithMerchant = () => {
  const dispatch = useDispatch();
  const state = useSelector((s) => s.shopWithMerchant);
  const { data: verifyData, isLoading: verifyingMember } = useVerifyMeQuery();
  const { data: rawSettings, isLoading: settingsLoading } =
    useGetCurrentSettingsQuery();

  const [checkRedeemAmount, { isLoading: verifyingAmount }] =
    useCheckMemberRedeemAmountMutation();
  const [makePurchaseForMember, { isLoading: submittingPurchase }] =
    useMakePurchaseForMemberMutation();

  console.log("availablePoints:", verifyData?.wallet?.available_points);
  console.log("verifying Member:", verifyingMember);

  // hydrate settings (rm_points and friends)
  useEffect(() => {
    const normalized = normalizeSettings(rawSettings?.data ?? rawSettings);
    if (!normalized) return;

    const hasChanged =
      !state.settings ||
      JSON.stringify(normalized) !== JSON.stringify(state.settings);

    if (hasChanged) {
      dispatch(setSettings(normalized));
    }
  }, [dispatch, rawSettings, state.settings]);

  const handleMerchantContext = useCallback(
    (merchant, selectionType = "merchant_name") => {
      if (merchant) {
        dispatch(setMerchant(merchant));
      }
      if (selectionType) {
        dispatch(setMerchantSelectionType(selectionType));
      }
    },
    [dispatch]
  );

  const updateTransactionAmount = useCallback(
    (value) => dispatch(setTransactionAmount(value)),
    [dispatch]
  );

  const updateRedeemAmount = useCallback(
    (value) => dispatch(setRedeemAmount(value)),
    [dispatch]
  );

  const updatePaymentMethod = useCallback(
    (method) => dispatch(setPaymentMethod(method)),
    [dispatch]
  );

  const resetState = useCallback(
    () => dispatch(resetShopWithMerchant()),
    [dispatch]
  );

  const verifyRedeemAmount = useCallback(async () => {
    if (!state.redeemAmountValue) {
      toast.error("Enter redeem amount before verifying.");
      return false;
    }

    const formData = new FormData();
    formData.append("redeem_amount", state.redeemAmountValue);

    try {
      const res = await checkRedeemAmount(formData).unwrap();

      if (res?.success) {
        toast.success(res?.message || "You have sufficient points!");
        dispatch(setVerified(true));
        return true;
      }

      toast.error(res?.message || "Insufficient points for redemption.");
      dispatch(setVerified(false));
      return false;
    } catch (error) {
      toast.error(
        error?.data?.message ||
          "Unable to verify redeem amount. Please try again."
      );
      dispatch(setVerified(false));
      return false;
    }
  }, [checkRedeemAmount, dispatch, state.redeemAmountValue]);

  const submitRedemption = useCallback(
    async ({
      merchantId,
      merchantSelectionType,
      paymentMethod,
      status = "pending",
    } = {}) => {
      const effectiveMerchantId = merchantId ?? state.merchantId;
      if (!effectiveMerchantId) {
        toast.error("Merchant information is missing.");
        return false;
      }

      if (!state.transactionAmountValue || !state.redeemAmountValue) {
        toast.error("Provide both transaction and redeem amounts.");
        return false;
      }

      if (!state.verified) {
        toast.error("Verify the redeem amount before submitting.");
        return false;
      }

      const payload = {
        merchant_id: effectiveMerchantId,
        transaction_amount: state.transactionAmountValue,
        redeem_amount: state.redeemAmountValue,
        cash_redeem_amount: state.cashRedeemAmount,
        payment_method: paymentMethod ?? state.paymentMethod,
        status,
        merchant_selection_type:
          merchantSelectionType ?? state.merchantSelectionType,
      };

      try {
        const res = await makePurchaseForMember(payload).unwrap();
        toast.success(res?.message || "Redemption submitted successfully.");
        dispatch(resetShopWithMerchant());
        return true;
      } catch (error) {
        toast.error(
          error?.data?.message || "Failed to submit redemption request."
        );
        return false;
      }
    },
    [
      dispatch,
      makePurchaseForMember,
      state.cashRedeemAmount,
      state.merchantId,
      state.merchantSelectionType,
      state.paymentMethod,
      state.redeemAmountValue,
      state.transactionAmountValue,
      state.verified,
    ]
  );

  return {
    ...state,
    settingsLoading,
    verifyingAmount,
    verifyData,
    submittingPurchase,
    setMerchantContext: handleMerchantContext,
    setTransactionAmount: updateTransactionAmount,
    setRedeemAmount: updateRedeemAmount,
    setPaymentMethod: updatePaymentMethod,
    verifyRedeemAmount,
    submitRedemption,
    resetShopWithMerchant: resetState,
  };
};
