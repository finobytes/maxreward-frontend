// src/redux/features/member/voucherPurchase/useVoucherForm.js
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useGetAllDenominationsQuery } from "../../admin/denomination/denominationApi";
import { useGetCurrentSettingsQuery } from "../../admin/settings/settingsApi";
import { useVerifyMeQuery } from "../../auth/authApi";
import { useCreateVoucherMutation } from "./voucherApi";
import {
  setDenomination,
  setQuantityForDenom,
  setPaymentMethod,
  setManualDocs,
  setSettings,
  setVoucherType,
  calculateTotal,
  resetVoucher,
  setMemberId,
} from "./voucherFormSlice";

export const useVoucherForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const state = useSelector((s) => s.voucherForm);
  const { user } = useSelector((state) => state.auth);
  const role = user?.role || "member"; // admin | merchant | member

  const { data: verifyData, isLoading: verifying } = useVerifyMeQuery(role);
  const { data: denomData, isLoading: denomLoading } =
    useGetAllDenominationsQuery();
  const { data: settingsData, isLoading: settingsLoading } =
    useGetCurrentSettingsQuery();
  const [createVoucher, { isLoading: creating }] = useCreateVoucherMutation();
  useEffect(() => {
    const memberId =
      verifyData?.user?.merchant?.corporate_member?.id || // corporate member
      verifyData?.user?.merchant?.corporate_member_id || // direct corporate member id
      verifyData?.user?.member?.id || // member id
      verifyData?.user?.data?.id || // fallback
      verifyData?.user?.id; // fallback
    if (memberId && memberId !== state.memberId) {
      dispatch(setMemberId(memberId));
    }
  }, [verifyData, state.memberId, dispatch]);
  useEffect(() => {
    const normalizedSettings =
      settingsData?.setting_attribute?.maxreward ||
      settingsData?.setting_attribute ||
      settingsData ||
      null;

    if (!normalizedSettings) return;

    const hasChanged =
      !state.settings ||
      JSON.stringify(state.settings) !== JSON.stringify(normalizedSettings);

    if (hasChanged) {
      dispatch(setSettings(normalizedSettings));
      dispatch(calculateTotal());
    }
  }, [settingsData, state.settings, dispatch]);

  const denominations =
    denomData?.data?.denominations || denomData?.denominations || [];

  const handleCreateVoucher = async () => {
    try {
      if (!state.selectedDenominations.length) {
        toast.error("Please select at least one denomination.");
        return;
      }

      const denomHistory = state.selectedDenominations
        .filter((d) => d.quantity > 0)
        .map((d) => ({
          denomination_id: d.id,
          quantity: d.quantity,
        }));

      if (!denomHistory.length) {
        toast.error("Please select at least one denomination.");
        return;
      }

      if (state.paymentMethod === "manual" && !state.manualPaymentDocs) {
        toast.error("Payment proof is required for manual payments.");
        return;
      }

      const formData = new FormData();
      formData.append(
        "member_id",
        state.memberId ||
          verifyData?.user?.id ||
          verifyData?.user?.data?.id ||
          verifyData?.user?.member?.id
      );
      formData.append("voucher_type", state.voucherType);
      formData.append("payment_method", state.paymentMethod.toLowerCase());
      formData.append("quantity", String(state.totalQuantity || 0));
      formData.append("total_amount", String(state.totalAmount || 0));

      denomHistory.forEach((item, index) => {
        formData.append(
          `denomination_history[${index}][denomination_id]`,
          String(item.denomination_id)
        );
        formData.append(
          `denomination_history[${index}][quantity]`,
          String(item.quantity)
        );
      });

      if (state.paymentMethod === "manual" && state.manualPaymentDocs) {
        formData.append("manual_payment_docs", state.manualPaymentDocs);
      }

      const res = await createVoucher(formData).unwrap();

      if (res?.success) {
        toast.success(res.message || "Voucher created successfully!");
        dispatch(resetVoucher());
        if (role === "member") {
          navigate("/member/purchase-voucher");
        } else {
          navigate("/merchant/voucher-purchase");
        }
      } else {
        toast.error(res?.message || "Failed to create voucher.");
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.data?.message || "Something went wrong!");
    }
  };

  return {
    ...state,
    denominations,
    denomLoading,
    settingsLoading,
    verifying,
    creating,
    setDenomination: (denom) => dispatch(setDenomination(denom)),
    updateQuantity: (payload) => dispatch(setQuantityForDenom(payload)),
    setPaymentMethod: (method) => dispatch(setPaymentMethod(method)),
    setManualDocs: (file) => dispatch(setManualDocs(file)),
    setVoucherType: (type) => dispatch(setVoucherType(type)),
    handleCreateVoucher,
  };
};
